from django.contrib import admin
from .models import ContactMessage, Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'eventType', 'eventDate', 'user', 'status', 'created_at')
    list_filter = ('eventType', 'eventDate', 'status', 'created_at')
    search_fields = ('name', 'email', 'phone', 'venue', 'user__username')

    def save_model(self, request, obj, form, change):
        # Auto-fill name/email from linked user if not set
        if obj.user:
            if not obj.name:
                obj.name = obj.user.get_full_name() or obj.user.username
            if not obj.email:
                obj.email = obj.user.email
        super().save_model(request, obj, form, change)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'user', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message', 'user__username')

    def save_model(self, request, obj, form, change):
        if obj.user:
            if not obj.name:
                obj.name = obj.user.get_full_name() or obj.user.username
            if not obj.email:
                obj.email = obj.user.email
        super().save_model(request, obj, form, change)
