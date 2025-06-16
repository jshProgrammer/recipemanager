import { useState } from 'react';
import { useAuth } from '../../features/authentication.js';
import '../../styles/Header.css';
import logo from '../../assets/logo.png';
import LogInSignUpPopup from "../pages/LogInSignUpPopup.js";
import { Link, useNavigate } from "react-router-dom";
import HealthScore from "./HealthScore";
import { useHealthScoreRefresh } from "../../features/providers/HealthScoreRefreshContext";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { refreshKey } = useHealthScoreRefresh();

  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const switchPopupVisibility = () => {
    setIsPopupOpen(prev => !prev);
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setIsMenuOpen(false);
      navigate("/")
    }

  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  if (isLoading) {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top">
        <div className="container-fluid px-4 px-lg-5">
          <a className="navbar-brand" href="#">
            <img src={logo} alt="RecipeManager Logo" width="60"/>
          </a>
          <div className="d-flex align-items-center">
            <span>Loading...</span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <div>
      {showLogoutConfirm && (
        <div
          className="position-fixed w-100 h-100"
          style={{
            top: 0,
            left: 0,
            zIndex: 999
          }}
          onClick={cancelLogout}
        />
      )}

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
                <Link className="nav-link" to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={() => setIsMenuOpen(false)}>Recipes</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/search" onClick={() => setIsMenuOpen(false)}>Search</Link>
              </li>
              {isAuthenticated && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/favorites" onClick={() => setIsMenuOpen(false)}>Favorites</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/ownRecipes" onClick={() => setIsMenuOpen(false)}>Own Recipes</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/settings" onClick={() => setIsMenuOpen(false)}>Settings</Link>
                  </li>
                </>
              )}
            </ul>

            <div className="d-lg-none w-100">
              <hr className="my-2" />
            </div>

            
            <div className="d-flex align-items-center">
              {!isAuthenticated ? (
               <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    switchPopupVisibility();
                  }}
                  className="btn borderGreen">
                  <i className="bi bi-person-circle" style={{ fontSize: '1rem', marginRight: 5 }}></i>
                  Your Account
                </a>
              ) : (
                <div className="d-flex align-items-center gap-3">
                  <HealthScore user={user} refreshKey={refreshKey} />
                  <button 
                    onClick={confirmLogout}
                    className="btn borderGreen">
                    <i className="bi bi-box-arrow-right" style={{ fontSize: '1rem',  marginRight: 5 }}></i>
                    Logout
                  </button>

                  {showLogoutConfirm && (
                    <div 
                      className="position-absolute bg-white border rounded shadow-lg p-3"
                      style={{
                        top: '100%',
                        right: 0,
                        marginTop: '8px',
                        minWidth: '200px',
                        zIndex: 1000
                      }}
                    >
                      <p className="mb-2 text-dark">Are you sure you want to logout?</p>
                      <div className="d-flex gap-2">
                        <button
                          onClick={handleLogout}
                          className="btn btn-danger btn-sm flex-fill"
                        >
                          Yes, Logout
                        </button>
                        <button
                          onClick={cancelLogout}
                          className="btn btn-outline-secondary btn-sm flex-fill"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
               
            </div>
          </div>
            
        </div>
      </nav>

      <LogInSignUpPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </div>
  );
};

export default Header;