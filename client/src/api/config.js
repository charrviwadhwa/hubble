// src/api/config.js
const API_URL = import.meta.env.PROD 
  ? 'https://hubble-d9l6.onrender.com/' // Your Render URL
  : 'http://localhost:3001';

export default API_URL;