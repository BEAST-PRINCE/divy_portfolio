from django.contrib import admin

from .models import ContactMessage, PageVisit


@admin.register(PageVisit)
class PageVisitAdmin(admin.ModelAdmin):
    list_display = ("page_name", "timestamp", "ip_address")
    list_filter = ("page_name", "timestamp")
    search_fields = ("page_name", "ip_address")


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "created_at")
    list_filter = ("created_at",)
    search_fields = ("name", "email", "message")
