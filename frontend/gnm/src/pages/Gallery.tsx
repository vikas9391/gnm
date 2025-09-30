import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import weddingImage from '@/assets/hero-wedding.jpg';
import corporateImage from '@/assets/corporate-event.jpg';
import birthdayImage from '@/assets/birthday-party.jpg';
import concertImage from '@/assets/concert-event.jpg';

const Gallery = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [lightboxImage, setLightboxImage] = useState<number | null>(null);

  const filters = ['All', 'Weddings', 'Corporate', 'Birthdays', 'Concerts', 'Other'];

  const galleryItems = [
    {
      id: 1,
      title: 'Elegant Garden Wedding',
      category: 'Weddings',
      image: weddingImage,
      description: 'A beautiful outdoor wedding ceremony with 150 guests in a romantic garden setting.',
    },
    {
      id: 2,
      title: 'Corporate Product Launch',
      category: 'Corporate',
      image: corporateImage,
      description: 'Professional product launch event for 300 attendees with modern staging and lighting.',
    },
    {
      id: 3,
      title: 'Sweet 16 Birthday Celebration',
      category: 'Birthdays',
      image: birthdayImage,
      description: 'A vibrant and fun Sweet 16 party with custom decorations and entertainment.',
    },
    {
      id: 4,
      title: 'Live Music Concert',
      category: 'Concerts',
      image: concertImage,
      description: 'Intimate acoustic concert venue setup with professional sound and lighting.',
    },
    {
      id: 5,
      title: 'Luxury Wedding Reception',
      category: 'Weddings',
      image: weddingImage,
      description: 'Sophisticated ballroom reception with crystal chandeliers and gold accents.',
    },
    {
      id: 6,
      title: 'Annual Conference',
      category: 'Corporate',
      image: corporateImage,
      description: 'Three-day corporate conference with breakout sessions and networking events.',
    },
    {
      id: 7,
      title: '50th Anniversary Party',
      category: 'Other',
      image: birthdayImage,
      description: 'Golden anniversary celebration with family and friends in an elegant venue.',
    },
    {
      id: 8,
      title: 'Rock Band Concert',
      category: 'Concerts',
      image: concertImage,
      description: 'High-energy rock concert with full stage production and lighting effects.',
    },
  ];

  const filteredItems = selectedFilter === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedFilter);

  const openLightbox = (index: number) => {
    setLightboxImage(index);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const nextImage = () => {
    if (lightboxImage !== null) {
      setLightboxImage((lightboxImage + 1) % filteredItems.length);
    }
  };

  const prevImage = () => {
    if (lightboxImage !== null) {
      setLightboxImage(lightboxImage === 0 ? filteredItems.length - 1 : lightboxImage - 1);
    }
  };

  return (
    <main className="pt-8">

      {/* Filter Section */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Filter className="h-5 w-5" />
              <span className="font-medium">Filter by:</span>
            </div>
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                onClick={() => setSelectedFilter(filter)}
                className={selectedFilter === filter ? "btn-hero" : ""}
              >
                {filter}
              </Button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="gallery-item animate-fade-in-up"
                onClick={() => openLightbox(index)}
              >
                <div className="relative aspect-square">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="gallery-overlay">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="text-center text-white p-4">
                        <h3 className="font-serif text-lg font-semibold mb-2">{item.title}</h3>
                        <p className="text-sm text-white/80">{item.category}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No images found for this filter.</p>
              <Button
                variant="outline"
                onClick={() => setSelectedFilter('All')}
                className="mt-4"
              >
                View All Images
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImage !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/10"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation Buttons */}
            {filteredItems.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Image */}
            <div className="text-center">
              <img
                src={filteredItems[lightboxImage].image}
                alt={filteredItems[lightboxImage].title}
                className="max-w-full max-h-[80vh] object-contain mx-auto"
              />
              
              {/* Image Details */}
              <div className="text-white mt-6">
                <h3 className="text-2xl font-serif font-bold mb-2">
                  {filteredItems[lightboxImage].title}
                </h3>
                <p className="text-white/80 mb-2">{filteredItems[lightboxImage].category}</p>
                <p className="text-white/70 max-w-2xl mx-auto">
                  {filteredItems[lightboxImage].description}
                </p>
              </div>

              {/* Image Counter */}
              <div className="text-white/60 text-sm mt-4">
                {lightboxImage + 1} of {filteredItems.length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">500+</div>
              <div className="text-primary-foreground/80">Events Photographed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">50+</div>
              <div className="text-primary-foreground/80">Unique Venues</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">2000+</div>
              <div className="text-primary-foreground/80">Happy Clients</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">15+</div>
              <div className="text-primary-foreground/80">Awards Won</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-serif font-bold mb-6">Ready to Create Your Own Story?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let us help you create beautiful memories that will last a lifetime. Contact us today 
            to start planning your perfect event.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/Booking">
            <Button size="lg" className="btn-hero">
              Book Your Event
            </Button>
            </Link>
            <Link to="/Contact">
            <Button size="lg" variant="outline">
              Contact Us Today
            </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Gallery;