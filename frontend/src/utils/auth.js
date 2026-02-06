import axios from 'axios';

// Configure axios to automatically include user-id header
axios.interceptors.request.use((config) => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      config.headers['user-id'] = user.id;
    }
    return config;
  });
  

// Reads the user object from local storage (string to object)
export const getUser = () => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

// Sets the user object in local storage (object to string)
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Checks if the user is authenticated
export const isAuthenticated = () => {
  return (getUser() !== null) ? true : false;
};

// Removes the user object from local storage
export const removeUser = () => {
  localStorage.removeItem('user');
};

// Registers a new user by sending a POST request to the backend
export const register = async (email, password, firstName, lastName) => {
  try {
    const response = await axios.post('/api/auth/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const userData = response.data.user;
    setUser(userData);
    window.dispatchEvent(new Event('auth-change')); // to refresh the page upon successful registration
    return { success: true };
  } catch (error) {
    // if the registration fails, return an error message
    return {
      success: false,
      error: error.response?.data?.error || 'Registration failed',
    };
  }
};

// Logs in the user by sending a POST request to the backend
export const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const userData = response.data.user;
      setUser(userData);
      window.dispatchEvent(new Event('auth-change')); // to refresh the page upon successful login
      return { success: true };
    } catch (error) {
      // if the login fails, return an error message
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  }; 

  // Logs out the user by removing the user object from local storage
  export const logout = () => {
    removeUser();
    window.dispatchEvent(new Event('auth-change')); // to refresh the page upon successful logout
  };