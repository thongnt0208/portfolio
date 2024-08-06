// import React from 'react'

import { faArrowDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function ContactSection() {
  return (
    <section id="contact" className="get-started">
      <div className="container">
        <div className="row text-center">
          <h1 className="display-3 fw-bold text-capitalize">Reach out to me</h1>
          <div className="heading-line"></div>
          <p className="lh-lg">Feel free to contact me if you have any questions or demmand.</p>
        </div>

        <div className="row text-white get-started-card">
          <div className="col-12 col-lg-6 gradient shadow p-3">
            <div className="cta-info w-100">
              <h4 className="display-4 fw-bold">Thong Nguyen Trung</h4>
              <p className="lh-lg">
                I am a highly passionate software engineer. I am eager to contribute my skills and knowledge to your
                team. I am confident that my strong work ethic and dedication to learning will make me a valuable asset
                to your organization.
              </p>
              <h3 className="display-3--brief">Download my CV</h3>
              <button
                type="button"
                className="rounded-pill btn-rounded border-primaryy"
                onClick={() =>
                  window.open(
                    'https://drive.usercontent.google.com/u/0/uc?id=1VUq44oJbjQ2PZaoHgwwJeoOHqLsx7kvb&export=download'
                  )
                }
              >
                Download
                <span>
                  <FontAwesomeIcon icon={faArrowDown} />
                </span>
              </button>
            </div>
          </div>
          <div className="col-12 col-lg-6 bg-white shadow p-3">
            <div className="form w-100 pb-2">
              <h4 className="display-3--title mb-5">start our project</h4>
              <form action="#" className="row">
                <div className="col-lg-12 col-md mb-3">
                  <input
                    type="text"
                    placeholder="Name or Company's Name"
                    id="name"
                    className="shadow form-control form-control-lg"
                    required
                  />
                </div>
                <div className="col-lg-12 mb-3">
                  <input
                    type="email"
                    placeholder="Email Address"
                    id="inputEmail"
                    className="shadow form-control form-control-lg"
                    required
                  />
                </div>
                <div className="col-lg-12 mb-3">
                  <textarea
                    name="message"
                    placeholder="Message"
                    id="message"
                    rows="8"
                    className="shadow form-control form-control-lg"
                    required
                  ></textarea>
                </div>
                <div className="text-center d-grid mt-1">
                  <button type="button" className="btn btn-success rounded-pill pt-3 pb-3" id="submit-btn">
                    <span className="spinner-border spinner-border-sm d-none" id="submit-spinner" role="status" aria-hidden="true"></span>
                    Send
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection