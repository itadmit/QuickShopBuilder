// src/api/productService.js
import API_ENDPOINTS from './config';

/**
 * שירות API למוצרים וקטגוריות
 * המתממשק עם ה-API של QuickShop
 */
const productService = {
  /**
   * מקבל רשימת מוצרים עם אפשרויות סינון
   * @param {Object} filters - אפשרויות סינון ומיון
   * @returns {Promise<Object>} - מוצרים עם מידע לדפדוף
   */
  getProducts: async (filters = {}) => {
    try {
      // בניית מחרוזת השאילתה מהפילטרים
      const queryParams = new URLSearchParams();
      
      // הוספת הפרמטרים לשאילתה
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.category_id) queryParams.append('category_id', filters.category_id);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.on_sale) queryParams.append('on_sale', filters.on_sale);
      if (filters.in_stock) queryParams.append('in_stock', filters.in_stock);
      if (filters.min_price) queryParams.append('min_price', filters.min_price);
      if (filters.max_price) queryParams.append('max_price', filters.max_price);
      if (filters.product_type) queryParams.append('product_type', filters.product_type);
      if (filters.sort_by) queryParams.append('sort_by', filters.sort_by);
      if (filters.sort_dir) queryParams.append('sort_dir', filters.sort_dir);
      if (filters.show_hidden) queryParams.append('show_hidden', filters.show_hidden);
      
      // קבלת הטוקן מהלוקל סטורג' או מהתצורה הגלובלית
      const token = localStorage.getItem('auth_token') || window.SERVER_DATA?.token;
      
      // שליחת הבקשה לשרת
      const response = await fetch(`${API_ENDPOINTS.API_BASE_URL}/products.php?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
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
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  
  /**
   * מקבל מידע על מוצר בודד לפי מזהה
   * @param {number} productId - מזהה המוצר
   * @returns {Promise<Object>} - נתוני המוצר
   */
  getProductById: async (productId) => {
    try {
      // קבלת הטוקן מהלוקל סטורג' או מהתצורה הגלובלית
      const token = localStorage.getItem('auth_token') || window.SERVER_DATA?.token;
      
      // שליחת הבקשה לשרת
      const response = await fetch(`${API_ENDPOINTS.API_BASE_URL}/products.php?id=${productId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }
      
      return data.product;
    } catch (error) {
      console.error(`Error fetching product with ID ${productId}:`, error);
      throw error;
    }
  },
  
  /**
   * מקבל רשימת קטגוריות
   * @returns {Promise<Array>} - רשימת קטגוריות
   */
  getCategories: async () => {
    try {
      // קבלת הטוקן מהלוקל סטורג' או מהתצורה הגלובלית
      const token = localStorage.getItem('auth_token') || window.SERVER_DATA?.token;
      
      // שליחת הבקשה לשרת
      const response = await fetch(`${API_ENDPOINTS.API_BASE_URL}/categories.php`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.categories) {
        throw new Error('Invalid response format: missing categories');
      }
      
      return data.categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
  
  /**
   * מאחזר מוצרים מומלצים לפי קריטריונים שונים
   * @param {Object} options - אפשרויות לבחירת מוצרים מומלצים
   * @returns {Promise<Array>} - רשימת מוצרים מומלצים
   */
  getFeaturedProducts: async (options = {}) => {
    try {
      // ברירת מחדל - מוצרים במבצע
      const defaultOptions = {
        on_sale: true,
        limit: 8,
        sort_by: 'created',
        sort_dir: 'DESC'
      };
      
      // מיזוג האפשרויות שסופקו עם ברירות המחדל
      const mergedOptions = { ...defaultOptions, ...options };
      
      // שליחת הבקשה עם האפשרויות המשולבות
      const result = await productService.getProducts(mergedOptions);
      
      return result.products || [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },
  
  /**
   * מאחזר את המוצרים החדשים ביותר בחנות
   * @param {number} limit - מספר המוצרים לאחזור
   * @returns {Promise<Array>} - רשימת המוצרים החדשים
   */
  getNewArrivals: async (limit = 8) => {
    try {
      const options = {
        limit,
        sort_by: 'created',
        sort_dir: 'DESC'
      };
      
      const result = await productService.getProducts(options);
      
      return result.products || [];
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      throw error;
    }
  },
  
  /**
   * מאחזר מוצרים מקטגוריה ספציפית
   * @param {number} categoryId - מזהה הקטגוריה
   * @param {number} limit - מספר המוצרים לאחזור
   * @returns {Promise<Array>} - רשימת מוצרים מהקטגוריה
   */
  getProductsByCategory: async (categoryId, limit = 8) => {
    try {
      const options = {
        category_id: categoryId,
        limit,
        sort_by: 'created',
        sort_dir: 'DESC'
      };
      
      const result = await productService.getProducts(options);
      
      return result.products || [];
    } catch (error) {
      console.error(`Error fetching products from category ${categoryId}:`, error);
      throw error;
    }
  }
};

export default productService;