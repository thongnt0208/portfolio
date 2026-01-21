import React from 'react';

export const Sidebars: React.FC = () => {
  return (
    <>
      <aside className="fixed left-8 bottom-12 hidden lg:flex flex-col gap-4 z-40 text-xs tracking-[0.2em] uppercase opacity-40 mix-blend-darken">
        <p className="vertical-text">Scroll to explore</p>
        <div className="w-px h-12 bg-stone-900 mx-auto"></div>
      </aside>

      <aside className="fixed right-8 bottom-12 hidden lg:flex flex-col gap-6 z-40 text-xs tracking-[0.2em] uppercase opacity-40 mix-blend-darken">
        <a href="#" className="hover:opacity-100 hover:scale-105 transition-all origin-right">LinkedIn</a>
        <a href="#" className="hover:opacity-100 hover:scale-105 transition-all origin-right">GitHub</a>
        <a href="#" className="hover:opacity-100 hover:scale-105 transition-all origin-right">Twitter</a>
      </aside>
    </>
  );
};