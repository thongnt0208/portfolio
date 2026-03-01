import React from 'react';
import { Monitor } from 'lucide-react';

export const AdBanner: React.FC = () => {
  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-30"
      style={{ maxWidth: 'var(--wn-max-width)' }}
    >
      <div
        className="h-8 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--wn-bg))' }}
      />
      <div className="bg-wn-bg px-4 pt-2 pb-4">
        <div className="flex items-center gap-3 py-2.5 px-3 bg-wn-bg-light rounded-wn-md shadow-wn-card-sm border border-wn-border relative">
          <div className="w-10 h-10 rounded-wn-sm bg-wn-card-green-light flex items-center justify-center shrink-0">
            <Monitor size={18} color="var(--wn-accent-green)" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-wn-sm font-medium leading-tight">
              Organize your life with TaskMaster
            </p>
            <p className="text-wn-xs text-wn-text-tertiary leading-tight">
              Rated 4.9 stars by productivity experts
            </p>
          </div>

          <button className="py-1.5 px-3 rounded-wn-pill bg-[#4285F4] text-white border-none text-wn-xs font-bold tracking-wide cursor-pointer shrink-0">
            INSTALL
          </button>

          <span className="absolute -top-1.5 right-1 text-[9px] text-wn-text-tertiary bg-wn-bg-light px-1 rounded">
            Ad
          </span>
        </div>
      </div>
    </div>
  );
};
