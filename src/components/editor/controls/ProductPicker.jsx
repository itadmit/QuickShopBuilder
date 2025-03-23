// src/components/editor/controls/ProductPicker.jsx
import React, { useState, useEffect } from 'react';
import { FiSearch, FiX, FiFilter, FiCheck, FiCheckSquare, FiSquare } from 'react-icons/fi';
import { createPortal } from 'react-dom';
import productService from '../../../api/productService';

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

  // לוודא שיש לנו את ה-selectedProducts כאשר isOpen משתנה
  useEffect(() => {
    if (isOpen) {
      // טעינת קטגוריות
      loadCategories();
      
      // התחלה עם המוצרים שכבר נבחרו
      if (selectedProductIds && selectedProductIds.length > 0) {
        const initialSelected = selectedProductIds.map(id => ({ id }));
        setSelectedProducts(initialSelected);
      }
      
      // טעינת המוצרים
      loadProducts();
    }
  }, [isOpen, selectedProductIds]);

  // טעינת קטגוריות
  const loadCategories = async () => {
    try {
      const categoriesData = await productService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('שגיאה בטעינת קטגוריות');
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
      
      // קריאה ל-API
      const result = await productService.getProducts(apiFilters);
      
      setProducts(result.products || []);
      setTotalProducts(result.pagination?.total || 0);
      setPagination({
        page: result.pagination?.page || 1,
        limit: result.pagination?.limit || 20,
        totalPages: result.pagination?.totalPages || 1
      });
      
    } catch (error) {
      console.error('Error loading products:', error);
      setError('שגיאה בטעינת מוצרים');
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

  // אם המודל סגור, לא מציגים כלום
  if (!isOpen) return null;

  // יצירת פורטל עבור המודל
  return createPortal(
    <div className="modal-overlay">
      <div className="product-selector-modal">
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
                        {category.name} ({category.products_count})
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
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} />
                          ) : (
                            <div className="no-image">אין תמונה</div>
                          )}
                          
                          {product.is_on_sale && (
                            <div className="sale-badge">מבצע</div>
                          )}
                        </div>
                        
                        <div className="product-info">
                          <h3 className="product-title">{product.name}</h3>
                          <div className="product-price">
                            {product.is_on_sale && (
                              <span className="regular-price">{product.regular_price_formatted}</span>
                            )}
                            <span className="current-price">
                              {product.is_on_sale 
                                ? product.sale_price_formatted 
                                : product.regular_price_formatted}
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
    </div>,
    document.body
  );
};

export default ProductPicker;