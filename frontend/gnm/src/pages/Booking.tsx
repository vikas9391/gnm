import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MessageSquare, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Booking = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    customEventType: '',
    eventDate: '',
    venue: '',
    guestCount: '',
    specialRequests: '',
  });

  const eventTypes = [
    'Wedding',
    'Corporate Event',
    'Birthday Party',
    'Concert',
    'Anniversary',
    'Baby Shower',
    'Graduation',
    'Holiday Party',
    'Other',
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare data to send
      const submitData = { ...formData };
      
      // If "Other" is selected, use customEventType as the eventType
      if (formData.eventType === 'Other' && formData.customEventType) {
        submitData.eventType = formData.customEventType;
      }
      
      // Remove customEventType from submission as it's not needed in backend
      delete submitData.customEventType;

      // Send form data to Django backend
      const response = await axios.post('http://localhost:8000/api/booking/', submitData,
        {
          withCredentials: true, 
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log('Booking submitted:', response.data);

      // Show success toast
      toast({
        title: "Booking Request Submitted!",
        description: "We'll contact you within 24 hours to discuss your event details.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventType: '',
        customEventType: '',
        eventDate: '',
        venue: '',
        guestCount: '',
        specialRequests: '',
      });

    } catch (error) {
      console.error('Booking submit error:', error);
      toast({
        title: "Error",
        description: "Failed to submit booking. Please try again.",
        variant: 'destructive',
      });
    }

    setIsSubmitting(false);
  };

  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-muted/50 to-background">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            Book Your <span className="text-primary">Event</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ready to create an unforgettable experience? Fill out our booking form and we'll 
            contact you within 24 hours to discuss your event details.
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="form-elegant">
                <h2 className="text-3xl font-serif font-bold mb-6">Event Booking Form</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        placeholder="youremail@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                      placeholder="+91 9876543210"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventType">Event Type *</Label>
                      <Select value={formData.eventType} onValueChange={(value) => handleInputChange('eventType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventDate">Event Date *</Label>
                      <Input
                        id="eventDate"
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => handleInputChange('eventDate', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Custom Event Type Input - Shows when "Other" is selected */}
                  {formData.eventType === 'Other' && (
                    <div className="space-y-2">
                      <Label htmlFor="customEventType">Please specify your event type *</Label>
                      <Input
                        id="customEventType"
                        value={formData.customEventType}
                        onChange={(e) => handleInputChange('customEventType', e.target.value)}
                        required
                        placeholder="e.g., Product Launch, Engagement Party, Festival"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="venue">Preferred Venue</Label>
                    <Input
                      id="venue"
                      value={formData.venue}
                      onChange={(e) => handleInputChange('venue', e.target.value)}
                      placeholder="Venue name or type (e.g., outdoor garden, hotel ballroom)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guestCount">Number of Guests *</Label>
                    <Input
                      id="guestCount"
                      type="number"
                      value={formData.guestCount}
                      onChange={(e) => handleInputChange('guestCount', e.target.value)}
                      required
                      placeholder="50"
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialRequests">Special Requests or Details</Label>
                    <Textarea
                      id="specialRequests"
                      value={formData.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      placeholder="Tell us about your vision, specific requirements, themes, or any other details..."
                      rows={4}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="btn-hero w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    * Required fields. We'll contact you within 24 hours to discuss your event.
                  </p>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Contact Card */}
              <div className="card-elegant p-6">
                <h3 className="text-xl font-serif font-semibold mb-4">Need Help?</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-secondary/10 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium">Quick Response</p>
                      <p className="text-sm text-muted-foreground">24-hour response time</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-secondary/10 p-2 rounded-full">
                      <MessageSquare className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium">Free Consultation</p>
                      <p className="text-sm text-muted-foreground">Initial planning session</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-secondary/10 p-2 rounded-full">
                      <CheckCircle className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium">Custom Quote</p>
                      <p className="text-sm text-muted-foreground">Tailored to your needs</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">
                    Prefer to talk directly? Call us:
                  </p>
                  <Button variant="outline" className="w-full">
                    <span className="font-semibold">+91 5551234567</span>
                  </Button>
                </div>
              </div>

              {/* Process Steps */}
              <div className="card-elegant p-6">
                <h3 className="text-xl font-serif font-semibold mb-4">What Happens Next?</h3>
                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Form Review', description: 'We review your booking details' },
                    { step: 2, title: 'Initial Contact', description: 'We call you within 24 hours' },
                    { step: 3, title: 'Consultation', description: 'Free planning consultation' },
                    { step: 4, title: 'Proposal', description: 'Custom event proposal & quote' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start space-x-3">
                      <div className="bg-secondary text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Booking;