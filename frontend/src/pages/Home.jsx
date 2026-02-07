import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import './Home.css';

const Home = () => {

  return (
    <div className="home">
      <div className="hero">
        <div className="container">
          <h1>Welcome to MealMajor</h1>
          <p className="subtitle">
            Plan your meals, track groceries, and discover easy recipes tailored for students
          </p>
          {!isAuthenticated() && (
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default Home;
