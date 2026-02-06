import axios from 'axios';

// Reads the user object from local storage (string to object)
export const getUser = () => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

// Sets the user object in local storage (object to string)
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
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
    window.dispatchEvent(new Event('auth-change'));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Registration failed',
    };
  }
};
