import { api } from './api';

export const authService = {
  async register(username: string, email: string, password: string) {
    return api.post('/auth/register', { username, email, password });
  },

  async login(email: string, password: string) {
    const data = await api.post('/auth/login', { email, password });
    if (data.token) {
      localStorage.setItem('pitapita_token', data.token);
      localStorage.setItem('pitapita_user', JSON.stringify(data.user));
    }
    return data;
  },

  logout() {
    localStorage.removeItem('pitapita_token');
    localStorage.removeItem('pitapita_user');
  },

  getToken() {
    return localStorage.getItem('pitapita_token');
  },

  getUser() {
    const user = localStorage.getItem('pitapita_user');
    return user ? JSON.parse(user) : null;
  },
};
