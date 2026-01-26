import React from 'react';
import { Navbar } from './components/Navbar';
import { Sidebars } from './components/Sidebars';
import { Hero } from './components/Hero';
import { Ambition } from './components/Ambition';
import { Expertise } from './components/Expertise';
import { LatestWork } from './components/LatestWork';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full">
      <Navbar />
      <Sidebars />
      
      <main>
        <Hero />
        <Ambition />
        <Expertise />
        <LatestWork />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
};

export default App;
