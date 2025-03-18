import React, { useState, useEffect } from 'react';

const ProductSelector = ({ isOpen, onClose, onSelect, selectedProductIds = [] }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);

  // טעינת מוצרים (במקרה זה, דמה)
  useEffect(() => {
    if (isOpen) {
      // מדמה טעינה מ-API
      setTimeout(() => {
        const demoProducts = Array(20).fill().map((_, index) => ({
          id: `product-${index + 1}`,
          title: `מוצר לדוגמה ${index + 1}`,
          price: Math.floor(Math.random() * 500) + 50,
          image: `/placeholders/product${(index % 6) + 1}.jpg`
        }));
        setProducts(demoProducts);
        
        // הגדרת מוצרים שכבר נבחרו
        if (selectedProductIds.length > 0) {
          const preSelected = demoProducts.filter(p => selectedProductIds.includes(p.id));
          setSelectedProducts(preSelected);
        }
        
        setLoading(false);
      }, 1000);
    }
  }, [isOpen, selectedProductIds]);

  // סינון מוצרים לפי חיפוש
  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // הוספה/הסרה של מוצר מהבחירה
  const toggleProductSelection = (product) => {
    const isSelected = selectedProducts.some(p => p.id === product.id);
    
    if (isSelected) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  // אישור הבחירה
  const confirmSelection = () => {
    onSelect(selectedProducts);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="product-selector-modal">
        <div className="modal-header">
          <h2>בחירת מוצרים</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-search">
          <input
            type="text"
            placeholder="חיפוש מוצרים..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="modal-content">
          {loading ? (
            <div className="loading-indicator">טוען מוצרים...</div>
          ) : (
            <>
              <div className="selected-count">
                {selectedProducts.length} מוצרים נבחרו
              </div>
              
              <div className="products-grid selector-grid">
                {filteredProducts.map(product => (
                  <div 
                    key={product.id}
                    className={`product-item ${selectedProducts.some(p => p.id === product.id) ? 'selected' : ''}`}
                    onClick={() => toggleProductSelection(product)}
                  >
                    <div className="product-image">
                      <img src={product.image} alt={product.title} />
                      <div className="selection-indicator">✓</div>
                    </div>
                    <div className="product-info">
                      <h3>{product.title}</h3>
                      <p className="price">₪{product.price}</p>
                    </div>
                  </div>
                ))}
                
                {filteredProducts.length === 0 && (
                  <div className="no-results">לא נמצאו מוצרים התואמים לחיפוש</div>
                )}
              </div>
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
            disabled={selectedProducts.length === 0}
          >
            אישור ({selectedProducts.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSelector;