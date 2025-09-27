import React from 'react';
import HeroSection from '@/components/sections/HeroSection';
import ServicesPreview from '@/components/sections/ServicesPreview';
import AboutPreview from '@/components/sections/AboutPreview';

const Home = () => {
  return (
    <main>
      <HeroSection />
      <AboutPreview />
      <ServicesPreview />
    </main>
  );
};

export default Home;