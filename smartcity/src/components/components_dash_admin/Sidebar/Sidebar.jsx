import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faBell,
  faUsers,
  faCog,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Restore sidebar state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    // Save state to localStorage
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  return (
    <>
      {/* Bouton toggle flottant visible en mode mobile ou collapsed */}
      <button 
        className={`floating-toggle-btn ${isCollapsed ? 'sidebar-collapsed' : ''}`} 
        onClick={toggleSidebar} 
        aria-label="Toggle sidebar"
      >
        <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
      </button>
    
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-brand">
          <div className="logo-icon" onClick={() => isCollapsed && toggleSidebar()} style={{ cursor: isCollapsed ? 'pointer' : 'default' }}>SC</div>
          <h2>Smart<span>City</span></h2>
          <button className="toggle-btn" onClick={toggleSidebar} aria-label="Toggle sidebar">
            <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
          </button>
        </div>

        <div className="sidebar-menu">
          <div className="menu-category">Navigation</div>
          <ul>
            <li>
              <NavLink to="/da" className={({ isActive }) => isActive ? "active" : ""}>
                <FontAwesomeIcon icon={faTachometerAlt} className="icon" />
                <span className="nav-text">Tableau de bord</span>
                {isCollapsed && <span className="tooltip">Tableau de bord</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/configuration" className={({ isActive }) => isActive ? "active" : ""}>
                <FontAwesomeIcon icon={faCog} className="icon" />
                <span className="nav-text">Configuration Seuil</span>
                {isCollapsed && <span className="tooltip">Configuration Seuil</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/alertsad" className={({ isActive }) => isActive ? "active" : ""}>
                <FontAwesomeIcon icon={faBell} className="icon" />
                <span className="nav-text">Alertes</span>
                {isCollapsed && <span className="tooltip">Alertes</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/users" className={({ isActive }) => isActive ? "active" : ""}>
                <FontAwesomeIcon icon={faUsers} className="icon" />
                <span className="nav-text">Users</span>
                {isCollapsed && <span className="tooltip">Users</span>}
              </NavLink>
            </li>
          </ul>
        </div> 

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">AD</div>
            <div className="user-details">
              <div className="user-name">Admin</div>
              <div className="user-email">admin@smartcity.fr</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;