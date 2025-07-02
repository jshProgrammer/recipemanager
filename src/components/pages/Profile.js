import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/providers/AuthContext.js';
import '../../styles/Profile.css';

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setShowLogoutConfirm(false);
      navigate("/");
    }
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <i className="bi bi-person-circle"></i>
          </div>
          <h2 className="profile-name">Welcome to RecipeManager</h2>
          <p className="profile-subtitle">Please log in to access your profile</p>
        </div>

        <div className="profile-menu">
          <Link to="/login" className="profile-menu-item login-item">
            <div className="menu-item-icon">
              <i className="bi bi-box-arrow-in-right"></i>
            </div>
            <div className="menu-item-content">
              <h4>Login</h4>
              <p>Sign in to your account</p>
            </div>
            <div className="menu-item-arrow">
              <i className="bi bi-chevron-right"></i>
            </div>
          </Link>

          <Link to="/login" className="profile-menu-item signup-item">
            <div className="menu-item-icon">
              <i className="bi bi-person-plus"></i>
            </div>
            <div className="menu-item-content">
              <h4>Sign Up</h4>
              <p>Create a new account</p>
            </div>
            <div className="menu-item-arrow">
              <i className="bi bi-chevron-right"></i>
            </div>
          </Link>
        </div>

        <div className="profile-info">
          <div className="info-card">
            <h5>Why create an account?</h5>
            <ul>
              <li>Save your favorite recipes</li>
              <li>Create your own recipe collections</li>
              <li>Track your cooking preferences</li>
              <li>Access personalized recommendations</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <i className="bi bi-person-circle"></i>
        </div>
        <h2 className="profile-name">{user?.email || 'User'}</h2>
        <p className="profile-subtitle">Welcome back!</p>
      </div>

      <div className="profile-menu">
        <Link to="/favorites" className="profile-menu-item">
          <div className="menu-item-icon">
            <i className="bi bi-heart"></i>
          </div>
          <div className="menu-item-content">
            <h4>Favorites</h4>
            <p>Your saved recipes</p>
          </div>
          <div className="menu-item-arrow">
            <i className="bi bi-chevron-right"></i>
          </div>
        </Link>

        <Link to="/ownRecipes" className="profile-menu-item">
          <div className="menu-item-icon">
            <i className="bi bi-journal-text"></i>
          </div>
          <div className="menu-item-content">
            <h4>My Recipes</h4>
            <p>Your own recipes</p>
          </div>
          <div className="menu-item-arrow">
            <i className="bi bi-chevron-right"></i>
          </div>
        </Link>

        <Link to="/settings" className="profile-menu-item">
          <div className="menu-item-icon">
            <i className="bi bi-gear"></i>
          </div>
          <div className="menu-item-content">
            <h4>Settings</h4>
            <p>App preferences</p>
          </div>
          <div className="menu-item-arrow">
            <i className="bi bi-chevron-right"></i>
          </div>
        </Link>

        <button onClick={confirmLogout} className="profile-menu-item logout-item">
          <div className="menu-item-icon">
            <i className="bi bi-box-arrow-right"></i>
          </div>
          <div className="menu-item-content">
            <h4>Logout</h4>
            <p>Sign out of your account</p>
          </div>
          <div className="menu-item-arrow">
            <i className="bi bi-chevron-right"></i>
          </div>
        </button>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="logout-overlay" onClick={cancelLogout}>
          <div className="logout-dialog" onClick={(e) => e.stopPropagation()}>
            <h4>Confirm Logout</h4>
            <p>Are you sure you want to logout?</p>
            <div className="logout-buttons">
              <button onClick={handleLogout} className="btn btn-danger">
                Yes, Logout
              </button>
              <button onClick={cancelLogout} className="btn btn-outline-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;