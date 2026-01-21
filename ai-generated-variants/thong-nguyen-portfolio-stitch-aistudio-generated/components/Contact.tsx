import React, { useState } from 'react';
import { Copy, CheckCircle } from 'lucide-react';
import { Reveal } from './Reveal';
import { motion, AnimatePresence } from 'framer-motion';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const email = "trungthongnguyen@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-40 px-6 bg-stone-100 text-stone-900 overflow-hidden relative">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.5em] opacity-40 block mb-12">Available for collaborations</span>
        </Reveal>
        
        <Reveal delay={0.2}>
          <h2 className="text-6xl md:text-9xl font-bold mb-16 tracking-tighter">
            Let's build something <br /> remarkable.
          </h2>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="relative inline-block">
            <div className="flex flex-col md:flex-row items-center gap-6 justify-center bg-white p-3 pr-4 rounded-full shadow-2xl shadow-stone-200/50 border border-white">
              <div className="px-8 py-2">
                <a href={`mailto:${email}`} className="text-2xl md:text-4xl font-light hover:opacity-60 transition-opacity tracking-tight">
                  {email}
                </a>
              </div>
              <button 
                aria-label="Copy Email Address" 
                onClick={handleCopy}
                className="w-14 h-14 rounded-full bg-stone-900 text-white flex items-center justify-center hover:scale-105 hover:bg-black transition-all duration-300 group"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>

            {/* Success Overlay Animation */}
            <AnimatePresence>
              {copied && (
                <motion.div
                  initial={{ clipPath: "circle(0% at 50% 50%)", opacity: 0 }}
                  animate={{ clipPath: "circle(150% at 50% 50%)", opacity: 1 }}
                  exit={{ clipPath: "circle(0% at 50% 50%)", opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center bg-stone-900 text-white rounded-full z-20 pointer-events-none"
                >
                  <span className="text-3xl md:text-5xl font-bold tracking-tighter flex items-center gap-4">
                    COPIED! <CheckCircle className="w-8 h-8 md:w-10 md:h-10 fill-white text-stone-900" />
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        <div className="mt-32 grid md:grid-cols-3 gap-12 text-left pt-20 border-t border-stone-200">
          <Reveal delay={0.6} className="h-full">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-40 mb-4">Location</p>
              <p className="text-lg">Da Nang, Vietnam</p>
            </div>
          </Reveal>
          
          <Reveal delay={0.7} className="h-full">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-40 mb-4">Social</p>
              <div className="flex gap-4 font-medium">
                <a href="#" className="hover:opacity-60 transition-opacity">TW</a>
                <a href="#" className="hover:opacity-60 transition-opacity">LI</a>
                <a href="#" className="hover:opacity-60 transition-opacity">GH</a>
                <a href="#" className="hover:opacity-60 transition-opacity">IG</a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.8} className="h-full">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-40 mb-4">Experience</p>
              <p className="text-lg">8+ Years in Tech</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};