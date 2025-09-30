from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import EmailMessage
from django.conf import settings
from .serializers import ContactMessageSerializer, BookingSerializer
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import AnonymousUser
from .models import Booking
from django.contrib.auth.models import User
# Admin: Get all users with their booking stats
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_all_users(request):
    users = User.objects.all().order_by('-date_joined')
    
    user_data = []
    for user in users:
        user_bookings = Booking.objects.filter(user=user)
        user_data.append({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'date_joined': user.date_joined,
            'is_active': user.is_active,
            'is_staff': user.is_staff,
            'booking_count': user_bookings.count(),
        })
    
    return Response(user_data)


# Contact form submission - REQUIRES LOGIN
@api_view(['POST'])
@permission_classes([AllowAny]) 
def contact_message(request):
    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():

        # ✅ Only attach user if authenticated
        if isinstance(request.user, AnonymousUser):
            serializer.save()  # no need to store saved_data
            user_id = "Guest"
            user_email = serializer.data['email']  # fallback to submitted email
        else:
            serializer.save(user=request.user)
            user_id = request.user.id
            user_email = request.user.email

        # ✅ Use user_id and user_email properly
        email = EmailMessage(
            subject=f"New Contact Message: {serializer.data['subject']}",
            body=f"""
New Contact Message:

User ID: {user_id}
User Email: {user_email}
Name: {serializer.data['name']}
Email: {serializer.data['email']}
Subject: {serializer.data['subject']}
Message: {serializer.data['message']}
            """,
            from_email=settings.EMAIL_HOST_USER,
            to=['gnmevents95@gmail.com'],
            headers={'Reply-To': serializer.data['email']},
        )
        email.send(fail_silently=False)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Booking form submission - REQUIRES LOGIN
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def booking_request(request):
    serializer = BookingSerializer(data=request.data)
    if serializer.is_valid():
        # Save and link to user (no need to capture return value)
        serializer.save(user=request.user)

        # Send email to organization
        email = EmailMessage(
            subject=f"New Event Booking: {serializer.data['eventType']}",
            body=f"""
New Booking Details:

User ID: {request.user.id}
User Email: {request.user.email}
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
            to=['gnmevents95@gmail.com'],
            headers={'Reply-To': serializer.data['email']},
        )
        email.send(fail_silently=False)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Get current user's booking history
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_booking_history(request):
    bookings = Booking.objects.filter(user=request.user).order_by('-created_at')
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)

# Admin: Get all bookings
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_all_bookings(request):
    bookings = Booking.objects.all().select_related('user').order_by('-created_at')
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)

# Admin: Update booking
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def admin_update_booking(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = BookingSerializer(booking, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Admin: Delete booking
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def admin_delete_booking(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)
        booking.delete()
        return Response({'message': 'Booking deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

# User: Delete own booking
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def user_delete_booking(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id, user=request.user)
        booking.delete()
        return Response({'message': 'Booking deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found or unauthorized'}, status=status.HTTP_404_NOT_FOUND)