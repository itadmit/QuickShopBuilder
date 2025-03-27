// src/components/editor/panels/ContentPanels/CollectionsContentPanel.jsx
import React, { useState } from 'react';
import RangeSlider from '../../controls/RangeSlider';

const CollectionsContentPanel = ({ data, onChange }) => {
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);
  const [loadingCategoryDetails, setLoadingCategoryDetails] = useState(false);

  // פונקציה להחלפת מאפיין
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  // פונקציה לבחירת קטגוריות
  const handleCategoriesSelected = (selectedCategories) => {
    handleChange('collections', selectedCategories);
    setIsCategoryPickerOpen(false);
  };

  // פונקציה להסרת קטגוריה
  const removeCategory = (categoryId) => {
    if (data.collections && Array.isArray(data.collections)) {
      const updatedCollections = data.collections.filter(cat => cat.id !== categoryId);
      handleChange('collections', updatedCollections);
    }
  };

  return (
    <>
      <div className="property-group">
        <label className="property-label">כותרת</label>
        <input
          type="text"
          className="text-input"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="הזן כותרת"
        />
      </div>
      <div className="property-group">
        <label className="property-label">מספר קטגוריות להצגה</label>
        <RangeSlider
          min={2}
          max={6}
          value={data.count || 3}
          onChange={(value) => handleChange('count', value)}
        />
      </div>
      <div className="property-group">
        <label className="property-label">בחירת קטגוריות</label>
        <button 
          className="button-secondary category-select-button"
          onClick={() => setIsCategoryPickerOpen(true)}
        >
          בחר קטגוריות
        </button>
        
        {loadingCategoryDetails ? (
          <div className="loading-message">טוען פרטי קטגוריות...</div>
        ) : data.collections && data.collections.length > 0 ? (
          <div className="selected-items">
            {data.collections.map(collection => (
              <div key={collection.id} className="selected-item">
                <div className="selected-item-info">
                  <span className="selected-item-name">{collection.name || 'קטגוריה'}</span>
                  {collection.products_count !== undefined && (
                    <span className="products-count">
                      {collection.products_count} מוצרים
                    </span>
                  )}
                </div>
                <button 
                  className="remove-button"
                  onClick={() => removeCategory(collection.id)}
                >
                  הסר
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-selection">לא נבחרו קטגוריות (יוצגו הקטגוריות העדכניות ביותר)</p>
        )}
      </div>
      
      {/* כאן יש להוסיף את רכיב CategoryPicker במידה וקיים במערכת */}
      {/*
      <CategoryPicker
        isOpen={isCategoryPickerOpen}
        onClose={() => setIsCategoryPickerOpen(false)}
        onSelect={handleCategoriesSelected}
        selectedCategoryIds={data.collections?.map(c => c.id) || []}
      />
      */}
    </>
  );
};

export default CollectionsContentPanel;