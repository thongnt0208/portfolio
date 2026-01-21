import React from 'react';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-8 py-6 flex justify-between items-center mix-blend-difference text-white">
      <a href="#" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
        T.N.T
      </a>
      <div className="flex items-center gap-8">
        <button className="group flex flex-col items-end gap-1.5 p-2" aria-label="Menu">
          <span className="w-8 h-0.5 bg-white transition-all duration-300 group-hover:w-12"></span>
          <span className="w-5 h-0.5 bg-white transition-all duration-300 group-hover:w-12"></span>
        </button>
      </div>
    </nav>
  );
};