import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Building, Gift, Music, Sparkles } from 'lucide-react';
import weddingImage from '@/assets/hero-wedding.jpg';
import corporateImage from '@/assets/corporate-event.jpg';
import birthdayImage from '@/assets/birthday-party.jpg';
import concertImage from '@/assets/concert-event.jpg';

const ServicesPreview = () => {
  const services = [
    {
      title: 'Wedding Planning',
      description: 'Create the wedding of your dreams with our comprehensive planning services.',
      image: weddingImage,
      icon: Heart,
      features: ['Full Wedding Coordination', 'Vendor Management', 'Day-of Coordination'],
    },
    {
      title: 'Corporate Events',
      description: 'Professional corporate events that leave lasting impressions on your clients.',
      image: corporateImage,
      icon: Building,
      features: ['Conference Planning', 'Team Building Events', 'Product Launches'],
    },
    {
      title: 'Birthday Parties',
      description: 'Memorable birthday celebrations for all ages with creative themes and entertainment.',
      image: birthdayImage,
      icon: Gift,
      features: ['Theme Development', 'Entertainment Booking', 'Custom Decorations'],
    },
    {
      title: 'Concert Events',
      description: 'Professional concert and music event organization with full technical support.',
      image: concertImage,
      icon: Music,
      features: ['Venue Coordination', 'Technical Setup', 'Artist Management'],
    },
  ];

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-secondary mr-2" />
            <h2 className="text-4xl md:text-5xl font-serif font-bold">Our Services</h2>
          </div>
          <p className="text-xl text-muted-foreground leading-relaxed">
            From intimate gatherings to grand celebrations, we specialize in creating 
            unforgettable experiences tailored to your unique vision and requirements.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`service-card group animate-fade-in-up animate-delay-${(index + 1) * 100}`}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={service.image}
                  alt={`${service.title} - Professional event management by GNM Events`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-secondary text-secondary-foreground p-3 rounded-full">
                  <service.icon className="h-6 w-6" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-serif font-semibold group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="pt-4">
                  <Link to="/services">
                    <Button variant="ghost" className="group p-0 h-auto text-primary hover:text-primary-dark">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Services CTA */}
        <div className="text-center">
          <Link to="/services">
            <Button size="lg" className="btn-hero">
              View All Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;