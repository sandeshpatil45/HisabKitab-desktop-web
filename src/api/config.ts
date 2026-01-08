// API Configuration

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const config = {
  apiBaseUrl: API_BASE_URL,
  timeout: 30000,
};

export default config;
