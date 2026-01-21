import React from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 text-[10px] uppercase tracking-[0.3em] bg-stone-100">
      <p>© 2024 Thong Nguyen Trung. All rights reserved.</p>
      <p className="hidden md:block">Inspired by Amir Arhami Aesthetic</p>
      <button 
        onClick={scrollToTop}
        className="hover:opacity-100 flex items-center gap-2 transition-opacity group"
      >
        Back to Top
        <ArrowUp className="w-3 h-3 group-hover:-translate-y-1 transition-transform" />
      </button>
    </footer>
  );
};