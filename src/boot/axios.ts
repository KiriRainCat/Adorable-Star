import axios from 'axios';
import { Notify } from 'quasar';
import { useAppStore } from 'src/stores/app';
import { i18n } from './i18n';
import { router } from 'src/router';

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
    if (e.message.includes('404') || e.message.includes('502')) {
      Notify.create({
        type: 'negative',
        message: i18n.global.t('serverOffline'),
      });
    }

    switch (e.response.data.code) {
      case 401:
        localStorage.setItem('token', '');
        router.replace('/auth/login');
        break;
      case 400:
      case 429:
      case 500:
        Notify.create({
          type: 'negative',
          message: i18n.global.t(e.response.data.msg),
        });
        break;
    }
    return Promise.reject(e);
  }
);

export { api };
