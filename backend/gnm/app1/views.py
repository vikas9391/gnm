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
from profile.serializers import UserSerializer
import logging
from django.contrib.auth import get_user_model

User = get_user_model()



logger = logging.getLogger(__name__)

# Admin: Get all users with their booking stats
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_all_users(request):
    """
    Get all users with complete profile data for admin
    Endpoint: GET /api/admin/users/
    """
    try:
        users = User.objects.all().order_by('-date_joined')
        
        # Use the UserSerializer to get complete profile data
        serializer = UserSerializer(users, many=True, context={'request': request})
        
        logger.info(f"Admin fetched {users.count()} users")
        
        return Response(serializer.data)
    except Exception as e:
        logger.exception(f"Error fetching users for admin: {str(e)}")
        return Response(
            {'detail': 'Failed to fetch users'},
            status=500
        ) 

# Contact form submission - ALLOWS GUEST USERS
@api_view(['POST'])
@permission_classes([AllowAny]) 
def contact_message(request):
    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():

        # ✅ Only attach user if authenticated
        if isinstance(request.user, AnonymousUser):
            serializer.save()
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

# Booking form submission - ALLOWS GUEST USERS
@api_view(['POST'])
@permission_classes([AllowAny])
def booking_request(request):
    serializer = BookingSerializer(data=request.data)
    if serializer.is_valid():
        # ✅ Only attach user if authenticated
        if isinstance(request.user, AnonymousUser):
            serializer.save()
            user_id = "Guest"
            user_email = serializer.data['email']  # fallback to submitted email
        else:
            serializer.save(user=request.user)
            user_id = request.user.id
            user_email = request.user.email

        # Send email to organization
        email = EmailMessage(
            subject=f"New Event Booking: {serializer.data['eventType']}",
            body=f"""
New Booking Details:

User ID: {user_id}
User Email: {user_email}
Name: {serializer.data['name']}
Email: {serializer.data['email']}
Phone: {serializer.data['phone']}
Event Type: {serializer.data['eventType']}
Event Date: {serializer.data['eventDate']}
Venue: {serializer.data['venue']}
Guest Count: {serializer.data['guestCount']}
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