from django.db import models

from django.core.validators import EmailValidator, MinLengthValidator
from django.core.exceptions import ValidationError
from django.utils import timezone


class PageVisit(models.Model):
    """
    Records a page view for lightweight analytics.
    """

    timestamp = models.DateTimeField(default=timezone.now)
    page_name = models.CharField(max_length=200)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["page_name", "timestamp"]),
        ]
        verbose_name = "Page visit"
        verbose_name_plural = "Page visits"

    def __str__(self) -> str:
        return f"{self.page_name} @ {self.timestamp.isoformat()}"


class ContactMessage(models.Model):
    """
    Stores contact form submissions for auditing and debugging.
    """

    name = models.CharField(max_length=100)
    email = models.EmailField(validators=[EmailValidator()])
    message = models.TextField(validators=[MinLengthValidator(10)])
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = "Contact message"
        verbose_name_plural = "Contact messages"
        indexes = [models.Index(fields=["created_at"])]

    def clean(self) -> None:
        super().clean()
        if not self.name.strip():
            raise ValidationError({"name": "Name is required."})

        msg = (self.message or "").strip()
        if not msg:
            raise ValidationError({"message": "Message is required."})
        if len(msg) < 10:
            raise ValidationError({"message": "Message must be at least 10 characters."})
        if len(msg) > 2000:
            raise ValidationError({"message": "Message must be at most 2000 characters."})
        self.message = msg

    def __str__(self) -> str:
        return f"Contact from {self.name} <{self.email}>"
