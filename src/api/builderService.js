// src/api/builderService.js
import API_ENDPOINTS from './config';

const builderService = {
  // טעינת הנתונים מהשרת
  loadData: async (storeId) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.LOAD}?store_id=${storeId}`, {
        method: 'GET',
        credentials: 'include' // חשוב כדי לשלוח עוגיות עם הבקשה
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }
      
      return data.structure || [];
    } catch (error) {
      console.error('Error loading data:', error);
      throw error;
    }
  },
  
  // שמירת התוכן ללא פרסום
  saveData: async (storeId, structure) => {
    try {
      const response = await fetch(API_ENDPOINTS.SAVE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          store_id: storeId,
          structure: structure,
          render: false // לא לרנדר
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
      console.error('Error saving data:', error);
      throw error;
    }
  },
  
  // פרסום התוכן
  publishData: async (storeId, structure) => {
    try {
      // קודם שומרים את התוכן
   // קודם שומרים את התוכן
   await builderService.saveData(storeId, structure);  // שימוש ישיר באובייקט builderService
      
      // אחר כך מפרסמים אותו
      const response = await fetch(API_ENDPOINTS.PUBLISH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          store_id: storeId,
          render: true
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
      console.error('Error publishing data:', error);
      throw error;
    }
  },
  
  // העלאת תמונה לשרת
  uploadImage: async (storeId, file) => {
    try {
      const formData = new FormData();
      formData.append('store_id', storeId);
      formData.append('image', file);
      
      const response = await fetch(API_ENDPOINTS.UPLOAD, {
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
      
      return data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },
  
  // מחיקת תמונה מהשרת
  deleteImage: async (storeId, imageUrl) => {
    try {
      const response = await fetch(API_ENDPOINTS.DELETE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          store_id: storeId,
          imageUrl: imageUrl
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

export default builderService;