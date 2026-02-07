import axios from 'axios';

// Configure axios to automatically include user-id header
axios.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user && user.id) {
        config.headers['user-id'] = user.id;
      }
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
    }
  }
  return config;
});

export const getUser = () => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

export const isAuthenticated = () => {
  return !!getUser();
};

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem('user');
};

export const login = async (email, password) => {
  try {
    const response = await axios.post('/api/auth/login', { email, password });
    const userData = response.data.user;
    setUser(userData);
    window.dispatchEvent(new Event('auth-change'));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Login failed',
    };
  }
};

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
    window.dispatchEvent(new Event('auth-change'));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Registration failed',
    };
  }
};

export const logout = () => {
  removeUser();
  window.dispatchEvent(new Event('auth-change'));
};