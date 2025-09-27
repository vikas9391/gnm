from django.contrib import admin
from .models import ContactMessage, Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'eventType', 'eventDate', 'created_at')
    list_filter = ('eventType', 'eventDate', 'created_at')
    search_fields = ('name', 'email', 'phone', 'venue')

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
