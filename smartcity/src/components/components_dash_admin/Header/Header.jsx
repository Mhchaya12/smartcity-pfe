import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = ({ title, subtitle }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  return (
    <header className="header">
      <div className="page-title">
        <h1>{title}</h1>
        <div className="page-subtitle">
          {subtitle || "Bienvenue, Chayma ! Voici les informations d'aujourd'hui."}
        </div>
      </div>

      <div className="header-actions">
        <div className="notification-bell">
          <FontAwesomeIcon icon={faBell} className="bell-icon" />
          <span className="notification-dot"></span>
        </div>

        <div className="user-profile" ref={dropdownRef}>
          <div className="profile-container" onClick={toggleDropdown}>
            <div className="avatar">CM</div>
            <div className="user-info">
              <div className="name">Chayma Mhalhli</div>
              <div className="role">Administrateur</div>
            </div>
          </div>
          
          {isDropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <h3>Administrateur</h3>
                <p className="email">admin@smartcity.com</p>
                <span className="admin-badge">Administrateur</span>
              </div>
              
              <div className="dropdown-menu">
                <div className="menu-item">
                  <FontAwesomeIcon icon={faUser} className="menu-icon" />
                  <span>Profil</span>
                </div>
                
                <div className="menu-item">
                  <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" />
                  <span>Se déconnecter</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;