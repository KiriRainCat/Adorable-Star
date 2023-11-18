import axios from 'axios';
import { Notify } from 'quasar';

// Create global axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    Authorization: 'dvgZgggolxESd0m',
  },
});

// Add token to request headers
api.interceptors.request.use((req) => {
  req.headers['Token'] = localStorage.getItem('token');
  return req;
});

// Handle common response error and store incoming new token
api.interceptors.response.use(
  (res) => {
    const token = res.headers['New-Token'];
    if (token) {
      localStorage.setItem('token', token);
    }
    return res;
  },
  (e) => {
    switch (e.response.data.code) {
      case 401:
        localStorage.setItem('token', '');
        break;
      case 400:
      case 500:
        Notify.create({
          type: 'negative',
          message: e.response.data.msg,
        });
        break;
    }
    return Promise.reject(e);
  },
);

export { api };
