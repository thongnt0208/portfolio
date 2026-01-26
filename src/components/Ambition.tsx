import React from 'react';
import { Reveal } from './Reveal';

export const Ambition: React.FC = () => {
  return (
    <section className="py-32 px-6 max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-12 items-end">
        <div className="lg:col-span-4">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] opacity-40">The Ambition</span>
          </Reveal>
        </div>
        <div className="lg:col-span-8">
          <Reveal delay={0.4}>
            <p className="text-2xl md:text-3xl lg:text-4xl leading-relaxed font-light text-stone-800">
              "I am a highly passionate software engineer but has User View Point and Product Mindset. 
              <br/>
              <br/>All the things I do aim to solve entirely users' pains and enhance UX. 
              <br/>
              <br/>The more helpful product, the more income for the company."
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
