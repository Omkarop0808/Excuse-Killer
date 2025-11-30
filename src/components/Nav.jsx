import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Nav.css';

function Nav({ streak = 0, pendingCount = 0 }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || 
           (path === '/challenge' && location.pathname === '/');
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Excuse Killer</span>
        </div>

        <div className="nav-links">
          <Link 
            to="/challenge" 
            className={`nav-link ${isActive('/challenge') || isActive('/') ? 'active' : ''}`}
          >
            Challenge
          </Link>
          <Link 
            to="/progress" 
            className={`nav-link ${isActive('/progress') ? 'active' : ''}`}
          >
            Progress
          </Link>
          <Link 
            to="/achievements" 
            className={`nav-link ${isActive('/achievements') ? 'active' : ''}`}
          >
            Achievements
          </Link>
        </div>

        <div className="nav-actions">
          <div className="notification-bell">
            <span className="bell-icon">🔔</span>
            {pendingCount > 0 && (
              <span className="notification-badge">{pendingCount}</span>
            )}
          </div>
          
          <div className="streak-badge">
            <span className="streak-icon">🔥</span>
            <span className="streak-count">{streak}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
