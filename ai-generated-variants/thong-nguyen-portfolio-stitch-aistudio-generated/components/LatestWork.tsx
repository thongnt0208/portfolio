import React, { useState } from 'react';
import { Reveal } from './Reveal';
import { Project } from '../types';

const projects: Project[] = [
  {
    id: '1',
    title: 'The Minimalist E-commerce',
    category: 'UI/UX • Development • 2024',
    year: '2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7JrdKEinJBkIsAYc1STCzdDWGYMLAt351yKKY6ewuqp7NXl5P8VooIlc95_ucXIwSKnCOy_9Ul1ro-cZ5lPQNE2YQeJcOI0X53AiKzCStyLd6MHxHc6dvtdPQDonTc0EHlmAzZhsjfi-n9J4gpDgrlsTys8xeiSCtaCtWrItcWjWBK7RaYl8_dDtpSxa4PRGgdwLmD91VRK18PWKBHrjoAZ7H-wGTLc7Am9R508WQwnMl0kdgIDdsy2IaNxHLVRTkDRiDrCUizdgK',
    marginTop: false
  },
  {
    id: '2',
    title: 'Architecture Portfolio',
    category: 'Branding • Web Design • 2023',
    year: '2023',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMpqjP-PJT-pGBugsi7YVRZuMJnlg28EijFuanu55pB9YzmSwoJoOfqXxUh9BsHYNb5mtwSZ-81DouVStOxDlant5PiNbrcr21kihY92a8d9GzYQqhjhd2i-Qhy96co2lIRdBtnF_GHDqXVwHx7MRu7_El1K_CYCggkcVqSu6_iRiA0pLrM73XzzvhzRGsSrMo9o28_R4RgtzMv9b1mmDm6qoqaW2t6Kr4fL-tClYLGbIGjc1Qzmy7cDO7j-U1xlPoSNGeR5lSoGP5',
    marginTop: true
  },
  {
    id: '3',
    title: 'SaaS Dashboard V2',
    category: 'Product Design • React • 2024',
    year: '2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLEju_O7zNasQeDFgxqkHBuiNmMOQEH0Ft8ZcB43RoWVvX2H2thUzZfs8tqzSeSlz6amu5AQnev6_fYYoiBG6WqsAgg4JScvOOK0Pz4EqTKsV7yp5tYIhV7zuQg0sGQBKp9BJ7ESd55kaf6E0_XS7VK39VeRwzJEQGeCcJBuzYVfa5ec771-ykCzQIAJuc_MFY-r0-CZe00K4L0XEE0xE3ffbwTpgrvRNqzZhO3_7lXO4KllWmhjiAg4EIX3ss1ljeLI3Qo8QNtQew',
    marginTop: false
  },
  {
    id: '4',
    title: 'Crypto Analytics Hub',
    category: 'Data Vis • Next.js • 2023',
    year: '2023',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXAT2fTiOXVQAOhpIVieCLM12loPOYDtzhd0kQeVeWyUPRrpPi-fHtJFRbaz4KWYHbJ8sJ-Sa24tkGPkmWVcgYRK73XCpn5yzjTgAapgwyuHX24FyZLmpk8_0d3EZLiiMkRmfKp4gafdtcTqboM4Qfm4MnLixDuMz4d9oEf3-yTUVCTBnyEj2TY41JDIDWN8m0LmvzYOAWLbX0SdZv8PrzN7oPzJbHfYQ_JIsWcXmu0q---2Eg2R7E7kPvZT1_HIT3OI6N7GJDBn51',
    marginTop: true
  }
];

export const LatestWork: React.FC = () => {
  const [filter, setFilter] = useState('All');

  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 gap-8">
          <Reveal>
            <h2 className="text-5xl md:text-7xl uppercase tracking-tighter font-bold text-stone-900">Latest Work</h2>
          </Reveal>
          
          <Reveal delay={0.3}>
            <div className="flex gap-6 text-xs uppercase tracking-widest opacity-60">
              {['All Projects', 'Websites', 'Applications'].map((item) => (
                <button 
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`hover:opacity-100 border-b-2 transition-all pb-1 ${
                    filter === item ? 'border-stone-900 opacity-100' : 'border-transparent'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          {projects.map((project) => (
            <div key={project.id} className={project.marginTop ? 'md:mt-32' : ''}>
              <Reveal delay={0.2}>
                <div className="group cursor-pointer">
                  <div className="aspect-[4/5] bg-stone-100 rounded-[2.5rem] overflow-hidden mb-8 relative">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-90"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <span className="border border-white px-8 py-3 rounded-full text-white uppercase text-xs tracking-widest backdrop-blur-sm hover:bg-white hover:text-black transition-colors">
                        View Project
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-2xl font-bold tracking-tight mb-2 text-stone-900">{project.title}</h4>
                      <p className="text-sm opacity-40 uppercase tracking-widest font-medium">{project.category}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};