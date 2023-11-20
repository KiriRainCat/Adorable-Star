import axios from 'axios';
import { Notify } from 'quasar';
import { useAppStore } from 'src/stores/app';

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
    // Refresh token if server sent one
    const token = res.headers['new-token'];
    if (token) {
      localStorage.setItem('token', token);
    }

    // Update header info if server sent one
    if (res.data.data && res.data.data.gpa) {
      const gpa = res.data.data.gpa;
      const fetchedAt = res.data.data.fetched_at;
      const store = useAppStore();

      store.fetchedAt = Date.parse(fetchedAt).toString();
      store.gpa = gpa;
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
