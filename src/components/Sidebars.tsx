import React from 'react';

export const Sidebars: React.FC = () => {
  return (
    <>
      <aside className="fixed left-8 bottom-12 hidden lg:flex flex-col gap-4 z-40 text-xs tracking-[0.2em] uppercase opacity-40 mix-blend-darken">
        <p className="vertical-text">Scroll to explore</p>
        <div className="w-px h-12 bg-stone-900 mx-auto"></div>
      </aside>

      {/*
        Sidebar will be hidden when reaching the end of the site (bottom).
        This uses a scroll event listener and a state to hide/show the sidebar.
      */}
      {(() => {
        const [showSidebar, setShowSidebar] = React.useState(true);

        React.useEffect(() => {
          const handleScroll = () => {
            const scrollPosition = window.innerHeight + window.scrollY;
            const threshold = 60; // px from very bottom when it should hide
            if (scrollPosition >= document.body.offsetHeight - threshold) {
              setShowSidebar(false);
            } else {
              setShowSidebar(true);
            }
          };

          window.addEventListener('scroll', handleScroll);
          // check once on mount
          handleScroll();
          return () => {
            window.removeEventListener('scroll', handleScroll);
          };
        }, []);

        return (
          <aside className={`${showSidebar ? 'opacity-40 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed right-8 bottom-12 hidden lg:flex flex-col gap-6 z-40 text-xs tracking-[0.2em] uppercase mix-blend-darken transition-opacity duration-300 ease-out translate-x-0`}>
            <a href="https://www.linkedin.com/in/thongnt0208" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 hover:scale-105 transition-all origin-right">LinkedIn</a>
            <a href="https://github.com/thongnt0208" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 hover:scale-105 transition-all origin-right">GitHub</a>
            <a href="https://www.facebook.com/thongwisen" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 hover:scale-105 transition-all origin-right">Facebook</a>
            <a href="https://www.tiktok.com/@wisen" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 hover:scale-105 transition-all origin-right">TikTok</a>
          </aside>
        );
      })()}
    </>
  );
};
