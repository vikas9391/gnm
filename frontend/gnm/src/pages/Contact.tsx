import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // Send form data to Django backend
    const response = await axios.post('http://localhost:8000/api/contact/', formData,{
        withCredentials: true, // ✅ Important for cookie-based auth
        headers: {
          "Content-Type": "application/json",
        },
      });
    console.log('Contact form submitted:', response.data);

    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });

    // Reset form after successful submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });

  } catch (error) {
    console.error('Contact submit error:', error);
    toast({
      title: "Error",
      description: "Failed to send message. Please try again.",
      variant: 'destructive',
    });
  }

  setIsSubmitting(false);
};


  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      description: 'Call us during business hours',
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@gmnevents.com', 'bookings@gmnevents.com'],
      description: 'Send us an email anytime',
    },
    {
      icon: MapPin,
      title: 'Office',
      details: ['123 Event Avenue', 'New York, NY 10001'],
      description: 'Visit our planning studio',
    },
    {
      icon: Clock,
      title: 'Hours',
      details: ['Mon-Fri: 9AM-7PM', 'Sat-Sun: 10AM-4PM'],
      description: 'Available for consultations',
    },
  ];

  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-muted/50 to-background">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ready to start planning your perfect event? Get in touch with our team for a free 
            consultation and let's bring your vision to life.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <div className="form-elegant">
                <div className="flex items-center space-x-3 mb-6">
                  <MessageCircle className="h-8 w-8 text-secondary" />
                  <h2 className="text-3xl font-serif font-bold">Send us a Message</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name *</Label>
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
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                      placeholder="What's this about?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                      placeholder="Tell us about your event or question..."
                      rows={6}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="btn-hero w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-6">Get in Touch</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  We're here to help make your event dreams come true. Whether you're planning 
                  a wedding, corporate event, or special celebration, our team is ready to assist you.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactInfo.map((info) => (
                  <div key={info.title} className="card-elegant p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-secondary/10 p-3 rounded-full">
                        <info.icon className="h-6 w-6 text-secondary" />
                      </div>
                      <h3 className="text-lg font-semibold">{info.title}</h3>
                    </div>
                    <div className="space-y-1 mb-2">
                      {info.details.map((detail) => (
                        <p key={detail} className="font-medium">{detail}</p>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                  </div>
                ))}
              </div>

              {/* WhatsApp Link */}
              <div className="card-elegant p-6 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-green-500 p-3 rounded-full">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">WhatsApp</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Quick questions? Message us on WhatsApp for instant support.
                </p>
                <Button 
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => window.open('https://wa.me/15551234567', '_blank')}
                >
                  Chat on WhatsApp
                </Button>
              </div>

              {/* Business Hours */}
              <div className="bg-primary text-primary-foreground p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-xs text-primary-foreground/80">
                    Emergency event support available 24/7 for active clients
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold mb-4">Visit Our Studio</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Come visit our planning studio to discuss your event in person and see our portfolio of work.
            </p>
          </div>
          
          {/* Map Placeholder */}
          <div className="bg-muted rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-border">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
              <p className="text-muted-foreground max-w-md">
                Google Maps integration would be embedded here showing our office location at 123 Event Avenue, New York, NY 10001
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.open('https://maps.google.com/?q=123+Event+Avenue+New+York+NY+10001', '_blank')}
              >
                Open in Google Maps
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-serif font-bold mb-6">Ready to Plan Your Event?</h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Don't wait - let's start creating your perfect event today. Book a free 
            consultation and see how we can make your vision come to life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="btn-hero">
              Book Free Consultation
            </Button>
            <Button size="lg" variant="outline" className="btn-outline-light text-black">
              View Our Portfolio
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;