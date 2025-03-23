import React, { useState, useEffect } from 'react';
import { FiSearch, FiX, FiFilter, FiCheckSquare, FiSquare } from 'react-icons/fi';
import { createPortal } from 'react-dom';

// פונקציה לפענוח וריאציות מהפורמט JSON
const parseVariationOptions = (jsonString) => {
  if (!jsonString) return {};
  
  try {
    // אם כבר אובייקט, החזר אותו
    if (typeof jsonString === 'object') return jsonString;
    
    // רגע לפני פענוח, נתקן את התווים המיוחדים (u05d0, u05d1...)
    let fixedString = jsonString;
    if (typeof jsonString === 'string') {
      // לדוגמה: {"\u05e6\u05d1\u05e2":"\u05d0\u05d3\u05d5\u05dd"}
      // נחליף כל התוכן בינתיים במחרוזת ריקה
      try {
        const decodedString = JSON.parse(jsonString);
        return decodedString;
      } catch (innerError) {
        console.warn('Failed to parse variation JSON directly', innerError);
        // ננסה לתקן את המחרוזת לפורמט JSON תקין
        fixedString = fixedString.replace(/\\u/g, '\\u');
      }
    }
    
    // נסה לפענח כ-JSON
    return typeof fixedString === 'string' ? JSON.parse(fixedString) : fixedString;
  } catch (e) {
    console.error('Error parsing variation options:', e);
    return {};
  }
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
    getProducts: async () => ({
      products: Array(20).fill().map((_, index) => ({
        id: `product-${index + 1}`,
        name: `מוצר לדוגמה ${index + 1}`,
        regular_price: Math.floor(Math.random() * 500) + 50,
        sale_price: index % 3 === 0 ? Math.floor(Math.random() * 300) + 30 : null,
        is_on_sale: index % 3 === 0,
        regular_price_formatted: `₪${Math.floor(Math.random() * 500) + 50}`,
        sale_price_formatted: index % 3 === 0 ? `₪${Math.floor(Math.random() * 300) + 30}` : null,
        image_url: `/builder/build/images/placeholders/product${(index % 6) + 1}.jpg`,
        product_type: index % 4 === 0 ? 'variable' : 'simple',
        variant_count: index % 4 === 0 ? Math.floor(Math.random() * 5) + 2 : 0
      })),
      pagination: { page: 1, limit: 20, totalPages: 1, total: 20 }
    }),
    getCategories: async () => Array(5).fill().map((_, i) => ({
      id: `dummy-category-${i+1}`,
      name: `קטגוריה לדוגמה ${i+1}`,
      products_count: Math.floor(Math.random() * 50) + 1
    }))
  };
  console.warn('Using mock product service');
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
  maxWidth: '900px',
  maxHeight: '85vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
  zIndex: 1001,
  direction: 'rtl'
}
};

