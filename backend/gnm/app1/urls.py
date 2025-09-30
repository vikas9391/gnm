from django.urls import path
from .views import (
    contact_message, 
    booking_request,
    user_booking_history,
    admin_all_bookings,
    admin_update_booking,
    admin_delete_booking,
    admin_all_users,
    user_delete_booking
)

urlpatterns = [
    # Public endpoints
    path('contact/', contact_message, name='contact'),
    path('booking/', booking_request, name='booking'),
    
    # User endpoints (authenticated users only)
    path('bookings/history/', user_booking_history, name='user_history'),
    path('bookings/user/<int:booking_id>/delete/', user_delete_booking, name='user_delete_booking'),
    
    # Admin endpoints (admin users only)
    path('admin/bookings/', admin_all_bookings, name='admin_bookings'),
    path('admin/users/', admin_all_users, name='admin_users'), 
    path('admin/bookings/<int:booking_id>/update/', admin_update_booking, name='admin_update_booking'),
    path('admin/bookings/<int:booking_id>/delete/', admin_delete_booking, name='admin_delete_booking'),
]