import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Calendar, 
  Edit, 
  Trash2, 
  X,
  Search,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

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
  status: string;
  created_at: string;
  user_email?: string;
  user_name?: string;
  user?: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  is_active: boolean;
  is_staff: boolean;
  booking_count?: number;
  total_spent?: string;
}

const Admin = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Booking>>({});

  useEffect(() => {
    fetchAllBookings();
    fetchAllUsers();
  }, []);

  useEffect(() => {
    const filtered = bookings.filter(booking => 
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.user_email && booking.user_email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredBookings(filtered);
  }, [searchTerm, bookings]);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.username.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      (user.first_name && user.first_name.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
      (user.last_name && user.last_name.toLowerCase().includes(userSearchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [userSearchTerm, users]);

  const fetchAllBookings = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/bookings/', {
        withCredentials: true
      });
      setBookings(response.data);
      setFilteredBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings. Make sure you're logged in as admin.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/users/', {
        withCredentials: true
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (bookingId: number) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      await axios.delete(`http://localhost:8000/api/admin/bookings/${bookingId}/delete/`, {
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

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditForm(booking);
    setIsEditing(true);
  };

  const handleUpdateBooking = async () => {
    if (!selectedBooking) return;

    try {
      const response = await axios.put(
        `http://localhost:8000/api/admin/bookings/${selectedBooking.id}/update/`,
        editForm,
        { withCredentials: true }
      );

      setBookings(bookings.map(b => b.id === selectedBooking.id ? response.data : b));
      setIsEditing(false);
      setSelectedBooking(null);
      toast({
        title: "Success",
        description: "Booking updated successfully"
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive"
      });
    }
  };

  const getUserBookings = (userId: number) => {
    return bookings.filter(b => b.user === userId);
  };

  const stats = {
    totalBookings: bookings.length,
    totalUsers: users.length,
    upcomingEvents: bookings.filter(b => new Date(b.eventDate) >= new Date()).length,
    pastEvents: bookings.filter(b => new Date(b.eventDate) < new Date()).length
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-muted-foreground">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-secondary/10">
      <section className="py-8 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage bookings and users</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold text-primary">{stats.totalUsers}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-bold text-primary">{stats.totalBookings}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Upcoming</p>
                    <p className="text-2xl font-bold text-primary">{stats.upcomingEvents}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-primary">{stats.pastEvents}</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>All Bookings</CardTitle>
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search bookings..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/20 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-primary">{booking.name}</h4>
                            <Badge variant="outline">{booking.eventType}</Badge>
                            {booking.status && (
                              <Badge className={
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }>
                                {booking.status}
                              </Badge>
                            )}
                            {booking.user_email && (
                              <span className="text-xs text-muted-foreground">User: {booking.user_email}</span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(booking.eventDate).toLocaleDateString()} • {booking.guestCount} guests
                            {booking.venue && ` • ${booking.venue}`}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(booking)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(booking.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>All Users</CardTitle>
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        className="pl-10"
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredUsers.map((user) => {
                      const userBookings = getUserBookings(user.id);
                      return (
                        <div key={user.id} className="p-4 border border-border rounded-lg hover:bg-secondary/20 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-primary">
                                  {user.first_name && user.last_name 
                                    ? `${user.first_name} ${user.last_name}` 
                                    : user.username}
                                </h4>
                                {user.is_staff && (
                                  <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
                                )}
                                {!user.is_active && (
                                  <Badge variant="destructive">Inactive</Badge>
                                )}
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Mail className="w-4 h-4" />
                                  <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="w-4 h-4" />
                                  <span>Joined: {new Date(user.date_joined).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">{userBookings.length}</div>
                              <div className="text-xs text-muted-foreground">Total Bookings</div>
                            </div>
                          </div>
                          
                          {userBookings.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-border">
                              <p className="text-sm font-medium mb-2">Recent Bookings:</p>
                              <div className="space-y-2">
                                {userBookings.slice(0, 3).map((booking) => (
                                  <div key={booking.id} className="flex items-center justify-between text-sm bg-secondary/30 p-2 rounded">
                                    <span>{booking.eventType} - {new Date(booking.eventDate).toLocaleDateString()}</span>
                                    <Badge variant="outline" className="text-xs">{booking.status}</Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {isEditing && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Edit Booking</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Event Type</Label>
                    <Select 
                      value={editForm.eventType} 
                      onValueChange={(value) => setEditForm({...editForm, eventType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Wedding">Wedding</SelectItem>
                        <SelectItem value="Corporate Event">Corporate Event</SelectItem>
                        <SelectItem value="Birthday Party">Birthday Party</SelectItem>
                        <SelectItem value="Anniversary">Anniversary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Event Date</Label>
                    <Input
                      type="date"
                      value={editForm.eventDate || ''}
                      onChange={(e) => setEditForm({...editForm, eventDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select 
                      value={editForm.status} 
                      onValueChange={(value) => setEditForm({...editForm, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Guest Count</Label>
                    <Input
                      type="number"
                      value={editForm.guestCount || ''}
                      onChange={(e) => setEditForm({...editForm, guestCount: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Budget</Label>
                    <Input
                      value={editForm.budget || ''}
                      onChange={(e) => setEditForm({...editForm, budget: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label>Venue</Label>
                  <Input
                    value={editForm.venue || ''}
                    onChange={(e) => setEditForm({...editForm, venue: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Special Requests</Label>
                  <Textarea
                    value={editForm.specialRequests || ''}
                    onChange={(e) => setEditForm({...editForm, specialRequests: e.target.value})}
                    rows={4}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleUpdateBooking} className="flex-1">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Admin;