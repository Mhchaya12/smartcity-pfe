import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../actions/authActions';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  if (!isAuthenticated || !user) {
    return <div>Please log in to view your profile</div>;
  }
  
  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <div className="profile-info">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default UserProfile; 