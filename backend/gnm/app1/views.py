from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from .models import ContactMessage, Booking
from .serializers import ContactMessageSerializer, BookingSerializer

# Contact form submission
@api_view(['POST'])
def contact_message(request):
    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        # Send email to organization
        send_mail(
            subject=f"New Contact Message: {serializer.data['subject']}",
            message=f"""
New Contact Message:

Name: {serializer.data['name']}
Email: {serializer.data['email']}
Subject: {serializer.data['subject']}
Message: {serializer.data['message']}
            """,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=['organization_email@example.com'],  # replace with org email
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Booking form submission
@api_view(['POST'])
def booking_request(request):
    serializer = BookingSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        # Send email to organization
        send_mail(
            subject=f"New Event Booking: {serializer.data['eventType']}",
            message=f"""
New Booking Details:

Name: {serializer.data['name']}
Email: {serializer.data['email']}
Phone: {serializer.data['phone']}
Event Type: {serializer.data['eventType']}
Event Date: {serializer.data['eventDate']}
Venue: {serializer.data['venue']}
Guest Count: {serializer.data['guestCount']}
Budget: {serializer.data['budget']}
Special Requests: {serializer.data['specialRequests']}
            """,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=['organization_email@example.com'],  # replace with org email
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
