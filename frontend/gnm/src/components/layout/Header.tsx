import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Menu, X, Phone, Mail, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

interface UserData {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  is_staff?: boolean;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check auth status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        
        const response = await api.get('/api/auth/custom/me/');
        
        if (response.data) {
          console.log('User authenticated:', response.data);
          setUserData(response.data);
          setIsLoggedIn(true);
          setIsAdmin(response.data.is_staff || false);
        }
      } catch (error: any) {
        console.log('Not authenticated:', error.response?.status);
        // Clear state when not authenticated
        setIsLoggedIn(false);
        setUserData(null);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [location.pathname]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleLogout = async () => {
    try {
      console.log('Logout initiated...');
      
      // Call logout endpoint
      const response = await api.post('/api/auth/custom/logout/');
      console.log('Logout response:', response.data);
      
      // Immediately clear state
      setIsLoggedIn(false);
      setUserData(null);
      setIsAdmin(false);
      setIsProfileOpen(false);
      
      // Force a small delay to ensure cookies are cleared
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Redirect to login
      navigate('/login', { replace: true });
      
    } catch (error) {
      console.error('Logout failed:', error);
      
      // Even if API fails, clear state and redirect
      setIsLoggedIn(false);
      setUserData(null);
      setIsAdmin(false);
      setIsProfileOpen(false);
      navigate('/login', { replace: true });
    }
  };

  const getUserInitials = () => {
    if (!userData) return 'U';
    const firstInitial = userData.first_name?.charAt(0).toUpperCase() || '';
    const lastInitial = userData.last_name?.charAt(0).toUpperCase() || '';
    return firstInitial + lastInitial || userData.username?.charAt(0).toUpperCase() || 'U';
  };

  const getUserDisplayName = () => {
    if (!userData) return 'User';
    if (userData.first_name && userData.last_name) {
      return `${userData.first_name} ${userData.last_name}`;
    }
    return userData.username || userData.email;
  };

  if (isLoading) {
    return (
      <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="bg-primary text-primary-foreground py-2">
          <div className="container-custom">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>91+ 8919897027</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>gnmevents95@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <h1 className="text-2xl font-serif font-bold">GNM Events</h1>
            </Link>
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      {/* Main Navigation */}
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent">
              <h1 className="text-2xl font-serif font-bold">GNM Events</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
              >
                {item.name}
              </Link>
            ))}

            {isLoggedIn && (
              <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>
                History
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
                Admin Panel
              </Link>
            )}
          </nav>

          {/* CTA Button & Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn ? (
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
            ) : (
              <div className="relative" ref={profileRef}>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 p-2 h-auto"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={getUserDisplayName()} />
                    <AvatarFallback className="text-sm font-medium">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4" />
                </Button>

                {isProfileOpen && (
                  <Card className="absolute right-0 top-full mt-2 w-72 shadow-lg border z-50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="" alt={getUserDisplayName()} />
                          <AvatarFallback className="text-lg font-medium">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">
                            {getUserDisplayName()}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {userData?.email}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Username:</span>
                          <span>{userData?.username}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">User ID:</span>
                          <span>#{userData?.id}</span>
                        </div>
                        {isAdmin && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Role:</span>
                            <span className="text-primary font-medium">Admin</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/profile');
                          }}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            setIsProfileOpen(false);
                            navigate('/settings');
                          }}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            <Link to="/booking">
              <Button variant="default" className="btn-hero">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg">
            <nav className="container-custom py-4 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block py-2 text-foreground hover:text-primary transition-colors ${
                    isActive(item.href) ? 'text-primary font-medium' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {isLoggedIn && (
                <Link to="/history" className="block py-2" onClick={() => setIsMenuOpen(false)}>
                  History
                </Link>
              )}

              {isAdmin && (
                <Link to="/admin" className="block py-2" onClick={() => setIsMenuOpen(false)}>
                  Admin Panel
                </Link>
              )}

              {!isLoggedIn ? (
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full mt-4">Login</Button>
                </Link>
              ) : (
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt={getUserDisplayName()} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{getUserDisplayName()}</p>
                      <p className="text-xs text-muted-foreground">{userData?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-red-600"
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              )}

              <Link to="/booking" onClick={() => setIsMenuOpen(false)}>
                <Button variant="default" className="btn-hero w-full mt-4">
                  Book Now
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;