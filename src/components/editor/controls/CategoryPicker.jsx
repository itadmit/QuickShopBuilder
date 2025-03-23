import React, { useState, useEffect } from 'react';
import { FiSearch, FiX, FiFilter, FiCheck, FiCheckSquare, FiSquare } from 'react-icons/fi';
import { createPortal } from 'react-dom';
// פונקציה לתיקון נתיבי תמונות
const getFixedImageUrl = (imageUrl) => {
  if (!imageUrl) return "/builder/build/images/placeholders/no-image.jpg";
  
  const storeSlug = window.SERVER_DATA?.storeSlug || '';
  
  // בדיקה אם מדובר בתמונת placeholder
  if (imageUrl.includes('/placeholders/')) {
    return "/builder/build/images/placeholders/category.jpg";
  }
  
  // אם זו כבר URL מלאה, החזר אותה כמו שהיא
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // אם זה נתיב יחסי מהפרויקט שלנו
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }
  
  // אחרת, זהו רק שם הקובץ - נוסיף את ה-base URL
  return `https://quickshopil-storage.s3.amazonaws.com/uploads/${storeSlug}/${imageUrl}`;
};
// בתחילה ננסה לייבא מהנתיב בתוך src
let productService;
try {
// נתיב יחסי מהקומפוננטה לתיקיית ה-API
productService = require('../../../api/productService').default;
} catch (e) {
// נתיב גיבוי במקרה ששינינו מיקום קבצים
try {
  productService = require('../../api/productService').default;
} catch (e2) {
  // יצירת שירות דמה במקרה שאין גישה ל-API
  productService = {
    getCategories: async () => Array(8).fill().map((_, i) => ({
      id: `dummy-category-${i+1}`,
      name: `קטגוריה לדוגמה ${i+1}`,
      products_count: Math.floor(Math.random() * 50) + 1
    }))
  };
  console.warn('Using mock product service for categories');
}
}

// סגנונות מודל לתיקון בעיית המיקום
const modalStyles = {
overlay: {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
},
modal: {
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  width: '90%',
  maxWidth: '800px',
  maxHeight: '85vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
  zIndex: 1001,
  direction: 'rtl'
}
};

