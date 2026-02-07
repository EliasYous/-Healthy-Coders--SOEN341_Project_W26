import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import './Home.css';


const Home = () => {

    let authLinks;
  
    if (!isAuthenticated()) { //if not logged in, display login and register, else display planner button
  authLinks = (
    <>
      <Link to="/login" className="btn btn-primary">
        Login
      </Link>
      <Link to="/register" className="btn btn-secondary">
        Get Started
      </Link>
    </>
  );
}
else {
  authLinks = ( // use profile link as placeholder
    <>
      <Link to="/profile" className="btn btn-primary"> 
        Go to Planner
      </Link>
    </>
  );
}

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
          {(
            <div className="hero-actions">
              {authLinks}
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
      </div>
      <div className="features">
        <h2>Recipe of the Week</h2>
        <div className="feature-card">
          <h3>Spaghetti</h3>
          <p>A simple and quick pasta dish made with garlic, olive oil, and chili flakes. include picture</p>
        </div>
      </div>
    </div>
  );
};

export default Home;