from typing import Optional

from django.conf import settings
from django.core.mail import send_mail
from django.core.mail.message import EmailMessage


def send_contact_email(name: str, email: str, message: str) -> None:
    """
    Sends the contact form submission using the configured SMTP backend.
    """

    to_email = getattr(settings, "CONTACT_TO_EMAIL", "") or getattr(settings, "EMAIL_HOST_USER", "")
    if not to_email:
        raise RuntimeError("CONTACT_TO_EMAIL (or EMAIL_HOST_USER) is not configured.")

    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "") or to_email
    subject = f"Portfolio Contact - {name}"

    body = (
        "You received a new portfolio contact submission.\n\n"
        f"From: {name} <{email}>\n\n"
        "Message:\n"
        f"{message}\n"
    )

    send_mail(
        subject=subject,
        message=body,
        from_email=from_email,
        recipient_list=[to_email],
        fail_silently=False,
    )


def build_contact_email_preview(name: str, email: str, message: str) -> EmailMessage:
    """
    Utility for debugging / admin previews.
    """

    to_email = getattr(settings, "CONTACT_TO_EMAIL", "") or getattr(settings, "EMAIL_HOST_USER", "")
    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "") or to_email

    subject = f"Portfolio Contact - {name}"
    body = (
        "You received a new portfolio contact submission.\n\n"
        f"From: {name} <{email}>\n\n"
        "Message:\n"
        f"{message}\n"
    )

    return EmailMessage(subject=subject, body=body, from_email=from_email, to=[to_email])

