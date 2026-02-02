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
            by HealthyCoders
          </p>
          <p className="subtitle">
            Plan your meals, track groceries, and discover easy recipes tailored for students
          </p>
          {!isAuthenticated() && (
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="features">
        <div className="container">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Meal Planning</h3>
              <p>Plan your meals for the week and stay organized</p>
            </div>
            <div className="feature-card">
              <h3>Grocery Tracking</h3>
              <p>Keep track of your groceries and never run out</p>
            </div>
            <div className="feature-card">
              <h3>Easy Recipes</h3>
              <p>Discover simple and delicious recipes perfect for busy students</p>
            </div>
          </div>
        </div>
        <div className='Recipe of the week'>
            
        </div>
      </div>
    </div>
  );
};

export default Home;