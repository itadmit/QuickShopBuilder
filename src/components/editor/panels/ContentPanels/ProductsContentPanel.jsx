// src/components/editor/panels/ContentPanels/ProductsContentPanel.jsx
import React, { useState } from 'react';
import RangeSlider from '../../controls/RangeSlider';
import SwitchControl from '../../controls/SwitchControl';

const ProductsContentPanel = ({ data, onChange }) => {
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [loadingProductDetails, setLoadingProductDetails] = useState(false);

  // פונקציה להחלפת מאפיין
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  // פונקציה לבחירת מוצרים
  const handleProductsSelected = (selectedProducts) => {
    handleChange('products', selectedProducts);
    setIsProductPickerOpen(false);
  };

  // פונקציה להסרת מוצר
  const removeProduct = (productId) => {
    if (data.products && Array.isArray(data.products)) {
      const updatedProducts = data.products.filter(product => product.id !== productId);
      handleChange('products', updatedProducts);
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
        <label className="property-label">מספר מוצרים להצגה</label>
        <RangeSlider
          min={2}
          max={12}
          value={data.count || 4}
          onChange={(value) => handleChange('count', value)}
        />
      </div>
      <div className="property-group">
        <label className="property-label">הצג מחירים</label>
        <SwitchControl
          checked={data.showPrices !== false}
          onChange={(checked) => handleChange('showPrices', checked)}
        />
      </div>
      <div className="property-group">
        <label className="property-label">הצג כפתור הוספה לסל</label>
        <SwitchControl
          checked={data.showAddToCart || false}
          onChange={(checked) => handleChange('showAddToCart', checked)}
        />
      </div>
      <div className="property-group">
        <label className="property-label">בחירת מוצרים</label>
        <button 
          className="button-secondary product-select-button"
          onClick={() => setIsProductPickerOpen(true)}
        >
          בחר מוצרים
        </button>
        
        {loadingProductDetails ? (
          <div className="loading-message">טוען פרטי מוצרים...</div>
        ) : data.products && data.products.length > 0 ? (
          <div className="selected-items">
            {data.products.map(product => (
              <div key={product.id} className="selected-item">
                <div className="selected-item-image">
                  {product.image_url && (
                    <img 
                      src={product.image_url} 
                      alt={product.name || 'מוצר'} 
                      onError={(e) => {
                        e.target.src = "/images/placeholders/product-placeholder.jpg";
                      }}
                    />
                  )}
                </div>
                <div className="selected-item-info">
                  <span className="selected-item-name">{product.name || 'מוצר'}</span>
                  <span className="selected-item-price">
                    {product.price_formatted || product.price || '₪0.00'}
                  </span>
                </div>
                <button 
                  className="remove-button"
                  onClick={() => removeProduct(product.id)}
                >
                  הסר
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-selection">לא נבחרו מוצרים (יוצגו המוצרים העדכניים ביותר)</p>
        )}
      </div>
      
      {/* כאן יש להוסיף את רכיב ProductPicker במידה וקיים במערכת */}
      {/*
      <ProductPicker
        isOpen={isProductPickerOpen}
        onClose={() => setIsProductPickerOpen(false)}
        onSelect={handleProductsSelected}
        selectedProductIds={data.products?.map(p => p.id) || []}
      />
      */}
    </>
  );
};

export default ProductsContentPanel;