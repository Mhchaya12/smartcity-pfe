import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faSignOutAlt, faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Header = ({ title, subtitle, toggleSidebar, isSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const unreadAlerts = 3; // exemple statique

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
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

  const getRoleLabel = (role) => {
    switch (role) {
      case 'administrator':
        return 'Administrateur';
      case 'analyst':
        return 'Analyste';
      case 'technicien':
        return 'Technicien';
      default:
        return role;
    }
  };

  return (
    <header className="bg-white h-16 border-b flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          className="text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="text-sm text-gray-500">
            {subtitle || `Bienvenue, ${userInfo.name || 'Utilisateur'} !`}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <FontAwesomeIcon icon={faBell} className="text-gray-600 h-5 w-5 cursor-pointer" />
          {unreadAlerts > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-medium rounded-full h-4 w-4 flex items-center justify-center">
              {unreadAlerts}
            </span>
          )}
        </div>

        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={toggleDropdown}
          >
            <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {userInfo.name ? getInitials(userInfo.name) : <FontAwesomeIcon icon={faUser} />}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium">{userInfo.name || 'Utilisateur'}</div>
              <div className="text-xs text-gray-500">{getRoleLabel(userInfo.role)}</div>
            </div>
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-md rounded-md z-50">
              <div className="p-4 border-b">
                <h3 className="text-sm font-semibold">{userInfo.name}</h3>
                <p className="text-xs text-gray-500">{userInfo.email}</p>
                <span className="mt-1 inline-block text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                  {getRoleLabel(userInfo.role)}
                </span>
              </div>
              <div className="p-3 hover:bg-gray-50 flex items-center cursor-pointer" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-gray-500" />
                <span className="text-sm text-gray-700">Se déconnecter</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
