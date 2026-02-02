import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUser, isAuthenticated, logout } from '../utils/auth';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(getUser());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setUser(getUser());
    
    const handleAuthChange = () => {
      setUser(getUser());
    };
    

    //need to update the Navbar when something gets changed
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, [location]);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          MealMajor
        </Link>
        <div className="navbar-links">
          {isAuthenticated() ? (
            <>
              <Link to="/profile" className="navbar-link">
                Profile
              </Link>
              <span className="navbar-user">Hello, {user?.firstName}!</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;