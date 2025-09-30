import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  withCredentials: true,
});

/**
 * @returns {Promise<any[]>}
 */
export const getAllEvents = async () => {
  try {
    const response = await api.get('/events');
    return response.data.data.content;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to fetch events.');
  }
};

/**
 * @param {string} id
 * @returns {Promise<any>}
 */
export const getEventById = async (id) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching event with id ${id}:`, error);
    throw new Error(`Failed to fetch event with id ${id}.`);
  }
};

/**
 * @param {object} credentials
 * @returns {Promise<any>}
 */
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/users/login', credentials);
    return response.data.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * @param {object} userData
 * @returns {Promise<any>}
 */
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

/**
 * @returns {Promise<any>}
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

/**
 * @returns {Promise<any>}
 */
export const logoutUser = async () => {
  try {
    const response = await api.post('/auth/users/logout');
    return response.data;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};
