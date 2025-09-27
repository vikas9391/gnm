from django.urls import path
from .views import contact_message, booking_request

urlpatterns = [
    path('contact/', contact_message, name='contact'),
    path('booking/', booking_request, name='booking'),
]
