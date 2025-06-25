import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/providers/AuthContext.js';
import '../../styles/MobileTabBar.css';

const MobileTabBar = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="mobile-tabbar">
      <Link to="/" className={`tab-item ${isActive('/') ? 'active' : ''}`}>
        <i className="bi bi-house-door"></i>
        <span>Home</span>
      </Link>
      
      <Link to="/" className={`tab-item ${location.pathname === '/' ? 'active' : ''}`}>
        <i className="bi bi-search"></i>
        <span>Search</span>
      </Link>
      
      {isAuthenticated && (
        <Link to="/favorites" className={`tab-item ${isActive('/favorites') ? 'active' : ''}`}>
          <i className="bi bi-heart"></i>
          <span>Favorites</span>
        </Link>
      )}
      
      {isAuthenticated && (
        <Link to="/ownRecipes" className={`tab-item ${isActive('/ownRecipes') ? 'active' : ''}`}>
          <i className="bi bi-journal-text"></i>
          <span>My Recipes</span>
        </Link>
      )}
      
      <Link to="/settings" className={`tab-item ${isActive('/settings') ? 'active' : ''}`}>
        <i className="bi bi-gear"></i>
        <span>Settings</span>
      </Link>
    </div>
  );
};

export default MobileTabBar; 