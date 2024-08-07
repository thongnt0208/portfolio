// import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from '../assets/images/logo.png'
import personalLogo from '../assets/images/favicon.ico'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const currentPath = window.location.pathname;
  const navigate = useNavigate();
  return (
    <>
      {!currentPath.includes('projects') && <nav className="navbar navbar-expand-lg navbar-dark menu shadow fixed-top">
        <div className="container">
          <a className="navbar-brand" href="">
            <img src={logo} alt="logo image" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="index.html">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#services">
                  Skills
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#portfolio">
                  portfolio
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">
                  contact
                </a>
              </li>
            </ul>
            <button
              type="button"
              className="rounded-pill btn-rounded"
              onClick={() => window.location.href = 'mailto:trungthongnguyen2002@gmail.com'}
            >
              trungthongnguyen2002@gmail.com
              <span>
                <FontAwesomeIcon icon={faPaperPlane} />
              </span>
            </button>
          </div>
        </div>
      </nav>}

      {currentPath.includes('projects') &&
        <nav className="navbar fixed-top" style={{ height: "4.5rem" }}>
          <div className="container personal-logo h-100" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            <img className='h-100' src={personalLogo} alt="logo" />
          </div>
        </nav>
      }
    </>
  )
}

export default Navbar