import React, { useState } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { FiX, FiCopy, FiTrash2, FiType, FiLayout, FiSettings, FiChevronDown } from 'react-icons/fi';
import ColorPicker from './controls/ColorPicker';
import ImagePicker from './controls/ImagePicker';
import RangeSlider from './controls/RangeSlider';
import SwitchControl from './controls/SwitchControl';
import SelectControl from './controls/SelectControl';
import ProductPicker from './controls/ProductPicker';
import CategoryPicker from './controls/CategoryPicker';
import productService from '../../api/productService';

// Import common controls
import { 
  SpacingControl, 
  DeviceVisibilityControl, 
  CustomIdentifiers, 
  AnimationControl,
  TypographyControl
} from './controls/CommonControls';


const PropertyPanel = () => {
  const { selectedSection, updateSection, deleteSection } = useEditor();
  const [activeTab, setActiveTab] = useState('content'); // 'content', 'style', 'settings'
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);
  const [loadingProductDetails, setLoadingProductDetails] = useState(false);
  const [loadingCategoryDetails, setLoadingCategoryDetails] = useState(false);
  // פונקציה לפתיחת חלון בחירת מוצרים
const openProductPicker = () => {
  setIsProductPickerOpen(true);
};

// פונקציה לפתיחת חלון בחירת קטגוריות
const openCategoryPicker = () => {
  setIsCategoryPickerOpen(true);
};

const handleProductsSelected = async (selectedProducts) => {
  // בדיקה אם יש פרטים חסרים שצריך להשלים
  const productsToFetch = selectedProducts.filter(product => !product.name);
  
  if (productsToFetch.length > 0) {
    try {
      setLoadingProductDetails(true);
      
      // השלמת פרטי המוצרים החסרים במקביל
      const productDetails = await Promise.all(
        productsToFetch.map(product => productService.getProductById(product.id))
      );
      
      // שילוב פרטי המוצרים עם המוצרים שנבחרו
      const updatedProducts = selectedProducts.map(product => {
        if (!product.name) {
          // חיפוש הפרטים עבור המוצר הזה
          const details = productDetails.find(p => p.id === product.id);
          if (details) {
            return {
              id: details.id,
              name: details.name,
              price: details.regular_price,
              sale_price: details.sale_price,
              image_url: details.image_url,
              is_on_sale: details.is_on_sale,
              product_url: details.product_url,
              price_formatted: details.regular_price_formatted,
              sale_price_formatted: details.sale_price_formatted
            };
          }
        }
        return product;
      });
      
      // עדכון הסקשן עם המוצרים החדשים
      updateSection(selectedSection.id, { products: updatedProducts });
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoadingProductDetails(false);
    }
  } else {
    // אם לכל המוצרים כבר יש פרטים מלאים
    updateSection(selectedSection.id, { products: selectedProducts });
  }
};

