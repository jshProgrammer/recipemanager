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
      
      <Link to="/search" className={`tab-item ${isActive('/search') ? 'active' : ''}`}>
        <i className="bi bi-search"></i>
        <span>Search</span>
      </Link>
      
      {isAuthenticated && (
        <Link to="/profile" className={`tab-item ${isActive('/profile') ? 'active' : ''}`}>
          <i className="bi bi-person-circle"></i>
          <span>Profile</span>
        </Link>
      )}
    </div>
  );
};

export default MobileTabBar; 