import React from 'react';
import AdBannerIcon from '@assets/winote/illustration/ad-banner.svg?react';

export const AdBanner: React.FC = () => {
  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-30"
      style={{ maxWidth: 'var(--wn-max-width)' }}
    >
      <div className="h-8 pointer-events-none bg-gradient-to-b from-transparent to-[var(--wn-bg)]" />
      <div className="bg-wn-bg px-4 pt-2 pb-[34px]">
        <div className="flex items-center gap-3 h-[60px] px-3 bg-wn-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] rounded-wn-md border border-wn-card-gray relative overflow-hidden">
          <div className="w-10 h-10 rounded-wn-sm bg-[#DBEAFE] flex items-center justify-center shrink-0">
            <AdBannerIcon className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-wn-xs font-bold leading-4 text-[#1F2937] font-wn">
              Organize your life with TaskMaster
            </p>
            <p className="text-wn-2xs text-[#6B7280] leading-[15px] font-wn">
              Rated 4.9 stars by productivity experts
            </p>
          </div>

          <button className="py-1.5 px-3 rounded-wn-sm bg-[#3B82F6] text-wn-white border-none text-wn-2xs font-bold leading-[15px] cursor-pointer shrink-0 font-wn">
            INSTALL
          </button>

          <span className="absolute -top-1 right-[8px] text-[7.6px] text-[#9CA3AF] bg-[#F3F4F6] px-1 rounded border border-wn-card-gray leading-3 font-wn">
            Ad
          </span>
        </div>
      </div>
    </div>
  );
};
