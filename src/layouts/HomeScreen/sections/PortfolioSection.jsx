// import React from 'react'

import { useEffect, useState } from 'react';
import portfolioInfo from './portfolioInfo.json'
import { useNavigate } from 'react-router-dom';



function PortfolioSection() {
  const [portfolioImages, setPortfolioImages] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const loadImages = async () => {
      const imagesPromises = [];
      for (let i = 1; i <= 9; i++) {
        imagesPromises.push(
          import(`../../../assets/images/portfolio/portfolio-${i}.png`)
            .then(module => module.default)
            .catch(error => {
              console.error(`Failed to load portfolio image ${i}`, error);
              return null; // Return null or a placeholder in case of error
            })
        );
      }

      Promise.all(imagesPromises).then(images => {
        // Filter out any nulls in case some images failed to load
        setPortfolioImages(images.filter(image => image !== null));
      });
    };

    loadImages();
  }, []);

  return (
    <section id="portfolio" className="portfolio" data-aos="fade-down" data-aos-delay="100">
      <div className="container">
        <div className="row text-center">
          <h1 className="display-3 fw-bold text-capitalize">Latest work</h1>
          <div className="heading-line"></div>
          <p className="lead">
            Discover my latest projects demonstrating creative problem-solving and modern design.
          </p>
        </div>
        <div className="row mb-4 g-3 text-center">
          <div className="col-md-12" style={{
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'center',
          }}>
            <button className="btn btn-outline-success rounded-pill" type="button">
              All
            </button>
            <button className="btn btn-outline-success rounded-pill" type="button">
              websites
            </button>
            <button className="btn btn-outline-success rounded-pill" type="button">
              design
            </button>
            <button className="btn btn-outline-success rounded-pill" type="button">
              others
            </button>
          </div>
        </div>

        <div className="row">
          {
            portfolioInfo.map((portfolio, index) => (
              <div className="col-lg-4 col-md-6" key={index}>
                <button
                  className="portfolio-box shadow border-0 p-0"
                  onClick={() => navigate(`/projects/${portfolio.id}`)}
                >
                  <img src={portfolioImages[index]} alt={`portfolio ${index + 1} image`} title={`portfolio ${index + 1} picture`} className="img-fluid" />
                  <div className="portfolio-info">
                    <div className="caption">
                      <h4>{portfolio.title}</h4>
                      <p>{portfolio.description}</p>
                    </div>
                  </div>
                </button>
              </div>
            ))
          }
          {/* Rest of the portfolio items */}
        </div>
      </div>
    </section>
  )
}

export default PortfolioSection