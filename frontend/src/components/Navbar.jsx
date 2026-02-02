import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          MealMajor
        </Link>
        <div className="navbar-links">
          <Link to="/login" className="navbar-link">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;