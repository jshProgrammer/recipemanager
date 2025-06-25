import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/providers/AuthContext.js';
import '../../styles/Profile.css';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="profile-container">
        <div className="text-center">
          <h3>Please log in to access your profile</h3>
          <Link to="/login" className="btn btn-primary">
            Go to Login
          </Link>
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
      </div>
    </div>
  );
};

export default Profile; 