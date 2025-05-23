import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ title, subtitle }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

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

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/auth');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="header">
      <div className="page-title">
        <h1>{title}</h1>
        <div className="page-subtitle">
          {subtitle || `Bienvenue, ${userInfo.name || 'Utilisateur'} !`}
        </div>
      </div>

      <div className="header-actions">
        <div className="notification-bell">
          <FontAwesomeIcon icon={faBell} className="bell-icon" />
          <span className="notification-dot"></span>
        </div>

        <div className="user-profile" ref={dropdownRef}>
          <div className="profile-container" onClick={toggleDropdown}>
            <div className="avatar">
              {userInfo.name ? getInitials(userInfo.name) : <FontAwesomeIcon icon={faUser} />}
            </div>
            <div className="user-info">
              <div className="name">{userInfo.name || 'Utilisateur'}</div>
              <div className="role">{userInfo.role || 'Rôle inconnu'}</div>
            </div>
          </div>
          
          {isDropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <h3>{userInfo.name}</h3>
                <p className="email">{userInfo.email}</p>
                <span className="admin-badge">{userInfo.role}</span>
              </div>
                
              <div className="menu-item" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" />
                <span>Se déconnecter</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;