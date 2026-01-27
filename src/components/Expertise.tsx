import React from 'react';
import { Layers, ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { ExpertiseItem } from '../types';

const expertiseData: ExpertiseItem[] = [
  {
    id: 'tech',
    number: '01 / TECHNICAL',
    title: 'Web Development',
    description: 'Mastering the modern web stack. From React and Next.js to scalable backend architectures with Node.js and PostgreSQL. Passionate about creating user-centric and visually appealing websites.',
    tags: ['React', 'TypeScript', 'Next.js', 'Tailwind', 'Node.js', 'PostgreSQL'],
    link: 'https://github.com/thongnt0208'
  },
  {
    id: 'visual',
    number: '02 / VISUAL',
    title: 'UX/UI Design',
    description: 'Deep understanding of user behavior and interface principles. Creating visually appealing, high-end interfaces that convert. Skilled in creating user-friendly interfaces.',
    tags: ['Figma', 'Motion', 'Typography', 'Branding'],
    link: 'https://www.figma.com/@thongnt028'
  }
];

export const Expertise: React.FC = () => {
  return (
    <section id="expertise" className="py-32 px-6 bg-stone-100/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-20">
          <Reveal>
            <h2 className="text-5xl md:text-7xl uppercase tracking-tighter font-bold text-stone-900">Core Expertise</h2>
          </Reveal>
          <Reveal delay={0.4}>
            <Layers className="w-16 h-16 opacity-10" strokeWidth={1} />
          </Reveal>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {expertiseData.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.2}>
              <div className="bg-white p-10 md:p-12 rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-500 group border border-stone-100 h-full">
                <span className="text-sm font-mono opacity-40 mb-12 block">{item.number}</span>
                <h3 className="text-3xl md:text-4xl mb-6 font-bold tracking-tight text-stone-900">{item.title}</h3>
                <p className="opacity-60 leading-relaxed mb-8 max-w-md">
                  {item.description}
                </p>
                <ul className="flex flex-wrap gap-4 text-xs tracking-widest uppercase opacity-40 group-hover:opacity-100 transition-opacity mb-8">
                  {item.tags.map(tag => (
                    <li key={tag} className="px-3 py-1 border border-stone-900/20 rounded-full">
                      {tag}
                    </li>
                  ))}
                </ul>
                {item.link && (
                  <button
                    onClick={() => window.open(item.link, '_blank')}
                    className="rounded-pill border border-stone-900/20 px-6 py-2 rounded-full hover:bg-stone-900 hover:text-white transition-all duration-300 text-sm uppercase tracking-widest flex items-center gap-2 font-medium group/btn"
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
