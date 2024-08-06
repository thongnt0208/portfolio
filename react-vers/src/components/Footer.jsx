// import React from 'react'

import { faFacebook, faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { faPaintBrush } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-lg-6 contact-box pt-1 d-md-block d-lg-flex d-flex">
            <div className="contact-box__icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-phone-call"
                viewBox="0 0 24 24"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                <path d="M15 7a2 2 0 0 1 2 2" />
                <path d="M15 3a6 6 0 0 1 6 6" />
              </svg>
            </div>
            <div className="contact-box__info">
              <a href="#" className="contact-box__info--title">
                +84 365 960 823
              </a>
              <p className="contact-box__info--subtitle">Mon-Fri 9am-5pm | Zalo</p>
            </div>
          </div>
          {/* CONTENT FOR EMAIL  --> */}
          <div className="col-md-6 col-lg-6 contact-box pt-1 d-md-block d-lg-flex d-flex">

            <div className="contact-box__info">
              <a href="#" className="contact-box__info--title">trungthongnguyen2002@gmail.com</a>
              <p className="contact-box__info--subtitle">Online support</p>
            </div>
            <div className="contact-box__icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-mail-opened"
                viewBox="0 0 24 24"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <polyline points="3 9 12 15 21 9 12 3 3 9" />
                <path d="M21 9v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
                <line x1="3" y1="19" x2="9" y2="13" />
                <line x1="15" y1="13" x2="21" y2="19" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-sm" style={{ backgroundColor: '#212121' }}>
        <div className="container">
          <div className="row py-4 text-center text-white">
            <div className="col-lg-5 col-md-6 mb-4 mb-md-0">connect with me on social media</div>
            <div className="col-lg-7 col-md-6 social-links">
              <a href="https://www.facebook.com/thongwisen">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="https://github.com/thongnt0208">
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a href="https://www.linkedin.com/in/thongnt0208">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a href="https://www.figma.com/@thongnt028">
                <FontAwesomeIcon icon={faPaintBrush} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="row text-white justify-content-center mt-3 pb-3">
          <div className="col-12 col-sm-6 col-lg-6 mx-auto">
            <h5 className="text-capitalize fw-bold">ThongNT (#wisen)</h5>
            <hr className="bg-white d-inline-block mb-4" style={{ width: '60px', height: '2px' }} />
            <p className="lh-lg">An enthusiastic web developer with knowledge in React, UX/UI and more.</p>
          </div>
          {/* Rest of the footer links */}
        </div>
      </div>

      <div className="footer-bottom pt-5 pb-5">
        <div className="container">
          <div className="row text-center text-white">
            <div className="col-12">
              <div className="footer-bottom__copyright">
                &COPY; Copyright 2024 <a href="#">Personal</a> | Created by ThongNT (#wisen) | Customized on template of{' '}
                <a href="http://codewithpatrick.com" target="_blank">
                  Muriungi
                </a>
                <br />
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer