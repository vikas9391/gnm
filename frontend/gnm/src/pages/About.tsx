import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Award, Users, Clock, Target, Eye, Heart } from 'lucide-react';
import teamImage from '@/assets/team-planning.jpg';

const About = () => {
  const stats = [
    { icon: Award, label: 'Awards Won', value: '15+' },
    { icon: Users, label: 'Happy Clients', value: '2,000+' },
    { icon: Clock, label: 'Years Experience', value: '10+' },
    { icon: Target, label: 'Events Completed', value: '500+' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Passion for Excellence',
      description: 'We pour our heart into every event, ensuring each detail reflects your unique vision and exceeds expectations.',
    },
    {
      icon: Users,
      title: 'Client-Centered Approach',
      description: 'Your satisfaction is our priority. We listen, understand, and deliver personalized solutions for every occasion.',
    },
    {
      icon: Award,
      title: 'Professional Expertise',
      description: 'Our experienced team brings creativity, organization, and industry knowledge to make your event flawless.',
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & Creative Director',
      description: 'With over 15 years in event planning, Sarah leads our creative vision and ensures every event is extraordinary.',
    },
    {
      name: 'Michael Chen',
      role: 'Operations Manager',
      description: 'Michael coordinates all logistics and vendor relationships, ensuring seamless execution of every event.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Senior Event Coordinator',
      description: 'Emily specializes in wedding planning and brings attention to detail that makes every celebration perfect.',
    },
  ];

  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-muted/50 to-background">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            About <span className="text-primary">GNM Events</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We are passionate event planners dedicated to creating unforgettable experiences 
            that bring people together and celebrate life's most important moments.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="bg-white/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <stat.icon className="h-8 w-8 text-secondary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">{stat.value}</div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src={teamImage}
                alt="GNM Event Company team planning session"
                className="w-full rounded-lg shadow-elegant"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-serif font-bold">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2014, GNM Event Company began with a simple mission: to create 
                  extraordinary events that bring joy and lasting memories to our clients. 
                  What started as a small passion project has grown into a full-service 
                  event management company.
                </p>
                <p>
                  Over the years, we've had the privilege of planning hundreds of weddings, 
                  corporate events, birthday celebrations, and concerts. Each event has taught 
                  us something new and reinforced our commitment to excellence.
                </p>
                <p>
                  Today, we're proud to be recognized as one of the leading event planning 
                  companies in the region, but we never forget that our success comes from 
                  the trust our clients place in us to make their special moments memorable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Target className="h-8 w-8 text-secondary" />
                <h3 className="text-3xl font-serif font-bold">Our Mission</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                To create extraordinary moments that bring people together and create 
                lasting memories through exceptional event planning, innovative design, 
                and flawless execution that exceeds our clients' expectations.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Eye className="h-8 w-8 text-secondary" />
                <h3 className="text-3xl font-serif font-bold">Our Vision</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                To be the premier event management company that transforms dreams into 
                reality, setting the standard for creativity, professionalism, and 
                client satisfaction in the event planning industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do and ensure we deliver exceptional 
              service to every client.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="card-elegant p-8 text-center">
                <div className="bg-secondary/10 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <value.icon className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our dedicated professionals bring years of experience and passion to every event.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="card-elegant p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-secondary to-secondary-light rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2">{member.name}</h3>
                <div className="text-secondary font-medium mb-4">{member.role}</div>
                <p className="text-muted-foreground leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-serif font-bold mb-6">Ready to Work With Us?</h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Let's start planning your perfect event. Contact us today for a free consultation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="btn-hero">
              Get Free Consultation
            </Button>
            <Button size="lg" variant="outline" className="btn-outline-light text-black">
              View Our Portfolio
            </Button>
          </div>
        </div>
      </section> */}
    </main>
  );
};

export default About;