const CategoryPicker = ({ isOpen, onClose, onSelect, selectedCategoryIds = [] }) => {
const [categories, setCategories] = useState([]);
const [loading, setLoading] = useState(true);
const [searchTerm, setSearchTerm] = useState('');
const [selectedCategories, setSelectedCategories] = useState([]);
const [error, setError] = useState(null);
const [showOnlyWithProducts, setShowOnlyWithProducts] = useState(false);
const [modalRoot, setModalRoot] = useState(null);

// יצירת אלמנט לפורטל רק פעם אחת
useEffect(() => {
  // בדיקה אם האלמנט כבר קיים
  let root = document.getElementById('category-picker-portal');
  if (!root) {
    root = document.createElement('div');
    root.id = 'category-picker-portal';
    document.body.appendChild(root);
  }
  setModalRoot(root);

  // ניקוי בעת unmount
  return () => {
    if (root && root.parentNode && root.childNodes.length === 0) {
      document.body.removeChild(root);
    }
  };
}, []);

// עדכון הקטגוריות הנבחרות כאשר המודל נפתח
useEffect(() => {
  if (isOpen) {
    // טעינת קטגוריות מהשרת
    loadCategories();
    
    // אם יש כבר קטגוריות נבחרות
    if (selectedCategoryIds && selectedCategoryIds.length > 0) {
      const initialSelected = selectedCategoryIds.map(id => ({ id }));
      setSelectedCategories(initialSelected);
    } else {
      setSelectedCategories([]);
    }

    // מניעת גלילה ברקע כשהמודל פתוח
    document.body.style.overflow = 'hidden';
  } else {
    // החזרת הגלילה כשהמודל נסגר
    document.body.style.overflow = '';
  }

  return () => {
    document.body.style.overflow = '';
  };
}, [isOpen, selectedCategoryIds]);

// טעינת קטגוריות מהשרת
const loadCategories = async () => {
  try {
    setLoading(true);
    setError(null);
    
    try {
      const categoriesData = await productService.getCategories();
      setCategories(categoriesData);
    } catch (apiError) {
      console.error('API error:', apiError);
      
      // במקרה של שגיאה, נציג רשימת קטגוריות לדוגמה
      const dummyCategories = Array(8).fill().map((_, i) => ({
        id: `dummy-category-${i+1}`,
        name: `קטגוריה לדוגמה ${i+1}`,
        products_count: Math.floor(Math.random() * 50) + 1
      }));
      setCategories(dummyCategories);
    }
  } catch (error) {
    console.error('Error loading categories:', error);
    setError('שגיאה בטעינת קטגוריות. נא לנסות שוב מאוחר יותר.');
    
    // במקרה של שגיאה, נציג רשימת קטגוריות ריקה
    setCategories([]);
  } finally {
    setLoading(false);
  }
};

// פונקציה לסינון קטגוריות לפי חיפוש
const filteredCategories = categories.filter(category => {
  const matchesSearch = category.name?.toLowerCase().includes(searchTerm.toLowerCase());
  const hasProducts = !showOnlyWithProducts || (category.products_count && category.products_count > 0);
  return matchesSearch && hasProducts;
});

// פונקציה להחלפת מצב בחירה של קטגוריה
const toggleCategorySelection = (category) => {
  const isSelected = selectedCategories.some(c => c.id === category.id);
  
  if (isSelected) {
    setSelectedCategories(selectedCategories.filter(c => c.id !== category.id));
  } else {
    setSelectedCategories([...selectedCategories, category]);
  }
};

// פונקציה להגשת הבחירה
const confirmSelection = () => {
  onSelect(selectedCategories);
  onClose();
};

// ניקוי החיפוש
const clearSearch = () => {
  setSearchTerm('');
};

// טיפול בסגירת המודל כשלוחצים מחוץ לתוכן
const handleOverlayClick = (e) => {
  if (e.target === e.currentTarget) {
    onClose();
  }
};

// אם המודל סגור או שאין root element, לא מציגים כלום
if (!isOpen || !modalRoot) return null;

// יצירת פורטל עבור המודל
const modalContent = (
  <div style={modalStyles.overlay} onClick={handleOverlayClick}>
    <div style={modalStyles.modal} className="category-selector-modal">
      <div className="modal-header">
        <h2>בחירת קטגוריות</h2>
        <button className="close-button" onClick={onClose}>
          <FiX />
        </button>
      </div>
      
      <div className="modal-search">
        <div className="search-input-container">
          <input
            type="text"
            className="search-input"
            placeholder="חיפוש קטגוריות..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button type="button" className="clear-search" onClick={clearSearch}>
              <FiX />
            </button>
          )}
          <button type="button" className="search-button">
            <FiSearch />
          </button>
        </div>
        
        <div className="filter-options">
          <div className="filter-checkbox">
            <label>
              <input
                type="checkbox"
                checked={showOnlyWithProducts}
                onChange={() => setShowOnlyWithProducts(!showOnlyWithProducts)}
              />
              <span>הצג רק קטגוריות עם מוצרים</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="modal-content">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>
              <FiX />
            </button>
          </div>
        )}
        
        {loading ? (
          <div className="loading-indicator">טוען קטגוריות...</div>
        ) : (
          <>
            <div className="categories-count">
              <div className="selected-count">
                {selectedCategories.length} קטגוריות נבחרו
              </div>
              <div className="total-count">
                מציג {filteredCategories.length} מתוך {categories.length} קטגוריות
              </div>
            </div>
            
            {filteredCategories.length === 0 ? (
              <div className="no-results">
                לא נמצאו קטגוריות התואמות לחיפוש שלך
              </div>
            ) : (
              <div className="categories-grid">
                {filteredCategories.map(category => {
                  const isSelected = selectedCategories.some(c => c.id === category.id);
                  
                  return (
                    <div 
                      key={category.id}
                      className={`category-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleCategorySelection(category)}
                    >
                      <div className="selection-indicator">
                        {isSelected ? (
                          <FiCheckSquare className="selected-icon" />
                        ) : (
                          <FiSquare className="unselected-icon" />
                        )}
                      </div>
                      
                      <div className="category-info">
                        <h3 className="category-name">{category.name}</h3>
                        <div className="products-count">
                          {category.products_count || 0} מוצרים
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="modal-footer">
        <button 
          className="cancel-button"
          onClick={onClose}
        >
          ביטול
        </button>
        <button 
          className="confirm-button"
          onClick={confirmSelection}
          disabled={selectedCategories.length === 0}
        >
          אישור ({selectedCategories.length})
        </button>
      </div>
    </div>
  </div>
);

return createPortal(modalContent, modalRoot);
};

export default CategoryPicker;