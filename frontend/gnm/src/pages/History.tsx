import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Trash2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {Link} from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "http://localhost:8000";



interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  venue: string;
  guestCount: number;
  budget: string;
  specialRequests: string;
  created_at: string;
}

const History = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/bookings/history/`
, {
        withCredentials: true
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load booking history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingId: number) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      await axios.delete(`${API_BASE}/api/bookings/user/${bookingId}/delete/`, {
        withCredentials: true
      });
      
      setBookings(bookings.filter(b => b.id !== bookingId));
      toast({
        title: "Success",
        description: "Booking deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast({
        title: "Error",
        description: "Failed to delete booking",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-muted-foreground">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <section className="py-16 bg-gradient-to-b from-secondary/20 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-center">
            Your Event History
          </h1>
          <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto">
            Track all your booked events
          </p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {bookings.length > 0 ? (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      <div className="lg:col-span-4">
                        <h3 className="text-xl font-bold text-primary mb-2">{booking.name}'s {booking.eventType}</h3>
                        <Badge variant="outline">{booking.eventType}</Badge>
                      </div>

                      <div className="lg:col-span-4 space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2 text-primary" />
                          <span>{new Date(booking.eventDate).toLocaleDateString()}</span>
                        </div>
                        
                        {booking.venue && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-2 text-primary" />
                            <span>{booking.venue}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="w-4 h-4 mr-2 text-primary" />
                          <span>{booking.guestCount} guests</span>
                        </div>
                      </div>

                      <div className="lg:col-span-2">
                        {booking.budget && (
                          <p className="text-lg font-bold text-primary">{booking.budget}</p>
                        )}
                      </div>

                      <div className="lg:col-span-2">
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="w-full"
                          onClick={() => handleDelete(booking.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>

                    {booking.specialRequests && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          <strong>Special Requests:</strong> {booking.specialRequests}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">No Bookings Yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't booked any events with us yet.
                </p>
                <Link to="/booking">
                <Button>Book Your First Event</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="py-16 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-primary mb-8 text-center">Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">{bookings.length}</div>
                <div className="text-sm text-muted-foreground">Total Bookings</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {bookings.filter(b => new Date(b.eventDate) < new Date()).length}
                </div>
                <div className="text-sm text-muted-foreground">Past Events</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {bookings.filter(b => new Date(b.eventDate) >= new Date()).length}
                </div>
                <div className="text-sm text-muted-foreground">Upcoming Events</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default History;