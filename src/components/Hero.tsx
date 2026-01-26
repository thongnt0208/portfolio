import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from './Reveal';

export const Hero: React.FC = () => {
  return (
    <header className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden pt-20 pb-10">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
            backgroundImage: `radial-gradient(rgba(10, 10, 10, 0.05) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
        }}
      ></div>

      <div className="text-center z-10 max-w-4xl mx-auto">
        <Reveal delay={0.2}>
          <p className="text-sm tracking-[0.4em] uppercase mb-8 opacity-60">
            Creative Web Developer
          </p>
        </Reveal>
        
        <Reveal delay={0.4}>
          <h1 className="text-[clamp(3rem,10vw,8rem)] leading-[0.9] font-extrabold uppercase mb-12 flex flex-col items-center text-stone-900">
            <span>Thong</span>
            <span className="font-light text-stone-400">Nguyen Trung</span>
          </h1>
        </Reveal>

        <Reveal delay={0.6}>
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="border border-stone-900/10 px-10 py-4 rounded-full hover:bg-stone-900 hover:text-white transition-all duration-500 text-sm uppercase tracking-widest flex items-center gap-4 mx-auto font-medium group bg-white/50 backdrop-blur-sm"
          >
            View Curriculum Vitae
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </Reveal>
      </div>

      <Reveal delay={0.8} className="w-full max-w-5xl mt-20">
        <div className="w-full aspect-video rounded-[3rem] overflow-hidden border border-white/50 shadow-2xl shadow-stone-200/50">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7LT9WYCWyyZEtOd04K4ezSbR2TAXUzlgrR5JjYlxOqzdC-PcD3kDBLs07vByRp2WUiO0_ow8ciWYosY7qTbmwkTxb0nob_KUeiSS1mrzHLSMLRiPWREpwISe02FwESCF1dr5h7RyAw6yuuRHjqvlW_ktl1TJukD3gg3C3TXfXcE1K3pHXez-w2p5Q5H2OgLWl4h6ILWSx1dlceXuG1XgFQyU16lIFP5i9SiHpkoFP1bNjwcmPWUhXYZHMRGEnUVjXNCTE2DsGRTLW" 
            alt="Abstract Tech Visualization" 
            className="w-full h-full object-cover opacity-90 grayscale hover:grayscale-0 transition-all duration-[1.5s] ease-in-out hover:scale-105"
          />
        </div>
      </Reveal>
    </header>
  );
};
