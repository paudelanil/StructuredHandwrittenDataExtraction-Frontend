import axios from "axios";

// First check runtime environment variable (from env-config.js)
// Fall back to build-time environment variable if runtime not available
const baseURL = window.env?.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: baseURL,
});

export default api;