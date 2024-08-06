// import React from 'react'

import { useEffect, useState } from "react";

function CompaniesSection() {
  const [companyImages, setCompanyImages] = useState([]);
  useEffect(() => {
    const loadImages = async () => {
      const imagesPromises = [];
      for (let i = 1; i <= 9; i++) {
        imagesPromises.push(
          import(`../../../assets/images/companies/company-${i}.png`)
            .then(module => module.default)
            .catch(error => {
              console.error(`Failed to load portfolio image ${i}`, error);
              return null; // Return null or a placeholder in case of error
            })
        );
      }

      Promise.all(imagesPromises).then(images => {
        // Filter out any nulls in case some images failed to load
        setCompanyImages(images.filter(image => image !== null));
      });
    };

    loadImages();
  }, []);

  return (
    <section id="companies" className="companies">
      <div className="container">
        <div className="row text-center">
          <h4 className="fw-bold lead mb-3">Technologies</h4>
          <div className="heading-line mb-5"></div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          {
            companyImages.map((company, index) => (
              <div className="col-md-4 col-lg-2" key={index}>
                <div className="companies__logo-box shadow-sm">
                  <img src={company} alt={`Company ${index + 1} logo`} title={`Company ${index + 1} Logo`} className="img-fluid" />
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  )
}

export default CompaniesSection