import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storage';
import './Nav.css';

function Nav({ streak = 0, pendingCount = 0 }) {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useLocalStorage(STORAGE_KEYS.NOTIFICATIONS, []);
  const dropdownRef = useRef(null);

  const isActive = (path) => {
    return location.pathname === path || 
           (path === '/challenge' && location.pathname === '/');
  };

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

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
          <div className="notification-bell" onClick={handleBellClick} ref={dropdownRef}>
            <span className="bell-icon">🔔</span>
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          
            {showNotifications && (
              <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3>Notifications</h3>
                {notifications.length > 0 && (
                  <button onClick={handleClearNotifications} className="clear-all-btn">
                    Clear All
                  </button>
                )}
              </div>
              <div className="notifications-list">
                {notifications.length === 0 ? (
                  <div className="no-notifications">
                    <span>🔕</span>
                    <p>No notifications</p>
                  </div>
                ) : (
                  notifications.slice().reverse().map((notif) => (
                    <div key={notif.id} className={`notification-item notification-${notif.type}`}>
                      <div className="notification-content">
                        <p>{notif.message}</p>
                        <span className="notification-time">
                          {new Date(notif.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notif.id);
                        }}
                        className="delete-notif-btn"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
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
