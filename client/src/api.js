import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3001/api' });

// This automatically attaches your JWT token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const fetchEvents = (query) => API.get(`/events?q=${query || ''}`);
export const login = (formData) => API.post('/auth/login', formData);
export const registerForEvent = (id) => API.post(`/events/${id}/register`);