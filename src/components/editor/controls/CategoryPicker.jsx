// src/components/editor/controls/CategoryPicker.jsx
import React, { useState, useEffect } from 'react';
import { FiSearch, FiX, FiFilter, FiCheck, FiCheckSquare, FiSquare } from 'react-icons/fi';
import { createPortal } from 'react-dom';
import productService from '../../../api/productService';

const CategoryPicker = ({ isOpen, onClose, onSelect, selectedCategoryIds = [] }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState(null);
  const [showOnlyWithProducts, setShowOnlyWithProducts] = useState(false);

  // עדכון הקטגוריות הנבחרות כאשר המודל נפתח
  useEffect(() => {
    if (isOpen) {
      // טעינת קטגוריות מהשרת
      loadCategories();
      
      // אם יש כבר קטגוריות נבחרות
      if (selectedCategoryIds && selectedCategoryIds.length > 0) {
        const initialSelected = selectedCategoryIds.map(id => ({ id }));
        setSelectedCategories(initialSelected);
      }
    }
  }, [isOpen, selectedCategoryIds]);

  // טעינת קטגוריות מהשרת
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const categoriesData = await productService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('שגיאה בטעינת קטגוריות');
    } finally {
      setLoading(false);
    }
  };

  // פונקציה לסינון קטגוריות לפי חיפוש
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const hasProducts = !showOnlyWithProducts || category.products_count > 0;
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

  // אם המודל סגור, לא מציגים כלום
  if (!isOpen) return null;

  // יצירת פורטל עבור המודל
  return createPortal(
    <div className="modal-overlay">
      <div className="category-selector-modal">
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
                            {category.products_count} מוצרים
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
    </div>,
    document.body
  );
};

export default CategoryPicker;