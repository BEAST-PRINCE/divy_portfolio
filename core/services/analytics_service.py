from typing import Optional

from core.models import PageVisit


def log_page_visit(page_name: str, ip_address: Optional[str] = None) -> None:
    """
    Persists a page visit entry.
    """

    PageVisit.objects.create(
        page_name=page_name,
        ip_address=(ip_address or None),
    )

