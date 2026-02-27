import React, { lazy, Suspense, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

const Navbar = lazy(() => import('./components/Navbar').then(module => ({ default: module.Navbar })));
const Sidebars = lazy(() => import('./components/Sidebars').then(module => ({ default: module.Sidebars })));
const Hero = lazy(() => import('./components/Hero').then(module => ({ default: module.Hero })));
const Ambition = lazy(() => import('./components/Ambition').then(module => ({ default: module.Ambition })));
const Expertise = lazy(() => import('./components/Expertise').then(module => ({ default: module.Expertise })));
const LatestWork = lazy(() => import('./components/LatestWork').then(module => ({ default: module.LatestWork })));
const Contact = lazy(() => import('./components/Contact').then(module => ({ default: module.Contact })));
const Footer = lazy(() => import('./components/Footer').then(module => ({ default: module.Footer })));

import { ChatToggleButton } from './components/chatBot/ChatToggleButton';
import { ChatPanel } from './components/chatBot/panel/ChatPanel';

const WiNoteApp = lazy(() => import('./winote').then(m => ({ default: m.WiNoteApp })));

const Portfolio: React.FC = () => {
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

      <ChatToggleButton onClick={() => setIsChatOpen(true)} />
      <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Suspense fallback={<div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F0E6' }}>Loading...</div>}>
      <Routes>
        <Route path="/winote/*" element={<WiNoteApp />} />
        <Route path="/*" element={<Portfolio />} />
      </Routes>
    </Suspense>
  );
};

export default App;
