import React from 'react';
import { Link } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { CheckCircle, Heart, Building, Gift, Music, Sparkles, Star } from 'lucide-react';
import weddingImage from '@/assets/hero-wedding.jpg';
import corporateImage from '@/assets/corporate-event.jpg';
import birthdayImage from '@/assets/birthday-party.jpg';
import concertImage from '@/assets/concert-event.jpg';

const Services = () => {
  const services = [
    {
      title: 'Wedding Planning',
      description: 'Create the wedding of your dreams with our comprehensive planning services that cover every detail from concept to celebration.',
      image: weddingImage,
      icon: Heart,
      // price: 'Starting from $2,500',
      features: [
        'Complete wedding coordination and timeline management',
        'Vendor sourcing and contract negotiation',
        'Ceremony and reception venue selection',
        'Floral design and decoration planning',
        'Catering coordination and menu planning',
        'Photography and videography arrangement',
        'Day-of coordination and event supervision',
        'Bridal party coordination and rehearsal management',
      ],
    },
    {
      title: 'Corporate Events',
      description: 'Professional corporate events that enhance your brand image and create meaningful connections with clients and employees.',
      image: corporateImage,
      icon: Building,
      // price: 'Starting from $1,800',
      features: [
        'Conference and seminar planning',
        'Product launch event coordination',
        'Team building activity organization',
        'Annual meeting and gala planning',
        'Trade show and exhibition management',
        'Executive retreat coordination',
        'Award ceremony planning',
        'Networking event organization',
      ],
    },
    {
      title: 'Birthday Parties',
      description: 'Memorable birthday celebrations for all ages with creative themes, entertainment, and personalized touches.',
      image: birthdayImage,
      icon: Gift,
      // price: 'Starting from $800',
      features: [
        'Custom theme development and decoration',
        'Entertainment booking and coordination',
        'Cake design and catering services',
        'Venue selection and setup',
        'Party favor and gift coordination',
        'Photography and videography services',
        'Activity planning and games',
        'Guest management and invitations',
      ],
    },
    {
      title: 'Concert Events',
      description: 'Professional concert and music event organization with full technical support and artist management.',
      image: concertImage,
      icon: Music,
      // price: 'Starting from $3,000',
      features: [
        'Venue booking and technical coordination',
        'Sound and lighting equipment setup',
        'Artist booking and contract management',
        'Security and crowd management',
        'Ticketing and promotion coordination',
        'Backstage and hospitality management',
        'Production timeline and crew coordination',
        'Post-event cleanup and breakdown',
      ],
    },
  ];

  const additionalServices = [
    { title: 'Event Photography', description: 'Professional photography to capture your special moments' },
    { title: 'Catering Services', description: 'Delicious food and beverage options for any event' },
    { title: 'Decoration & Design', description: 'Custom decorations and design elements' },
    { title: 'Entertainment Booking', description: 'Musicians, DJs, and performers for your event' },
    { title: 'Transportation', description: 'Guest transportation and logistics coordination' },
    { title: 'Security Services', description: 'Professional security for large events' },
  ];

  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-muted/50 to-background">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            Our <span className="text-primary">Services</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From intimate gatherings to grand celebrations, we offer comprehensive event planning 
            services tailored to your unique vision and requirements.
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="section-padding">
        <div className="container-custom space-y-20">
          {services.map((service, index) => (
            <div key={service.title} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
              index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
            }`}>
              {/* Image */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div className="relative">
                  <img
                    src={service.image}
                    alt={`${service.title} - Professional event management by GNM Events`}
                    className="w-full rounded-lg shadow-elegant"
                  />
                  <div className="absolute top-6 left-6 bg-secondary text-secondary-foreground p-4 rounded-full">
                    <service.icon className="h-8 w-8" />
                  </div>
                  {/* <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{service.price}</div>
                  </div> */}
                </div>
              </div>

              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <div>
                  <h2 className="text-4xl font-serif font-bold mb-4">{service.title}</h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">What's Included:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/Booking">
                  <Button size="lg" className="btn-hero">
                    Get Quote for {service.title}
                  </Button>
                  </Link>
                  <Link to="/gallery">
                  <Button size="lg" variant="outline">
                    View Portfolio
                  </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Services */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">Additional Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enhance your event with our comprehensive range of additional services and amenities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalServices.map((service) => (
              <div key={service.title} className="card-elegant p-6">
                <div className="bg-secondary/10 rounded-full p-3 w-12 h-12 mb-4 flex items-center justify-center">
                  <Star className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">Our Planning Process</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We follow a proven process to ensure your event is perfectly planned and executed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Consultation', description: 'We meet to discuss your vision, budget, and requirements' },
              { step: '02', title: 'Planning', description: 'Detailed planning with timeline, vendors, and logistics' },
              { step: '03', title: 'Coordination', description: 'We handle all vendor communications and preparations' },
              { step: '04', title: 'Execution', description: 'Flawless event execution with on-site management' },
            ].map((phase) => (
              <div key={phase.step} className="text-center">
                <div className="bg-gradient-to-br from-secondary to-secondary-light text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {phase.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{phase.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}

      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto">
             <Sparkles className="h-12 w-12 text-secondary mx-auto mb-6" /> 
             <h2 className="text-4xl font-serif font-bold mb-6">Ready to Plan Your Event?</h2> 
             <p className="text-xl text-primary-foreground/80 mb-8"> 
              Let's discuss your vision and create an unforgettable experience together. 
              Contact us today for a free consultation. 
             </p> 
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4"> 
               <Link to="/Booking"><Button size="lg" className="btn-hero">
                Start Planning Today
              </Button>
              </Link>
              {/* <Button size="lg" variant="outline" className="btn-outline-light text-black">
                View Our Work
              </Button> */}
            </div>
          </div>
        </div>
      </section> 
    </main>
  );
};

export default Services;