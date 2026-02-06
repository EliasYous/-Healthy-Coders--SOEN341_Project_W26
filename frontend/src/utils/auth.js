// axios calls to the backend 
import axios from 'axios';




export const setUser = (user) => {
  localStorage.setItem('storedUser', JSON.stringify(user));
};

export const getUser = () => {
  return localStorage.getItem('storedUser') ? JSON.parse(localStorage.getItem('storedUser')) : null;
}

export const isAuthenticated = () => {
    return Boolean(getUser); //return true/false (if logged in/not logged in)
};

export const logout = () => {
    localStorage.removeItem('storedUser');
    window.dispatchEvent(new Event('nav-change')); // make changes to navbar
};
