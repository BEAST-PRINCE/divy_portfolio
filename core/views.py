from __future__ import annotations

from typing import Optional

from django.contrib import messages
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET, require_http_methods

from .models import ContactMessage
from .services.analytics_service import log_page_visit
from .services.email_service import send_contact_email
from .services.github_service import get_default_featured_projects
from .services.resume_service import get_resume_content


def home(request):
    resume_data = get_resume_content()
    return render(request, "core/index.html", {"resume": resume_data})


@require_GET
def projects_featured_api(request):
    try:
        count = int(request.GET.get("count", "6"))
    except ValueError:
        count = 6

    count = max(1, min(count, 12))
    projects = get_default_featured_projects(count=count)
    return JsonResponse({"projects": projects})


def _extract_client_ip(request) -> Optional[str]:
    """
    Attempts to extract client IP address (supports basic reverse proxy setups).
    """

    xff = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if xff:
        return xff.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


@require_GET
def log_page_visit_api(request):
    page_name = (request.GET.get("page_name") or "").strip()
    if not page_name:
        page_name = "/"

    ip_address = _extract_client_ip(request)
    try:
        log_page_visit(page_name=page_name, ip_address=ip_address)
    except Exception:
        # Analytics should never break the main UX.
        pass

    return JsonResponse({"ok": True})


@require_http_methods(["GET", "POST"])
def contact_submit(request):
    resume_data = get_resume_content()

    if request.method == "POST":
        name = (request.POST.get("name") or "").strip()
        email = (request.POST.get("email") or "").strip()
        message = (request.POST.get("message") or "").strip()

        try:
            contact = ContactMessage(name=name, email=email, message=message)
            contact.full_clean()  # model-level validation
            contact.save()

            # Email sending is done in a service to keep the view thin.
            send_contact_email(name=name, email=email, message=message)
            messages.success(request, "Message sent successfully. I'll get back to you soon.")
        except ValidationError as e:
            # Flatten ValidationError for user-friendly output.
            if hasattr(e, "message_dict") and isinstance(e.message_dict, dict) and e.message_dict:
                first_val = next(iter(e.message_dict.values()))
                if isinstance(first_val, list) and first_val:
                    err_msg = str(first_val[0])
                else:
                    err_msg = str(first_val)
            else:
                err_msg = str(e)
            messages.error(request, f"Please check your input. {err_msg}")
        except Exception:
            messages.error(request, "Could not send your message right now. Please try again later.")

    return render(request, "core/index.html", {"resume": resume_data})