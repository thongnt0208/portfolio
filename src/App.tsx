import React, { lazy, Suspense, useState } from 'react';

// Lazy load components

const Navbar = lazy(() => import('./components/Navbar').then(module => ({ default: module.Navbar })));
const Sidebars = lazy(() => import('./components/Sidebars').then(module => ({ default: module.Sidebars })));
const Hero = lazy(() => import('./components/Hero').then(module => ({ default: module.Hero })));
const Ambition = lazy(() => import('./components/Ambition').then(module => ({ default: module.Ambition })));
const Expertise = lazy(() => import('./components/Expertise').then(module => ({ default: module.Expertise })));
const LatestWork = lazy(() => import('./components/LatestWork').then(module => ({ default: module.LatestWork })));
const Contact = lazy(() => import('./components/Contact').then(module => ({ default: module.Contact })));
const Footer = lazy(() => import('./components/Footer').then(module => ({ default: module.Footer })));

// Chat components (not lazy loaded as they manage their own loading)
import { ChatToggleButton } from './components/chatBot/ChatToggleButton';
import { ChatPanel } from './components/chatBot/panel/ChatPanel';

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

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

      {/* AI Chat Feature */}
      <ChatToggleButton onClick={() => setIsChatOpen(true)} />
      <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default App;
