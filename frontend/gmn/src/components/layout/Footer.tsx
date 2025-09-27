import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Twitter, Linkedin, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent">
                <h3 className="text-2xl font-serif font-bold">GNM Events</h3>
              </div>
              <p className="text-primary-foreground/80 leading-relaxed">
                Making your moments memorable with professional event management services. 
                We specialize in creating unforgettable experiences for all occasions.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="hover:bg-white/10 hover:text-white">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-white/10 hover:text-white">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-white/10 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-white/10 hover:text-white">
                  <Linkedin className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              <nav className="space-y-2">
                {[
                  { name: 'Home', href: '/' },
                  { name: 'About Us', href: '/about' },
                  { name: 'Our Services', href: '/services' },
                  { name: 'Portfolio', href: '/gallery' },
                  { name: 'Blog', href: '/blog' },
                ].map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block text-primary-foreground/80 hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Our Services</h4>
              <nav className="space-y-2">
                {[
                  'Wedding Planning',
                  'Corporate Events',
                  'Birthday Parties',
                  'Concert Organization',
                  'Custom Events',
                  'Others',
                ].map((service) => (
                  <div
                    key={service}
                    className="text-primary-foreground/80 hover:text-secondary transition-colors cursor-pointer"
                  >
                    {service}
                  </div>
                ))}
              </nav>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Contact Us</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 mt-0.5 text-secondary" />
                  <div className="text-primary-foreground/80">
                    {/* <p>123 Event Avenue</p> */}
                    <p>location</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-secondary" />
                  <span className="text-primary-foreground/80">+91 8919897024</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-secondary" />
                  <span className="text-primary-foreground/80">gnmevents95@gmail.com</span>
                </div>
              </div>
              {/* <Link to="/booking">
                <Button className="btn-hero w-full text-black">
                  Get Free Quote
                </Button>
              </Link> */}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-primary-foreground/60 text-sm">
              © {currentYear} GNM Event Company. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-primary-foreground/60 hover:text-secondary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-primary-foreground/60 hover:text-secondary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;