from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser as User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """Custom User Admin with additional profile fields"""
    
    list_display = ['username', 'email', 'first_name', 'last_name', 'phone', 'location', 'is_staff', 'date_joined']
    list_filter = ['is_staff', 'is_superuser', 'is_active', 'location', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone', 'location']
    ordering = ['-date_joined']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Profile Information', {
            'fields': ('phone', 'location', 'bio', 'occupation', 'website'),
            'classes': ('wide',)
        }),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Profile Information', {
            'fields': ('phone', 'location', 'bio', 'occupation', 'website'),
            'classes': ('wide',)
        }),
    )