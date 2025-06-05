import { useState } from 'react';
import './Header.css';
import logo from '../assets/logo.png';
import LogInSignUp from "./LogInSignUp";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isPopupOpen, setIsPopupOpen] = useState(false);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const switchPopupVisibility = () => {
    setIsPopupOpen(prev => !prev);
  };

  // dummy function at first
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(!isLoggedIn);
    setIsMenuOpen(false);
    
    const message = isLoggedIn ? 'You are now logged out' : 'You are now logged in!';
    alert(message);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top">
        <div className="container-fluid px-4 px-lg-5">
          
          
          <a className="navbar-brand" href="#">
            <img src={logo} alt="RecipeManager Logo" width="60"/>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
            onClick={toggleMenu}
          >
            <span className="navbar-toggler-icon">
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </span>
          </button>

          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <a className="nav-link" href="#">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Recipes</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#search">Search</a>
              </li>
            </ul>

            <div className="d-lg-none w-100">
              <hr className="my-2" />
            </div>

            
            <div className="d-flex align-items-center">
              {!isLoggedIn ? (
               <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    switchPopupVisibility();
                  }}
                  className="btn borderGreen"
                >
                  Your Account
                </a>
              ) : (
                <div className="d-flex align-items-center gap-3">
                  <i className="bi bi-person-circle profile-img" style={{ fontSize: '2rem' }}></i>
                  <button 
                    onClick={handleLogin}
                    className="btn borderGreen">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
            
        </div>
      </nav>

      <LogInSignUp
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onLogin={() => {
          setIsLoggedIn(true);
          setIsPopupOpen(false);
        }}
      />
    </div>
  );
};

export default Header;