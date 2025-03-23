// src/api/config.js
// קונפיגורציית נקודות קצה ל-API

const API_BASE_URL = window.SERVER_DATA?.apiBasePath || 'https://quick-shop.co.il/builder/api';

// נקודות קצה עבור העורך
export const API_ENDPOINTS = {
  // נקודות קצה קיימות 
  LOAD: `${API_BASE_URL}/load.php`,
  SAVE: `${API_BASE_URL}/save.php`,
  PUBLISH: `${API_BASE_URL}/publish-s3.php`,
  
  // נקודות קצה חדשות לניהול מדיה
  MEDIA_LIST: `${API_BASE_URL}/media/list.php`,
  MEDIA_UPLOAD: `${API_BASE_URL}/media/upload.php`,
  MEDIA_DELETE: `${API_BASE_URL}/media/delete.php`
};

export default API_ENDPOINTS;