// פונקציה לטיפול בבחירת קטגוריות
const handleCategoriesSelected = async (selectedCategories) => {
  // בדיקה אם יש פרטים חסרים שצריך להשלים
  const categoriesToFetch = selectedCategories.filter(category => !category.name);
  
  if (categoriesToFetch.length > 0) {
    try {
      setLoadingCategoryDetails(true);
      
      // השלמת פרטי הקטגוריות
      const categoriesData = await productService.getCategories();
      
      // שילוב פרטי הקטגוריות עם הקטגוריות שנבחרו
      const updatedCategories = selectedCategories.map(category => {
        if (!category.name) {
          // חיפוש הפרטים עבור הקטגוריה הזו
          const details = categoriesData.find(c => c.id === category.id);
          if (details) {
            return {
              id: details.id,
              name: details.name,
              products_count: details.products_count,
              image_url: details.image_url // אם יש
            };
          }
        }
        return category;
      });
      
      // עדכון הסקשן עם הקטגוריות החדשות
      updateSection(selectedSection.id, { collections: updatedCategories });
    } catch (error) {
      console.error('Error fetching category details:', error);
    } finally {
      setLoadingCategoryDetails(false);
    }
  } else {
    // אם לכל הקטגוריות כבר יש פרטים מלאים
    updateSection(selectedSection.id, { collections: selectedCategories });
  }
};

  // If no section is selected, show empty state
  if (!selectedSection) {
    return (
      <div className="property-panel empty">
        <div className="panel-header">
          <h3>הגדרות</h3>
        </div>
        <div className="empty-message">
          <div className="empty-icon">
            <FiSettings size={40} opacity={0.3} />
          </div>
          <p>בחר אלמנט כדי לערוך את המאפיינים שלו</p>
        </div>
      </div>
    );
  }

  // Helper function to update section properties
  const handleChange = (field, value) => {
    updateSection(selectedSection.id, { [field]: value });
  };

  // Function to delete a section
  const handleDelete = () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הסקשן הזה?')) {
      deleteSection(selectedSection.id);
    }
  };

  // Function to duplicate a section
  const handleDuplicate = () => {
    // In a real project, implement duplication logic here
    console.log('Duplicating section:', selectedSection);
  };

  // Render tabs
  const renderTabs = () => {
    return (
      <div className="property-tabs">
        <button 
          className={`tab ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          <FiType />
          תוכן
        </button>
        <button 
          className={`tab ${activeTab === 'style' ? 'active' : ''}`}
          onClick={() => setActiveTab('style')}
        >
          <FiLayout />
          עיצוב
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <FiSettings />
          הגדרות
        </button>
      </div>
    );
  };

  // Render content tab fields based on section type
  const renderContentTab = () => {
    switch (selectedSection.type) {
      case 'hero':
        return (
          <>
            <div className="property-group">
              <label className="property-label">כותרת ראשית</label>
              <input
                type="text"
                className="text-input"
                value={selectedSection.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="הזן כותרת ראשית"
              />
            </div>
            <div className="property-group">
              <label className="property-label">כותרת משנה</label>
              <textarea
                className="textarea-input"
                value={selectedSection.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="הזן תיאור קצר"
                rows={3}
              />
            </div>
            <div className="property-group">
              <label className="property-label">טקסט כפתור</label>
              <input
                type="text"
                className="text-input"
                value={selectedSection.buttonText || ''}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                placeholder="לדוגמה: קרא עוד"
              />
            </div>
            <div className="property-group">
              <label className="property-label">קישור כפתור</label>
              <input
                type="text"
                className="text-input"
                value={selectedSection.buttonLink || ''}
                onChange={(e) => handleChange('buttonLink', e.target.value)}
                placeholder="הזן URL"
              />
            </div>
          </>
        );
      
        case 'products':
          return (
            <>
              <div className="property-group">
                <label className="property-label">כותרת</label>
                <input
                  type="text"
                  className="text-input"
                  value={selectedSection.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              </div>
              <div className="property-group">
                <label className="property-label">מספר מוצרים להצגה</label>
                <RangeSlider
                  min={2}
                  max={12}
                  value={selectedSection.count || 4}
                  onChange={(value) => handleChange('count', value)}
                />
              </div>
              <div className="property-group">
                <label className="property-label">בחירת מוצרים</label>
                <button 
                  className="button-secondary product-select-button"
                  onClick={openProductPicker}
                >
                  בחר מוצרים
                </button>
                
                {loadingProductDetails ? (
                  <div className="loading-message">טוען פרטי מוצרים...</div>
                ) : selectedSection.products && selectedSection.products.length > 0 ? (
                  <div className="selected-items">
                    {selectedSection.products.map(product => (
                      <div key={product.id} className="selected-item">
                        <div className="selected-item-image">
                          {product.image_url && (
                            <img src={product.image_url} alt={product.name} />
                          )}
                        </div>
                        <div className="selected-item-info">
                          <span className="selected-item-name">{product.name}</span>
                          <span className="selected-item-price">
                            {product.is_on_sale ? (
                              <>
                                <span className="original-price">{product.price_formatted}</span>
                                <span className="sale-price">{product.sale_price_formatted}</span>
                              </>
                            ) : (
                              <span>{product.price_formatted}</span>
                            )}
                          </span>
                        </div>
                        <button 
                          className="remove-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const updatedProducts = selectedSection.products.filter(p => p.id !== product.id);
                            handleChange('products', updatedProducts);
                          }}
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-selection">לא נבחרו מוצרים (יוצגו המוצרים העדכניים ביותר)</p>
                )}
              </div>
              
              {/* רכיב הבחירה */}
              <ProductPicker
                isOpen={isProductPickerOpen}
                onClose={() => setIsProductPickerOpen(false)}
                onSelect={handleProductsSelected}
                selectedProductIds={selectedSection.products?.map(p => p.id) || []}
              />
            </>
          );
        
      case 'featured-products':
        return (
          <>
            <div className="property-group">
              <label className="property-label">כותרת</label>
              <input
                type="text"
                className="text-input"
                value={selectedSection.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">מספר מוצרים להצגה</label>
              <RangeSlider
                min={2}
                max={12}
                value={selectedSection.count || 4}
                onChange={(value) => handleChange('count', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">בחירת מוצרים</label>
              <button className="button-secondary" onClick={() => console.log('פתיחת חלון בחירת מוצרים')}>
                בחר מוצרים
              </button>
              
              {selectedSection.products && selectedSection.products.length > 0 ? (
                <div className="selected-items">
                  {selectedSection.products.map(product => (
                    <div key={product.id} className="selected-item">
                      <span>{product.title}</span>
                      <button 
                        className="remove-button"
                        onClick={() => {
                          const updatedProducts = selectedSection.products.filter(p => p.id !== product.id);
                          handleChange('products', updatedProducts);
                        }}
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-selection">לא נבחרו מוצרים (יוצגו המוצרים העדכניים ביותר)</p>
              )}
            </div>
          </>
        );
      
      case 'banner':
        return (
          <>
            <div className="property-group">
              <label className="property-label">כותרת</label>
              <input
                type="text"
                className="text-input"
                value={selectedSection.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">תיאור</label>
              <textarea
                className="textarea-input"
                value={selectedSection.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                rows={3}
              />
            </div>
            <div className="property-group">
              <label className="property-label">טקסט כפתור</label>
              <input
                type="text"
                className="text-input"
                value={selectedSection.buttonText || ''}
                onChange={(e) => handleChange('buttonText', e.target.value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">קישור כפתור</label>
              <input
                type="text"
                className="text-input"
                value={selectedSection.buttonLink || ''}
                onChange={(e) => handleChange('buttonLink', e.target.value)}
              />
            </div>
          </>
        );
      
      case 'text-image':
        return (
          <>
            <div className="property-group">
              <label className="property-label">כותרת</label>
              <input
                type="text"
                className="text-input"
                value={selectedSection.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">תוכן</label>
              <textarea
                className="textarea-input"
                value={selectedSection.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
                rows={5}
              />
            </div>
            <div className="property-group">
              <label className="property-label">מיקום התמונה</label>
              <SelectControl
                options={[
                  { value: 'right', label: 'מימין לטקסט' },
                  { value: 'left', label: 'משמאל לטקסט' }
                ]}
                value={selectedSection.imagePosition || 'right'}
                onChange={(value) => handleChange('imagePosition', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">תמונה</label>
              <ImagePicker
                value={selectedSection.image || ''}
                onChange={(value) => handleChange('image', value)}
              />
            </div>
          </>
        );
        
      case 'testimonials':
        return (
          <>
            <div className="property-group">
              <label className="property-label">כותרת</label>
              <input
                type="text"
                className="text-input"
                value={selectedSection.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            
            <div className="property-group">
              <label className="property-label">המלצות</label>
              {selectedSection.testimonials && selectedSection.testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="testimonial-item">
                  <div className="property-group">
                    <label className="property-label">שם</label>
                    <input
                      type="text"
                      className="text-input"
                      value={testimonial.author || ''}
                      onChange={(e) => {
                        const updatedTestimonials = [...selectedSection.testimonials];
                        updatedTestimonials[index] = {
                          ...updatedTestimonials[index],
                          author: e.target.value
                        };
                        handleChange('testimonials', updatedTestimonials);
                      }}
                    />
                  </div>
                  <div className="property-group">
                    <label className="property-label">תוכן</label>
                    <textarea
                      className="textarea-input"
                      value={testimonial.content || ''}
                      onChange={(e) => {
                        const updatedTestimonials = [...selectedSection.testimonials];
                        updatedTestimonials[index] = {
                          ...updatedTestimonials[index],
                          content: e.target.value
                        };
                        handleChange('testimonials', updatedTestimonials);
                      }}
                      rows={3}
                    />
                  </div>
                  <button
                    className="delete-button small"
                    onClick={() => {
                      const updatedTestimonials = selectedSection.testimonials.filter(t => t.id !== testimonial.id);
                      handleChange('testimonials', updatedTestimonials);
                    }}
                  >
                    <FiTrash2 /> הסר המלצה
                  </button>
                </div>
              ))}
              
              <button
                className="add-button"
                onClick={() => {
                  const newTestimonial = {
                    id: Date.now().toString(),
                    author: '',
                    content: ''
                  };
                  const updatedTestimonials = [...(selectedSection.testimonials || []), newTestimonial];
                  handleChange('testimonials', updatedTestimonials);
                }}
              >
                + הוסף המלצה
              </button>
            </div>
          </>
        );
      
        case 'collections':
          return (
            <>
              <div className="property-group">
                <label className="property-label">כותרת</label>
                <input
                  type="text"
                  className="text-input"
                  value={selectedSection.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              </div>
              <div className="property-group">
                <label className="property-label">מספר קטגוריות להצגה</label>
                <RangeSlider
                  min={2}
                  max={6}
                  value={selectedSection.count || 3}
                  onChange={(value) => handleChange('count', value)}
                />
              </div>
              <div className="property-group">
                <label className="property-label">בחירת קטגוריות</label>
                <button 
                  className="button-secondary category-select-button"
                  onClick={openCategoryPicker}
                >
                  בחר קטגוריות
                </button>
                
                {loadingCategoryDetails ? (
                  <div className="loading-message">טוען פרטי קטגוריות...</div>
                ) : selectedSection.collections && selectedSection.collections.length > 0 ? (
                  <div className="selected-items">
                    {selectedSection.collections.map(collection => (
                      <div key={collection.id} className="selected-item">
                        <div className="selected-item-info">
                          <span className="selected-item-name">{collection.name}</span>
                          <span className="products-count">
                            {collection.products_count} מוצרים
                          </span>
                        </div>
                        <button 
                          className="remove-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const updatedCollections = selectedSection.collections.filter(c => c.id !== collection.id);
                            handleChange('collections', updatedCollections);
                          }}
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-selection">לא נבחרו קטגוריות (יוצגו הקטגוריות העדכניות ביותר)</p>
                )}
              </div>
              
              {/* רכיב הבחירה */}
              <CategoryPicker
                isOpen={isCategoryPickerOpen}
                onClose={() => setIsCategoryPickerOpen(false)}
                onSelect={handleCategoriesSelected}
                selectedCategoryIds={selectedSection.collections?.map(c => c.id) || []}
              />
            </>
          );
        
      
      case 'newsletter':
        return (
          <>
            <div className="property-group">
              <label className="property-label">כותרת</label>
              <input
                type="text"
                className="text-input"
                value={selectedSection.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">תיאור</label>
              <textarea
                className="textarea-input"
                value={selectedSection.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                rows={3}
              />
            </div>
            <div className="property-group">
              <label className="property-label">טקסט כפתור</label>
              <input
                type="text"
                className="text-input"
                value={selectedSection.buttonText || ''}
                onChange={(e) => handleChange('buttonText', e.target.value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">כתובת אימייל לשליחת הטופס (צד שרת)</label>
              <input
                type="email"
                className="text-input"
                value={selectedSection.formEmail || ''}
                onChange={(e) => handleChange('formEmail', e.target.value)}
                placeholder="mail@example.com"
              />
            </div>
          </>
        );
          
      default:
        return <p>אין הגדרות תוכן זמינות עבור רכיב זה</p>;
    }
  };

  // Render style tab fields based on section type
  const renderStyleTab = () => {
    // Common style controls for all sections
    // Common style controls for all sections
// Common style controls for all sections
const commonStyleControls = (
  <>
    <div className="property-group-title">טיפוגרפיה</div>
    
    {/* כותרת ראשית */}
    {selectedSection.title !== undefined && (
      <div className="property-group">
        <div className="collapsible-panel">
          <div 
            className="collapsible-header"
            onClick={(e) => {
              e.currentTarget.closest('.collapsible-panel').classList.toggle('open');
            }}
          >
            <span>הגדרות כותרת</span>
            <div className="toggle-button">
              <FiChevronDown />
            </div>
          </div>
          <div className="collapsible-content">
            <TypographyControl
              values={{
                fontFamily: selectedSection.titleFontFamily || "'Noto Sans Hebrew', sans-serif",
                fontSize: selectedSection.titleFontSize || 28,
                fontWeight: selectedSection.titleFontWeight || "bold",
                fontStyle: selectedSection.titleFontStyle || "normal",
                textDecoration: selectedSection.titleTextDecoration || "none",
                textTransform: selectedSection.titleTextTransform || "none",
                lineHeight: selectedSection.titleLineHeight || 1.2,
                letterSpacing: selectedSection.titleLetterSpacing || 0
              }}
              onChange={(newValues) => {
                Object.entries(newValues).forEach(([key, value]) => {
                  handleChange(`title${key.charAt(0).toUpperCase() + key.slice(1)}`, value);
                });
              }}
              title="כותרת"
            />
          </div>
        </div>
      </div>
    )}

    {/* טקסט רגיל - רק אם יש תוכן או כותרת משנה */}
    {(selectedSection.content !== undefined || selectedSection.subtitle !== undefined) && (
      <div className="property-group">
        <div className="collapsible-panel">
          <div 
            className="collapsible-header"
            onClick={(e) => {
              e.currentTarget.closest('.collapsible-panel').classList.toggle('open');
            }}
          >
            <span>הגדרות טקסט</span>
            <div className="toggle-button">
              <FiChevronDown />
            </div>
          </div>
          <div className="collapsible-content">
            <TypographyControl
              values={{
                fontFamily: selectedSection.textFontFamily || "'Noto Sans Hebrew', sans-serif",
                fontSize: selectedSection.textFontSize || 16,
                fontWeight: selectedSection.textFontWeight || "normal",
                fontStyle: selectedSection.textFontStyle || "normal",
                textDecoration: selectedSection.textTextDecoration || "none",
                textTransform: selectedSection.textTextTransform || "none",
                lineHeight: selectedSection.textLineHeight || 1.5,
                letterSpacing: selectedSection.textLetterSpacing || 0
              }}
              onChange={(newValues) => {
                Object.entries(newValues).forEach(([key, value]) => {
                  handleChange(`text${key.charAt(0).toUpperCase() + key.slice(1)}`, value);
                });
              }}
              title="טקסט"
            />
          </div>
        </div>
      </div>
    )}

    {/* כפתורים - רק אם יש כפתור בסקשן */}
    {selectedSection.buttonText !== undefined && (
      <div className="property-group">
        <div className="collapsible-panel">
          <div 
            className="collapsible-header"
            onClick={(e) => {
              e.currentTarget.closest('.collapsible-panel').classList.toggle('open');
            }}
          >
            <span>הגדרות כפתור</span>
            <div className="toggle-button">
              <FiChevronDown />
            </div>
          </div>
          <div className="collapsible-content">
            <TypographyControl
              values={{
                fontFamily: selectedSection.buttonFontFamily || "'Noto Sans Hebrew', sans-serif",
                fontSize: selectedSection.buttonFontSize || 14,
                fontWeight: selectedSection.buttonFontWeight || "500",
                lineHeight: selectedSection.buttonLineHeight || 1.2
              }}
              onChange={(newValues) => {
                Object.entries(newValues).forEach(([key, value]) => {
                  handleChange(`button${key.charAt(0).toUpperCase() + key.slice(1)}`, value);
                });
              }}
              title="כפתור"
              showAllOptions={false}
            />
          </div>
        </div>
      </div>
    )}
  </>
);
  
    // Section specific style controls
    switch (selectedSection.type) {
      case 'hero':
      case 'banner':
        return (
          <>
            {commonStyleControls}
            <div className="property-group-title">רקע</div>
            <div className="property-group">
              <label className="property-label">תמונת רקע</label>
              <ImagePicker
                value={selectedSection.backgroundImage || ''}
                onChange={(value) => handleChange('backgroundImage', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">עמעום רקע</label>
              <RangeSlider
                min={0}
                max={100}
                value={(selectedSection.overlayOpacity || 0.4) * 100}
                onChange={(value) => handleChange('overlayOpacity', value / 100)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">גובה</label>
              <RangeSlider
                min={100}
                max={800}
                value={selectedSection.height || (selectedSection.type === 'hero' ? 400 : 200)}
                onChange={(value) => handleChange('height', value)}
              />
            </div>
            <div className="property-group-title">כפתור</div>
            <div className="property-group">
              <label className="property-label">צבע כפתור</label>
              <ColorPicker
                value={selectedSection.buttonColor || '#ffffff'}
                onChange={(value) => handleChange('buttonColor', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">צבע טקסט כפתור</label>
              <ColorPicker
                value={selectedSection.buttonTextColor || '#00000'}
                onChange={(value) => handleChange('buttonTextColor', value)}
              />
            </div>
          </>
        );
      
      case 'text-image':
        return (
          <>
            {commonStyleControls}
            <div className="property-group-title">תמונה</div>
            <div className="property-group">
              <label className="property-label">גודל תמונה</label>
              <RangeSlider
                min={20}
                max={80}
                value={selectedSection.imageWidth || 50}
                onChange={(value) => handleChange('imageWidth', value)}
              />
            </div>
            <div className="property-group-title">צבעים</div>
            <div className="property-group">
              <label className="property-label">צבע כותרת</label>
              <ColorPicker
                value={selectedSection.titleColor || '#202123'}
                onChange={(value) => handleChange('titleColor', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">צבע טקסט</label>
              <ColorPicker
                value={selectedSection.textColor || '#65676b'}
                onChange={(value) => handleChange('textColor', value)}
              />
            </div>
          </>
        );
      
      case 'newsletter':
        return (
          <>
            {commonStyleControls}
            <div className="property-group-title">רקע</div>
            <div className="property-group">
              <label className="property-label">סוג רקע</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="bgType"
                    checked={!selectedSection.backgroundImage}
                    onChange={() => handleChange('backgroundImage', null)}
                  />
                  צבע רקע
                </label>
                <label>
                  <input
                    type="radio"
                    name="bgType"
                    checked={!!selectedSection.backgroundImage}
                    onChange={() => handleChange('backgroundImage', '/placeholder-bg.jpg')}
                  />
                  תמונת רקע
                </label>
              </div>
            </div>
            
            {selectedSection.backgroundImage ? (
              <div className="property-group">
                <label className="property-label">תמונת רקע</label>
                <ImagePicker
                  value={selectedSection.backgroundImage}
                  onChange={(value) => handleChange('backgroundImage', value)}
                />
              </div>
            ) : (
              <div className="property-group">
                <label className="property-label">צבע רקע</label>
                <ColorPicker
                  value={selectedSection.backgroundColor || '#f7f7f7'}
                  onChange={(value) => handleChange('backgroundColor', value)}
                />
              </div>
            )}
            
            <div className="property-group-title">כפתור</div>
            <div className="property-group">
              <label className="property-label">צבע כפתור</label>
              <ColorPicker
                value={selectedSection.buttonColor || '#5271ff'}
                onChange={(value) => handleChange('buttonColor', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">צבע טקסט כפתור</label>
              <ColorPicker
                value={selectedSection.buttonTextColor || '#ffffff'}
                onChange={(value) => handleChange('buttonTextColor', value)}
              />
            </div>
          </>
        );
      
      case 'testimonials':
        return (
          <>
            {commonStyleControls}
            <div className="property-group-title">צבעים</div>
            <div className="property-group">
              <label className="property-label">צבע רקע סקשן</label>
              <ColorPicker
                value={selectedSection.backgroundColor || '#f8f9fb'}
                onChange={(value) => handleChange('backgroundColor', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">צבע רקע המלצות</label>
              <ColorPicker
                value={selectedSection.cardBackgroundColor || '#ffffff'}
                onChange={(value) => handleChange('cardBackgroundColor', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">צבע טקסט</label>
              <ColorPicker
                value={selectedSection.textColor || '#202123'}
                onChange={(value) => handleChange('textColor', value)}
              />
            </div>
          </>
        );
      
      case 'products':
      case 'collections':
        return (
          <>
            {commonStyleControls}
            <div className="property-group-title">עיצוב כרטיסים</div>
            <div className="property-group">
              <label className="property-label">צבע רקע כרטיס</label>
              <ColorPicker
                value={selectedSection.cardBackgroundColor || '#ffffff'}
                onChange={(value) => handleChange('cardBackgroundColor', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">מרווח בין פריטים</label>
              <RangeSlider
                min={4}
                max={40}
                value={selectedSection.itemGap || 24}
                onChange={(value) => handleChange('itemGap', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">הצג מסגרת</label>
              <SwitchControl
                checked={selectedSection.showBorder || false}
                onChange={(checked) => handleChange('showBorder', checked)}
              />
            </div>
            {selectedSection.showBorder && (
              <div className="property-group">
                <label className="property-label">צבע מסגרת</label>
                <ColorPicker
                  value={selectedSection.borderColor || '#e4e6eb'}
                  onChange={(value) => handleChange('borderColor', value)}
                />
              </div>
            )}
          </>
        );
      
      default:
        return (
          <>
            {commonStyleControls}
            <div className="property-group">
              <p>אין הגדרות עיצוב ספציפיות נוספות לרכיב זה</p>
            </div>
          </>
        );
    }
  };

  // Render settings tab
  const renderSettingsTab = () => {
    return (
      <>
        <div className="property-group-title">זיהוי</div>
        <CustomIdentifiers 
          customId={selectedSection.customId} 
          customClass={selectedSection.customClass}
          onChange={handleChange}
        />
        
        <div className="property-group-title">ניראות במכשירים</div>
        <DeviceVisibilityControl 
          values={{
            showOnDesktop: selectedSection.showOnDesktop !== false,
            showOnTablet: selectedSection.showOnTablet !== false,
            showOnMobile: selectedSection.showOnMobile !== false
          }}
          onChange={(newValues) => {
            Object.entries(newValues).forEach(([key, value]) => {
              handleChange(key, value);
            });
          }}
        />
        
        <div className="property-group-title">מרווחים</div>
        <SpacingControl 
          type="margin"
          values={{
            top: selectedSection.marginTop || '',
            right: selectedSection.marginRight || '',
            bottom: selectedSection.marginBottom || '',
            left: selectedSection.marginLeft || ''
          }}
          onChange={(newValues) => {
            handleChange('marginTop', newValues.top);
            handleChange('marginRight', newValues.right);
            handleChange('marginBottom', newValues.bottom);
            handleChange('marginLeft', newValues.left);
          }}
        />
        
        <SpacingControl 
          type="padding"
          values={{
            top: selectedSection.paddingTop || '',
            right: selectedSection.paddingRight || '',
            bottom: selectedSection.paddingBottom || '',
            left: selectedSection.paddingLeft || ''
          }}
          onChange={(newValues) => {
            handleChange('paddingTop', newValues.top);
            handleChange('paddingRight', newValues.right);
            handleChange('paddingBottom', newValues.bottom);
            handleChange('paddingLeft', newValues.left);
          }}
        />
        
        <div className="property-group-title">אנימציה</div>
        <AnimationControl 
          animation={selectedSection.animation}
          duration={selectedSection.animationDuration}
          delay={selectedSection.animationDelay}
          onChange={handleChange}
        />
        
        <div className="property-actions">
          <button 
            className="duplicate-button"
            onClick={handleDuplicate}
          >
            <FiCopy /> שכפל סקשן
          </button>
          <button 
            className="delete-button"
            onClick={handleDelete}
          >
            <FiTrash2 /> מחק סקשן
          </button>
        </div>
      </>
    );
  };

  // Render the appropriate tab content
  const renderTabContent = () => {
    if (activeTab === 'content') {
      return renderContentTab();
    } else if (activeTab === 'style') {
      return renderStyleTab();
    } else if (activeTab === 'settings') {
      return renderSettingsTab();
    }
  };

  return (
    <div className="property-panel">
      <div className="panel-header">
        <h3>{getSectionName(selectedSection.type)}</h3>
        <button className="panel-toggle">
          <FiX />
        </button>
      </div>
      
      {renderTabs()}
      
      <div className="panel-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

// Helper function to get friendly name for section type
function getSectionName(type) {
  const typeNames = {
    'hero': 'כותרת ראשית',
    'products': 'מוצרים',
    'featured-products': 'מוצרים מובחרים',
    'banner': 'באנר',
    'text-image': 'טקסט ותמונה',
    'testimonials': 'המלצות',
    'collections': 'קטגוריות',
    'newsletter': 'ניוזלטר',
  };
  
  return typeNames[type] || type;
}

export default PropertyPanel;