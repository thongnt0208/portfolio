import React, { lazy, Suspense } from 'react';

// Lazy load components

const Navbar = lazy(() => import('./components/Navbar').then(module => ({ default: module.Navbar })));
const Sidebars = lazy(() => import('./components/Sidebars').then(module => ({ default: module.Sidebars })));
const Hero = lazy(() => import('./components/Hero').then(module => ({ default: module.Hero })));
const Ambition = lazy(() => import('./components/Ambition').then(module => ({ default: module.Ambition })));
const Expertise = lazy(() => import('./components/Expertise').then(module => ({ default: module.Expertise })));
const LatestWork = lazy(() => import('./components/LatestWork').then(module => ({ default: module.LatestWork })));
const Contact = lazy(() => import('./components/Contact').then(module => ({ default: module.Contact })));
const Footer = lazy(() => import('./components/Footer').then(module => ({ default: module.Footer })));

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full">
      <Suspense fallback={<div>Loading...</div>}>
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
      </Suspense>
    </div>
  );
};

export default App;
