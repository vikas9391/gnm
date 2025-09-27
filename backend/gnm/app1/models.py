from django.db import models

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.subject}"


class Booking(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    eventType = models.CharField(max_length=50)
    eventDate = models.DateField()
    venue = models.CharField(max_length=200, blank=True, null=True)
    guestCount = models.IntegerField()
    budget = models.CharField(max_length=50, blank=True, null=True)
    specialRequests = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.eventType}"
