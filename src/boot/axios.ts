import axios from 'axios';

// Create global axios instance
const api = axios.create({
  baseURL: '/api',
});

export { api };
