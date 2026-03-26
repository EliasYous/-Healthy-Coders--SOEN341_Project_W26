import React, {useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, isAuthenticated, logout, setUser } from '../utils/auth';
import './NavBar.css';

const Navbar = () => {

    const navigate = useNavigate(); //not sure why, but I get an error without this

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/'); //redirect to landing page after logout
    window.dispatchEvent(new Event('auth-change')); //notify nav bar to change
  }

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getUser());
    };

    window.addEventListener('auth-change', handleAuthChange); 
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  let authLinks;

  if (isAuthenticated()) { //if logged in, display profile and logout, else display login and register
    authLinks = (
      <>
        <Link to="/profile" className="navbar-link">
          Profile
        </Link>
        {/* Link to recipes page */}
        <Link to="/recipes" className="navbar-link">
          Recipes
        </Link>
        <Link to="/meal-planner" className="navbar-link">
          Meal Planner
        </Link>
          <span className="navbar-user">Hello, {getUser().firstName}!</span>
          <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
    </>
  );
} else {
  authLinks = (
    <>
      <Link to="/login" className="navbar-link">
        Login
      </Link>
      <Link to="/register" className="btn btn-primary">
        Sign Up
      </Link>
    </>
  );
}

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src="/vite.svg" className="navbar-logo" />
          MealMajor
        </Link>
        <div className="navbar-links">
          {authLinks}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;