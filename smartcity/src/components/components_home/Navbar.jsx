import React, {useState } from "react";
import {Link} from "react-router-dom";
import './Navbar';
import './Navbar.css';

const Navbar  = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <img src="images/smart-city_7438283 (2).png" alt="Logo" className="logo" />
            <span>Smart City</span>
          </Link>
  
          <div className={`menu-icon ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
  
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Accueil
              </Link>
            </li>
          </ul>
  
          <div className="nav-auth">
            <Link to="/auth" className="btn btn-outline">
              Connexion
            </Link>
            <Link to="/auth?signup=true" className="btn btn-primary">
              Inscription
            </Link>
          </div>
        </div>
      </nav>
    );
  };

export default Navbar