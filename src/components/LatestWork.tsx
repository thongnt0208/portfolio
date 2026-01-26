import React, { useState, useEffect } from 'react';
import { Reveal } from './Reveal';
import { PortfolioItem } from '../types';
import portfolioData from '../data/portfolioInfo.json';

export const LatestWork: React.FC = () => {
  const [filter, setFilter] = useState('All Projects');
  const [portfolioImages, setPortfolioImages] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const loadImages = async () => {
      const images: { [key: number]: string } = {};
      for (let i = 1; i <= 9; i++) {
        try {
          const module = await import(`../assets/images/portfolio/portfolio-${i}.png`);
          images[i - 1] = module.default;
        } catch (error) {
          console.error(`Failed to load portfolio image ${i}`, error);
        }
      }
      setPortfolioImages(images);
    };

    loadImages();
  }, []);

  const portfolioProjects = (portfolioData as PortfolioItem[]).map((item, index) => ({
    id: String(index + 1),
    title: item.title,
    category: item.description,
    year: '2024',
    image: portfolioImages[index] || '',
    marginTop: index % 2 === 1,
    link: item.link
  }));

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
          {portfolioProjects.map((project) => (
            <div key={project.id} className={project.marginTop ? 'md:mt-32' : ''}>
              <Reveal delay={0.2}>
                <div className="group cursor-pointer" onClick={() => project.link && window.open(project.link, '_blank')}>
                  <div className="aspect-[4/5] bg-stone-100 rounded-[2.5rem] overflow-hidden mb-8 relative">
                    {project.image && (
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-90"
                      />
                    )}
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
