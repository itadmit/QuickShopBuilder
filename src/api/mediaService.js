// src/api/mediaService.js
// קובץ שירות להתממשקות מול S3 דרך ה-backend שלך

/**
 * שירות לניהול מדיה ואינטגרציה מול S3
 * 
 * נציג API פשוט להעלאת ומחיקת תמונות, ולשליפת רשימת התמונות מ-S3
 * כל הפעולות עוברות דרך ה-backend שלך (לא ישירות מול AWS מהצד הקליינט)
 */

import API_ENDPOINTS from './config';

const mediaService = {
  /**
   * מביא את רשימת התמונות מ-S3
   * @param {string} storeId - מזהה החנות
   * @param {object} options - אפשרויות נוספות כגון מיון וסינון
   * @returns {Promise<Array>} - מערך של אובייקטי תמונה
   */
  getImages: async (storeId, options = {}) => {
    try {
      const queryParams = new URLSearchParams({
        store_id: storeId,
        ...options
      }).toString();
      
      const response = await fetch(`${API_ENDPOINTS.MEDIA_LIST}?${queryParams}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }
      
      return data.images || [];
    } catch (error) {
      console.error('Error loading images:', error);
      throw error;
    }
  },
  
  /**
   * מעלה תמונה ל-S3 דרך ה-backend
   * @param {string} storeId - מזהה החנות
   * @param {File} file - אובייקט קובץ התמונה
   * @param {Function} onProgress - פונקציית callback לעדכון התקדמות ההעלאה
   * @returns {Promise<object>} - מידע על התמונה שהועלתה כולל URL
   */
  uploadImage: async (storeId, file, onProgress = null) => {
    try {
      const formData = new FormData();
      formData.append('store_id', storeId);
      formData.append('image', file);
      
      // אם לא נתמך XMLHttpRequest עם progress events, נשתמש ב-fetch רגיל
      if (!onProgress || typeof XMLHttpRequest === 'undefined') {
        const response = await fetch(API_ENDPOINTS.MEDIA_UPLOAD, {
          method: 'POST',
          credentials: 'include',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Unknown error');
        }
        
        return data.image;
      }
      
      // שימוש ב-XMLHttpRequest כדי לעקוב אחר התקדמות ההעלאה
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && onProgress) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            onProgress(percentComplete);
          }
        });
        
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              if (data.success) {
                resolve(data.image);
              } else {
                reject(new Error(data.error || 'Upload failed'));
              }
            } catch (error) {
              reject(new Error('Invalid response format'));
            }
          } else {
            reject(new Error(`HTTP error! status: ${xhr.status}`));
          }
        });
        
        xhr.addEventListener('error', () => {
          reject(new Error('Network error occurred'));
        });
        
        xhr.addEventListener('abort', () => {
          reject(new Error('Upload aborted'));
        });
        
        xhr.open('POST', API_ENDPOINTS.MEDIA_UPLOAD, true);
        xhr.withCredentials = true;
        xhr.send(formData);
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },
  
  /**
   * מוחק תמונה מ-S3 דרך ה-backend
   * @param {string} storeId - מזהה החנות
   * @param {string} imageUrl - ה-URL של התמונה למחיקה
   * @returns {Promise<object>} - תוצאת המחיקה
   */
  deleteImage: async (storeId, imageUrl) => {
    try {
      const response = await fetch(API_ENDPOINTS.MEDIA_DELETE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          store_id: storeId,
          image_url: imageUrl
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }
      
      return data;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }
};

export default mediaService;