// src/api/config.js
const API_BASE_URL = process.env.REACT_APP_API_URL || '/builder/api';

export const API_ENDPOINTS = {
  LOAD: `${API_BASE_URL}/load.php`,
  SAVE: `${API_BASE_URL}/save.php`,
  PUBLISH: `${API_BASE_URL}/publish.php`,
  UPLOAD: `${API_BASE_URL}/upload.php`,
  DELETE: `${API_BASE_URL}/delete.php`
};

export default API_ENDPOINTS;