const ProductPicker = ({ isOpen, onClose, onSelect, selectedProductIds = [] }) => {
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [searchTerm, setSearchTerm] = useState('');
const [selectedProducts, setSelectedProducts] = useState([]);
const [categories, setCategories] = useState([]);
const [selectedCategory, setSelectedCategory] = useState('');
const [totalProducts, setTotalProducts] = useState(0);
const [pagination, setPagination] = useState({ page: 1, limit: 20, totalPages: 1 });
const [filters, setFilters] = useState({
  on_sale: false,
  in_stock: true,
  show_hidden: false
});
const [showFilters, setShowFilters] = useState(false);
const [error, setError] = useState(null);
const [modalRoot, setModalRoot] = useState(null);

// יצירת אלמנט לפורטל רק פעם אחת
useEffect(() => {
  // בדיקה אם האלמנט כבר קיים
  let root = document.getElementById('product-picker-portal');
  if (!root) {
    root = document.createElement('div');
    root.id = 'product-picker-portal';
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

// לוודא שיש לנו את ה-selectedProducts כאשר isOpen משתנה
useEffect(() => {
  if (isOpen) {
    // טעינת קטגוריות
    loadCategories();
    
    // התחלה עם המוצרים שכבר נבחרו
    if (selectedProductIds && selectedProductIds.length > 0) {
      const initialSelected = selectedProductIds.map(id => ({ id }));
      setSelectedProducts(initialSelected);
    } else {
      setSelectedProducts([]);
    }
    
    // טעינת המוצרים
    loadProducts();

    // מניעת גלילה ברקע כשהמודל פתוח
    document.body.style.overflow = 'hidden';
  } else {
    // החזרת הגלילה כשהמודל נסגר
    document.body.style.overflow = '';
  }

  return () => {
    document.body.style.overflow = '';
  };
}, [isOpen, selectedProductIds]);

// טעינת קטגוריות
const loadCategories = async () => {
  try {
    setError(null);
    const categoriesData = await productService.getCategories();
    setCategories(categoriesData);
  } catch (error) {
    console.error('Error loading categories:', error);
    setError('שגיאה בטעינת קטגוריות. אנא נסה שוב מאוחר יותר.');
    
    // במקרה של שגיאה, נציג רשימת קטגוריות לדוגמה
    const dummyCategories = Array(5).fill().map((_, i) => ({
      id: `dummy-category-${i+1}`,
      name: `קטגוריה לדוגמה ${i+1}`,
      products_count: Math.floor(Math.random() * 50) + 1
    }));
    setCategories(dummyCategories);
  }
};

// טעינת מוצרים מה-API
const loadProducts = async (page = 1) => {
  try {
    setLoading(true);
    setError(null);
    
    // בניית אובייקט הפילטרים לבקשה
    const apiFilters = {
      page,
      limit: pagination.limit,
      search: searchTerm || undefined,
      category_id: selectedCategory || undefined,
      on_sale: filters.on_sale || undefined,
      in_stock: filters.in_stock || undefined,
      show_hidden: filters.show_hidden || undefined
    };
    
    try {
      // קריאה ל-API
      const result = await productService.getProducts(apiFilters);
      
      // הכנת רשימת המוצרים עם שדות חסרים
      const enhancedProducts = (result.products || []).map(product => {
        // אם יש במוצר וריאציות אבל אין לו מחיר רגיל, קח את המחיר מהוריאציה הראשונה
        if (product.product_type === 'variable' && (!product.regular_price || parseFloat(product.regular_price) === 0) && 
            product.variants && product.variants.length > 0) {
          
          const firstVariant = product.variants[0];
          if (firstVariant.regular_price && !product.regular_price) {
            product.regular_price = firstVariant.regular_price;
            product.regular_price_formatted = product.regular_price_formatted || 
              `₪${parseFloat(firstVariant.regular_price).toFixed(2)}`;
          }
          
          if (firstVariant.sale_price && parseFloat(firstVariant.sale_price) > 0 && 
              (!product.sale_price || parseFloat(product.sale_price) === 0)) {
            product.sale_price = firstVariant.sale_price;
            product.sale_price_formatted = product.sale_price_formatted || 
              `₪${parseFloat(firstVariant.sale_price).toFixed(2)}`;
            product.is_on_sale = true;
          }
        }
        return product;
      });
      
      setProducts(enhancedProducts);
      setTotalProducts(result.pagination?.total || 0);
      setPagination({
        page: result.pagination?.page || 1,
        limit: result.pagination?.limit || 20,
        totalPages: result.pagination?.totalPages || 1
      });
    } catch (apiError) {
      console.error('API error:', apiError);
      
      // במקרה של שגיאה ב-API, נשתמש בנתונים לדוגמה
      const demoProducts = Array(20).fill().map((_, index) => ({
        id: `product-${index + 1}`,
        name: `מוצר לדוגמה ${index + 1}`,
        regular_price: Math.floor(Math.random() * 500) + 50,
        sale_price: index % 3 === 0 ? Math.floor(Math.random() * 300) + 30 : null,
        is_on_sale: index % 3 === 0,
        regular_price_formatted: `₪${Math.floor(Math.random() * 500) + 50}`,
        sale_price_formatted: index % 3 === 0 ? `₪${Math.floor(Math.random() * 300) + 30}` : null,
        image_url: `/builder/build/images/placeholders/product${(index % 6) + 1}.jpg`,
        product_type: index % 4 === 0 ? 'variable' : 'simple',
        variant_count: index % 4 === 0 ? Math.floor(Math.random() * 5) + 2 : 0
      }));
      
      setProducts(demoProducts);
      setTotalProducts(demoProducts.length);
      setPagination({
        page: 1,
        limit: 20,
        totalPages: 1
      });
    }
  } catch (error) {
    console.error('Error loading products:', error);
    setError('שגיאה בטעינת מוצרים. אנא נסה שוב מאוחר יותר.');
    
    // במקרה של שגיאה, ננקה את רשימת המוצרים
    setProducts([]);
    setTotalProducts(0);
  } finally {
    setLoading(false);
  }
};

// פונקציה לשינוי עמוד
const handlePageChange = (newPage) => {
  if (newPage < 1 || newPage > pagination.totalPages) return;
  loadProducts(newPage);
};

// פונקציה להגשת החיפוש
const handleSearch = (e) => {
  e.preventDefault();
  loadProducts(1); // תמיד חזור לעמוד 1 בחיפוש חדש
};

// פונקציה לניקוי החיפוש
const clearSearch = () => {
  setSearchTerm('');
  // נטען את המוצרים מחדש רק אם היה מונח חיפוש
  if (searchTerm) {
    loadProducts(1);
  }
};

// פונקציה לשינוי קטגוריה
const handleCategoryChange = (e) => {
  setSelectedCategory(e.target.value);
  loadProducts(1); // תמיד חזור לעמוד 1 כששינוי בסינון
};

// פונקציה לטיפול בשינוי פילטרים
const handleFilterChange = (filterName) => {
  const updatedFilters = {
    ...filters,
    [filterName]: !filters[filterName]
  };
  setFilters(updatedFilters);
  loadProducts(1); // תמיד חזור לעמוד 1 כששינוי בסינון
};

// פונקציה להחלפת מצב בחירה של מוצר
const toggleProductSelection = (product) => {
  const isSelected = selectedProducts.some(p => p.id === product.id);
  
  if (isSelected) {
    setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
  } else {
    setSelectedProducts([...selectedProducts, product]);
  }
};

// פונקציה להגשת הבחירה
const confirmSelection = () => {
  onSelect(selectedProducts);
  onClose();
};

// פונקציה לתיקון נתיבי תמונות - מתמודדת עם המקרה של תמונות חסרות
const getFixedImageUrl = (imageUrl) => {
  if (!imageUrl) return "/builder/build/images/placeholders/no-image.jpg";
  
  const storeSlug = window.SERVER_DATA?.storeSlug || '';
  
  // בדיקה אם מדובר בתמונת placeholder
  if (imageUrl.includes('/placeholders/product')) {
    return `/builder/build/images/placeholders/product${imageUrl.charAt(imageUrl.length - 5)}.jpg`;
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
    <div style={modalStyles.modal} className="product-selector-modal">
      <div className="modal-header">
        <h2>בחירת מוצרים</h2>
        <button className="close-button" onClick={onClose}>
          <FiX />
        </button>
      </div>
      
      <div className="modal-search">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              className="search-input"
              placeholder="חיפוש מוצרים..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button type="button" className="clear-search" onClick={clearSearch}>
                <FiX />
              </button>
            )}
            <button type="submit" className="search-button">
              <FiSearch />
            </button>
          </div>
          
          <button 
            type="button" 
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter />
            <span>סינון</span>
          </button>
        </form>
        
        {showFilters && (
          <div className="filters-panel">
            <div className="filters-row">
              <div className="filter-group">
                <label>קטגוריה</label>
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="filter-select"
                >
                  <option value="">כל הקטגוריות</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.products_count || 0})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filter-options">
                <div className="filter-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={filters.on_sale}
                      onChange={() => handleFilterChange('on_sale')}
                    />
                    <span>במבצע בלבד</span>
                  </label>
                </div>
                
                <div className="filter-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={filters.in_stock}
                      onChange={() => handleFilterChange('in_stock')}
                    />
                    <span>במלאי בלבד</span>
                  </label>
                </div>
                
                <div className="filter-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={filters.show_hidden}
                      onChange={() => handleFilterChange('show_hidden')}
                    />
                    <span>כולל מוסתרים</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
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
          <div className="loading-indicator">טוען מוצרים...</div>
        ) : (
          <>
            <div className="products-count">
              <div className="selected-count">
                {selectedProducts.length} מוצרים נבחרו
              </div>
              <div className="total-count">
                מציג {products.length} מתוך {totalProducts} מוצרים
              </div>
            </div>
            
            {products.length === 0 ? (
              <div className="no-results">
                לא נמצאו מוצרים התואמים לחיפוש שלך
              </div>
            ) : (
              <div className="products-grid selector-grid">
                {products.map(product => {
                  const isSelected = selectedProducts.some(p => p.id === product.id);
                  
                  return (
                    <div 
                      key={product.id}
                      className={`product-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleProductSelection(product)}
                    >
                      <div className="selection-indicator">
                        {isSelected ? (
                          <FiCheckSquare className="selected-icon" />
                        ) : (
                          <FiSquare className="unselected-icon" />
                        )}
                      </div>
                      
                      <div className="product-image">
                        <img 
                          src={getFixedImageUrl(product.image_url || product.product_image)} 
                          alt={product.name}
                          onError={(e) => {
                            // במקרה של שגיאת טעינת תמונה, החלף לתמונת ברירת מחדל
                            e.target.src = "/builder/build/images/placeholders/product1.jpg";
                          }}
                        />
                        
                        {product.is_on_sale && (
                          <div className="sale-badge">מבצע</div>
                        )}
                      </div>
                      
                      <div className="product-info">
                        <h3 className="product-title">{product.name}</h3>
                        <div className="product-price">
                          {product.is_on_sale && product.regular_price && product.regular_price !== '0' && product.regular_price !== '0.00' && (
                            <span className="regular-price">
                              {product.regular_price_formatted || `₪${parseFloat(product.regular_price).toFixed(2)}`}
                            </span>
                          )}
                          <span className="current-price">
                            {product.is_on_sale && product.sale_price && product.sale_price !== '0' && product.sale_price !== '0.00'
                              ? (product.sale_price_formatted || `₪${parseFloat(product.sale_price).toFixed(2)}`)
                              : (product.regular_price && product.regular_price !== '0' && product.regular_price !== '0.00'
                                 ? (product.regular_price_formatted || `₪${parseFloat(product.regular_price).toFixed(2)}`)
                                 : '')
                            }
                          </span>
                        </div>
                        
                        {product.product_type === 'variable' && (
                          <div className="variant-badge">
                            {product.variant_count} וריאציות
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* פאגינציה */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-button"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  הקודם
                </button>
                
                <div className="pagination-info">
                  עמוד {pagination.page} מתוך {pagination.totalPages}
                </div>
                
                <button
                  className="pagination-button"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  הבא
                </button>
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
          disabled={selectedProducts.length === 0}
        >
          אישור ({selectedProducts.length})
        </button>
      </div>
    </div>
  </div>
);

return createPortal(modalContent, modalRoot);
};

export default ProductPicker;