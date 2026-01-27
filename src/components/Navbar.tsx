import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { id: 'expertise', label: 'Core Expertise' },
  { id: 'latest-work', label: 'Latest Work' },
  { id: 'contact', label: 'Contact' },
];

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) {
        setIsMenuOpen(false); // Close mobile menu if resized to desktop
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map(item => item.id);

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (!element) continue;

        const offsetTop = element.offsetTop;
        const offsetBottom = offsetTop + element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
          setActiveSection(id);
          return;
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
      if (!isDesktop) {
        setIsMenuOpen(false);
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-8 py-6 flex justify-between items-center pointer-events-none">
      <a 
        href="#" 
        className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity mix-blend-difference text-black pointer-events-auto"
      >
        ThongNT
      </a>
      
      <div className="flex items-center gap-8 relative pointer-events-auto">
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-10 mix-blend-difference text-black">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="relative py-1 text-sm uppercase tracking-[0.25em] hover:opacity-60 transition-opacity"
            >
              {item.label}
              {activeSection === item.id && (
                <motion.div
                  layoutId="navbar-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden group flex flex-col items-end gap-1.5 p-2 mix-blend-difference text-black"
          aria-label="Menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <motion.span 
            animate={isMenuOpen ? { rotate: 45, y: 7, width: "1.5rem" } : { rotate: 0, y: 0, width: "2rem" }}
            className="h-0.5 bg-black transition-all duration-300"
          ></motion.span>
          <motion.span 
            animate={isMenuOpen ? { rotate: -45, y: -1, width: "1.5rem" } : { rotate: 0, y: 0, width: "1.25rem" }}
            className="h-0.5 bg-black transition-all duration-300"
          ></motion.span>
        </button>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden absolute right-0 top-full mt-4 bg-white/90 backdrop-blur-xl py-6 px-8 text-sm uppercase tracking-[0.25em] space-y-4 flex flex-col min-w-[240px] border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[60]"
            >
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block text-right transition-all duration-300 py-1 ${
                    activeSection === item.id ? 'text-black opacity-100' : 'text-black/60 hover:text-black'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

