import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Award, Users, Clock } from 'lucide-react';
import teamImage from '@/assets/team-planning.jpg';

const AboutPreview = () => {
  const achievements = [
    { icon: Award, label: 'Award-Winning Service', value: '15+ Awards' },
    { icon: Users, label: 'Happy Clients', value: '2,000+' },
    { icon: Clock, label: 'Years of Excellence', value: '10+ Years' },
  ];

  const values = [
    'Personalized event planning tailored to your vision',
    'Professional coordination from concept to execution',
    'Experienced team with attention to every detail',
    'Comprehensive vendor network and partnerships',
    'Stress-free planning process with clear communication',
    '24/7 support throughout your event journey',
  ];

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif font-bold">
                Crafting Unforgettable
                <span className="block text-primary">Experiences</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                For over a decade, GNM Event Company has been transforming visions into 
                reality, creating extraordinary events that leave lasting impressions.
              </p>
            </div>

            {/* Achievements */}
            <div className="grid grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div key={achievement.label} className="text-center">
                  <div className="bg-secondary/10 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <achievement.icon className="h-8 w-8 text-secondary" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">{achievement.value}</div>
                  <div className="text-sm text-muted-foreground">{achievement.label}</div>
                </div>
              ))}
            </div>

            {/* Values List */}
            <div className="space-y-3">
              {values.map((value) => (
                <div key={value} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground leading-relaxed">{value}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/about">
                <Button size="lg" className="btn-hero">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">
                  Get In Touch
                </Button>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="space-y-6">
            <div className="relative">
              <img
                src={teamImage}
                alt="GNM Event Company professional team planning events"
                className="w-full rounded-lg shadow-elegant"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-card">
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">98%</div>
                  <div className="text-sm">Client Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Mission Statement */}
            <div className="bg-gradient-to-r from-secondary/10 to-secondary-light/10 p-6 rounded-lg border-l-4 border-secondary">
              <h3 className="font-serif text-xl font-semibold mb-2">Our Mission</h3>
              <p className="text-muted-foreground italic">
                "To create extraordinary moments that bring people together and create 
                lasting memories through exceptional event planning and flawless execution."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;