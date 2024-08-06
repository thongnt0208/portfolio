// import React from 'react'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import service1pic from '@assets/images/services/service-1.png'
import service2pic from '@assets/images/services/service-2.png'
import service3pic from '@assets/images/services/service-3.png'

function ServicesSection() {
  return (
    <section id="services" className="services" data-aos="fade-down">
      <div className="container">
        <div className="row text-center">
          <h1 className="display-3 fw-bold">My Skills</h1>
          <div className="heading-line mb-1"></div>
        </div>
        <div className="row pt-2 pb-2 mt-0 mb-3" data-aos="flip-left">
          <div className="col-md-6 border-right">
            <div className="bg-white p-3">
              <h2 className="fw-bold text-capitalize text-center">
                Creative developer with technical skills in Web development.
              </h2>
            </div>
          </div>
          <div className="col-md-6">
            <div className="bg-white p-4 text-start">
              <p className="fw-light">
                Passionate developer with a creative eye and technical prowess in HTML, CSS, and JavaScript. Eager to
                contribute to projects that redefine the boundaries of front-end development.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row" data-aos="flip-left">
          <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 services mt-4">
            <div className="services__content">
              <div className="icon d-block fas fa-code"></div>
              <h3 className="display-3--title mt-1">web development</h3>
              <p className="lh-lg fw-light">
                Aspiring web developer with a solid foundation in HTML, CSS, and JavaScript. Passionate about creating
                user-centric and visually appealing websites.
              </p>
              <button
                type="button"
                className="rounded-pill btn-rounded border-primaryy"
                onClick={() => window.open('https://github.com/thongnt0208', '_blank')}
              >
                Learn more
                <span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
              </button>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 services mt-4 text-end">
            <div className="services__pic">
              <img src={service2pic} alt="web development illustration" className="img-fluid" />
            </div>
          </div>
        </div>

        <div className="row" data-aos="flip-left">
          <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 services mt-4 text-start">
            <div className="services__pic">
              <img src={service1pic} alt="marketing illustration" className="img-fluid" />
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 services mt-4">
            <div className="services__content">
              <div className="icon d-block fas fa-paper-plane"></div>
              <h3 className="display-3--title mt-1">UX/UI</h3>
              <p className="fw-light lh-lg">
                Understanding of user experience and interface design principles. Skilled in creating visually appealing and user-friendly interfaces.
              </p>
              <button
                type="button"
                className="rounded-pill btn-rounded border-primaryy"
                onClick={() => window.open('https://www.figma.com/@thongnt028', '_blank')}
              >
                Learn more
                <span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="row" data-aos="flip-left">
          <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 services mt-4">
            <div className="services__content">
              <div className="icon d-block fas fa-cloud-upload-alt"></div>
              <h3 className="display-3--title mt-1">other skills</h3>
              <p className="lh-lg fw-light">
                Strong communicator, problem-solver, and team player. Highly motivated and eager to learn. Committed to
                delivering high-quality work.
              </p>
              <button
                type="button"
                className="rounded-pill btn-rounded border-primaryy"
                onClick={() => window.open('https://www.linkedin.com/in/thongnt0208', '_blank')}
              >
                Learn more
                <span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
              </button>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 services mt-4 text-end">
            <div className="services__pic">
              <img src={service3pic} alt="cloud hosting illustration" className="img-fluid" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServicesSection