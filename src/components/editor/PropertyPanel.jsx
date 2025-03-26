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
  // משתמשים בפונקציות החדשות
  const { 
  selectedSection, 
  updateSection, 
  deleteSection, 
  findSelectedWidget, 
  updateWidgetInColumn, 
  deleteWidgetFromColumn,
  selectedWidgetInfo,
  selectedSectionId
} = useEditor();

  const [activeTab, setActiveTab] = useState('content'); // 'content', 'style', 'settings'
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);
  const [loadingProductDetails, setLoadingProductDetails] = useState(false);
  const [loadingCategoryDetails, setLoadingCategoryDetails] = useState(false);

  // בדיקה אם מדובר בווידג'ט בתוך עמודה
  const selectedWidget = findSelectedWidget(); 
  console.log('PropertyPanel - selectedSectionId:', selectedSectionId);
  console.log('PropertyPanel - selectedWidget:', selectedWidget);
  console.log('PropertyPanel - selectedWidgetInfo:', selectedWidgetInfo);
  // פונקציה מעודכנת לטיפול בשינויים עבור ווידג'טים ועמודות
  const handleChange = (field, value) => {
    if (selectedWidget) {
      // אם זה ווידג'ט בתוך עמודה
      console.log(`Updating widget ${selectedWidget.id}, field: ${field}, value:`, value);
      updateWidgetInColumn(selectedWidget.id, { [field]: value });
    } else if (selectedSection) {
      // אם זה סקשן רגיל
      console.log(`Updating section ${selectedSection.id}, field: ${field}, value:`, value);
      updateSection(selectedSection.id, { [field]: value });
    }
  };


  // פונקציה מעודכנת למחיקה עבור ווידג'טים ועמודות
  // פונקציה מעודכנת למחיקה
  const handleDelete = () => {
    if (selectedWidget) {
      // מחיקת ווידג'ט מעמודה
      if (window.confirm('האם אתה בטוח שברצונך למחוק את הווידג\'ט הזה?')) {
        deleteWidgetFromColumn(selectedWidget.id);
      }
    } else if (selectedSection) {
      // מחיקת סקשן
      if (window.confirm('האם אתה בטוח שברצונך למחוק את הסקשן הזה?')) {
        deleteSection(selectedSection.id);
      }
    }
  };

  // הצגת מצב ריק אם אין סקשן או ווידג'ט נבחר
  if (!selectedSection && !selectedWidget) {
    return (
      <div className="property-panel empty">
        <div className="panel-header">
          <h3>הגדרות</h3>
        </div>
        <div className="empty-message">
          <p>בחר אלמנט כדי לערוך את המאפיינים שלו</p>
        </div>
      </div>
    );
  }

  // שינוי בכותרת ה-panel
  const getItemTitle = () => {
    if (selectedWidget) {
      return `ווידג'ט ${getSectionName(selectedWidget.type)}`;
    } else if (selectedSection) {
      return getSectionName(selectedSection.type);
    }
    return "הגדרות";
  };


  // פונקציות עזר למידע על מחירי מוצרים ועיבוד וריאציות (נשארו ללא שינוי)
  const getFullProductImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    if (imageUrl.startsWith('/')) {
      return imageUrl;
    }
    const storeSlug = window.SERVER_DATA?.storeSlug || 'yogev';
    return `https://quickshopil-storage.s3.amazonaws.com/uploads/${storeSlug}/${imageUrl}`;
  };

  const processProductVariantPrices = async (product) => {
    if (!product || !product.id) return product;
    try {
      if (product.processedWithVariants) {
        return product;
      }
      if (product.product_type === 'variable') {
        if (product.variations) {
          let minRegularPrice = 0;
          let minSalePrice = 0;
          let isOnSale = false;
          Object.values(product.variations).forEach(variants => {
            variants.forEach(variant => {
              if (variant.regular_price && (minRegularPrice === 0 || variant.regular_price < minRegularPrice)) {
                minRegularPrice = parseFloat(variant.regular_price);
              }
              if (variant.sale_price && (minSalePrice === 0 || variant.sale_price < minSalePrice)) {
                minSalePrice = parseFloat(variant.sale_price);
                isOnSale = true;
              }
            });
          });
          const formattedRegularPrice = minRegularPrice ? `₪${minRegularPrice.toFixed(2)}` : '₪0.00';
          const formattedSalePrice = minSalePrice ? `₪${minSalePrice.toFixed(2)}` : '';
          return {
            ...product,
            processedWithVariants: true,
            display_regular_price: minRegularPrice,
            display_sale_price: isOnSale ? minSalePrice : 0,
            regular_price: minRegularPrice,
            sale_price: isOnSale ? minSalePrice : 0,
            price_formatted: formattedRegularPrice,
            sale_price_formatted: formattedSalePrice,
            is_on_sale: isOnSale
          };
        }
        try {
          const productDetails = await productService.getProductById(product.id);
          if (productDetails && productDetails.variations) {
            const processedProduct = processProductVariantPrices({
              ...product,
              variations: productDetails.variations
            });
            return processedProduct;
          }
        } catch (variantError) {
          console.error('Error fetching variant data:', variantError);
        }
      }
      return {
        ...product,
        processedWithVariants: true,
        display_regular_price: product.regular_price || 0,
        display_sale_price: product.sale_price || 0,
        price_formatted: product.regular_price ? `₪${parseFloat(product.regular_price).toFixed(2)}` : '₪0.00',
        sale_price_formatted: product.sale_price ? `₪${parseFloat(product.sale_price).toFixed(2)}` : '',
        is_on_sale: product.sale_price && parseFloat(product.sale_price) < parseFloat(product.regular_price)
      };
    } catch (error) {
      console.error('Error processing product prices:', error);
      return product;
    }
  };

  const handleProductsSelected = async (selectedProducts) => {
    const productsToFetch = selectedProducts.filter(product => !product.name);
    if (productsToFetch.length > 0) {
      try {
        setLoadingProductDetails(true);
        const productDetails = await Promise.all(
          productsToFetch.map(product => productService.getProductById(product.id))
        );
        let updatedProducts = selectedProducts.map(product => {
          if (!product.name) {
            const details = productDetails.find(p => p.id === product.id);
            if (details) {
              return {
                id: details.id,
                name: details.name,
                price: details.regular_price,
                sale_price: details.sale_price,
                image_url: details.image_url,
                product_image: details.product_image,
                is_on_sale: details.is_on_sale,
                product_url: details.product_url,
                price_formatted: details.regular_price_formatted,
                sale_price_formatted: details.sale_price_formatted,
                badge_text: details.badge_text,
                badge_color: details.badge_color,
                product_type: details.product_type,
                variations: details.variations,
                is_out_of_stock: details.is_out_of_stock
              };
            }
          }
          return product;
        });
        updatedProducts = await Promise.all(
          updatedProducts.map(async (product) => {
            return await processProductVariantPrices(product);
          })
        );
        updateSection(selectedSection.id, { products: updatedProducts });
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoadingProductDetails(false);
      }
    } else {
      try {
        setLoadingProductDetails(true);
        const updatedProducts = await Promise.all(
          selectedProducts.map(async (product) => {
            return await processProductVariantPrices(product);
          })
        );
        updateSection(selectedSection.id, { products: updatedProducts });
      } catch (error) {
        console.error('Error processing product prices:', error);
      } finally {
        setLoadingProductDetails(false);
      }
    }
  };

  const handleCategoriesSelected = async (selectedCategories) => {
    const categoriesToFetch = selectedCategories.filter(category => !category.name);
    if (categoriesToFetch.length > 0) {
      try {
        setLoadingCategoryDetails(true);
        const categoriesData = await productService.getCategories();
        const updatedCategories = selectedCategories.map(category => {
          if (!category.name) {
            const details = categoriesData.find(c => c.id === category.id);
            if (details) {
              return {
                id: details.id,
                name: details.name,
                products_count: details.products_count,
                image_url: details.image_url
              };
            }
          }
          return category;
        });
        updateSection(selectedSection.id, { collections: updatedCategories });
      } catch (error) {
        console.error('Error fetching category details:', error);
      } finally {
        setLoadingCategoryDetails(false);
      }
    } else {
      updateSection(selectedSection.id, { collections: selectedCategories });
    }
  };

  // הפונקציה המקורית לסקשנים (לא שונו)
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
      case 'row':
        return (
          <>
            <div className="property-group">
              <label className="property-label">מספר עמודות</label>
              <SelectControl
                options={[
                  { value: 1, label: 'עמודה אחת' },
                  { value: 2, label: 'שתי עמודות' },
                  { value: 3, label: 'שלוש עמודות' },
                  { value: 4, label: 'ארבע עמודות' }
                ]}
                value={selectedSection.columns || 2}
                onChange={(value) => {
                  const numColumns = parseInt(value);
                  const equalWidth = 100 / numColumns;
                  const newColumnWidths = Array(numColumns).fill(equalWidth);
                  let newColumnsContent = [...(selectedSection.columnsContent || [])];
                  while (newColumnsContent.length < numColumns) {
                    newColumnsContent.push({ widgets: [] });
                  }
                  if (newColumnsContent.length > numColumns) {
                    newColumnsContent = newColumnsContent.slice(0, numColumns);
                  }
                  handleChange('columns', numColumns);
                  handleChange('columnWidths', newColumnWidths);
                  handleChange('columnsContent', newColumnsContent);
                }}
              />
            </div>
            <div className="property-group">
              <label className="property-label">מרווח בין עמודות</label>
              <RangeSlider
                min={0}
                max={50}
                value={selectedSection.columnGap || 20}
                onChange={(value) => handleChange('columnGap', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">רקע עמודות</label>
              <ColorPicker
                value={selectedSection.columnBackgroundColor || 'rgba(248, 249, 251, 0.7)'}
                onChange={(value) => handleChange('columnBackgroundColor', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">התנהגות רספונסיבית</label>
              <SwitchControl
                checked={selectedSection.columnsResponsive !== false}
                onChange={(checked) => handleChange('columnsResponsive', checked)}
              />
              <p className="helper-text">כאשר מופעל, העמודות יסתדרו אנכית במסכים צרים</p>
            </div>
            {selectedSection.columns > 1 && (
              <div className="property-group">
                <label className="property-label">רוחב עמודות</label>
                <div className="column-widths-controls">
                  {selectedSection.columnWidths && selectedSection.columnWidths.map((width, idx) => (
                    <div key={idx} className="column-width-control">
                      <label>עמודה {idx + 1}</label>
                      <RangeSlider
                        min={10}
                        max={90}
                        value={width}
                        onChange={(value) => {
                          const newWidths = [...selectedSection.columnWidths];
                          newWidths[idx] = value;
                          const totalWidth = newWidths.reduce((sum, w) => sum + w, 0);
                          const adjustment = 100 / totalWidth;
                          const adjustedWidths = newWidths.map(w => Math.round(w * adjustment));
                          handleChange('columnWidths', adjustedWidths);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        );
      case 'button':
        return (
          <>
            <div className="property-group">
              <label className="property-label">טקסט כפתור</label>
              <input
                type="text"
                className="text-input"
                value={selectedSection.buttonText || ''}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                placeholder="לדוגמה: לחץ כאן"
              />
            </div>
            <div className="property-group">
              <label className="property-label">קישור</label>
              <input
                type="text"
                className="text-input"
                value={selectedSection.buttonLink || ''}
                onChange={(e) => handleChange('buttonLink', e.target.value)}
                placeholder="הכנס URL"
              />
            </div>
            <div className="property-group">
              <label className="property-label">יישור</label>
              <SelectControl
                options={[
                  { value: 'right', label: 'ימין' },
                  { value: 'center', label: 'מרכז' },
                  { value: 'left', label: 'שמאל' }
                ]}
                value={selectedSection.alignment || 'center'}
                onChange={(value) => handleChange('alignment', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">סגנון</label>
              <SelectControl
                options={[
                  { value: 'filled', label: 'מלא' },
                  { value: 'outline', label: 'מתאר' },
                  { value: 'link', label: 'קישור' }
                ]}
                value={selectedSection.buttonStyle || 'filled'}
                onChange={(value) => handleChange('buttonStyle', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">גודל</label>
              <SelectControl
                options={[
                  { value: 'small', label: 'קטן' },
                  { value: 'medium', label: 'בינוני' },
                  { value: 'large', label: 'גדול' }
                ]}
                value={selectedSection.buttonSize || 'medium'}
                onChange={(value) => handleChange('buttonSize', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">פתיחה בחלון חדש</label>
              <SwitchControl
                checked={selectedSection.openInNewTab === true}
                onChange={(checked) => handleChange('openInNewTab', checked)}
              />
            </div>
          </>
        );
      case 'image':
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
              <label className="property-label">בחירת תמונה</label>
              <ImagePicker
                value={selectedSection.image || ''}
                onChange={(value) => handleChange('image', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">טקסט חלופי (alt)</label>
              <input
                type="text"
                className="text-input"
                value={selectedSection.altText || ''}
                onChange={(e) => handleChange('altText', e.target.value)}
                placeholder="תיאור התמונה לנגישות"
              />
            </div>
            <div className="property-group">
              <label className="property-label">קישור</label>
              <input
                type="text"
                className="text-input"
                value={selectedSection.linkUrl || ''}
                onChange={(e) => handleChange('linkUrl', e.target.value)}
                placeholder="הוסף URL לקישור (אופציונלי)"
              />
            </div>
            <div className="property-group">
              <label className="property-label">יישור</label>
              <SelectControl
                options={[
                  { value: 'right', label: 'ימין' },
                  { value: 'center', label: 'מרכז' },
                  { value: 'left', label: 'שמאל' }
                ]}
                value={selectedSection.alignment || 'center'}
                onChange={(value) => handleChange('alignment', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">רוחב (פיקסלים)</label>
              <RangeSlider
                min={50}
                max={1200}
                value={selectedSection.imageWidth || 400}
                onChange={(value) => handleChange('imageWidth', value)}
              />
            </div>
          </>
        );
      case 'text':
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
                rows={6}
              />
            </div>
            <div className="property-group">
              <label className="property-label">יישור</label>
              <SelectControl
                options={[
                  { value: 'right', label: 'ימין' },
                  { value: 'center', label: 'מרכז' },
                  { value: 'left', label: 'שמאל' },
                  { value: 'justify', label: 'מיושר לשני הצדדים' }
                ]}
                value={selectedSection.alignment || 'right'}
                onChange={(value) => handleChange('alignment', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">רוחב מקסימלי</label>
              <RangeSlider
                min={200}
                max={1200}
                value={selectedSection.maxWidth || 1000}
                onChange={(value) => handleChange('maxWidth', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">אות פתיחה גדולה (Drop Cap)</label>
              <SwitchControl
                checked={selectedSection.dropCap === true}
                onChange={(checked) => handleChange('dropCap', checked)}
              />
            </div>
          </>
        );
      case 'video':
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
              <label className="property-label">סוג וידאו</label>
              <SelectControl
                options={[
                  { value: 'youtube', label: 'YouTube' },
                  { value: 'vimeo', label: 'Vimeo' },
                  { value: 'custom', label: 'מותאם אישית' }
                ]}
                value={selectedSection.videoType || 'youtube'}
                onChange={(value) => handleChange('videoType', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">כתובת URL לוידאו</label>
              <input
                type="text"
                className="text-input"
                value={selectedSection.videoUrl || ''}
                onChange={(e) => handleChange('videoUrl', e.target.value)}
                placeholder={selectedSection.videoType === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 
                             selectedSection.videoType === 'vimeo' ? 'https://vimeo.com/...' : 
                             'הכנס כתובת לקובץ וידאו'}
              />
            </div>
            <div className="property-group">
              <label className="property-label">יחס גובה-רוחב</label>
              <SelectControl
                options={[
                  { value: '16:9', label: '16:9 (מלבני)' },
                  { value: '4:3', label: '4:3 (רגיל)' },
                  { value: '1:1', label: '1:1 (מרובע)' }
                ]}
                value={selectedSection.aspectRatio || '16:9'}
                onChange={(value) => handleChange('aspectRatio', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">רוחב מקסימלי</label>
              <RangeSlider
                min={200}
                max={1200}
                value={selectedSection.maxWidth || 800}
                onChange={(value) => handleChange('maxWidth', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">כיתוב</label>
              <input
                type="text"
                className="text-input"
                value={selectedSection.caption || ''}
                onChange={(e) => handleChange('caption', e.target.value)}
                placeholder="כיתוב מתחת לוידאו (אופציונלי)"
              />
            </div>
            <div className="property-group">
              <label className="property-label">הגדרות נגינה</label>
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedSection.autoplay === true}
                    onChange={(e) => handleChange('autoplay', e.target.checked)}
                  />
                  ניגון אוטומטי
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedSection.controls !== false}
                    onChange={(e) => handleChange('controls', e.target.checked)}
                  />
                  הצג פקדי שליטה
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedSection.loop === true}
                    onChange={(e) => handleChange('loop', e.target.checked)}
                  />
                  ניגון בלולאה
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedSection.muted !== false}
                    onChange={(e) => handleChange('muted', e.target.checked)}
                  />
                  השתק (מומלץ לניגון אוטומטי)
                </label>
              </div>
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
                onClick={() => setIsProductPickerOpen(true)}
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
                        {(product.image_url || product.product_image) && (
                          <img 
                            src={getFullProductImageUrl(product.image_url || product.product_image)} 
                            alt={product.name} 
                            onError={(e) => {
                              console.error('Error loading image in property panel:', product.image_url || product.product_image);
                              e.target.src = "/builder/build/images/placeholders/no-image.jpg";
                            }}
                          />
                        )}
                      </div>
                      <div className="selected-item-info">
                        <span className="selected-item-name">{product.name}</span>
                        <div className="selected-item-details">
                          <span className="selected-item-price">
                            {product.is_on_sale ? (
                              <>
                                <span className="original-price">{product.price_formatted}</span>
                                <span className="sale-price">{product.sale_price_formatted}</span>
                              </>
                            ) : (
                              <span>{product.price_formatted || `₪${product.display_regular_price?.toFixed(2) || product.regular_price || '0.00'}`}</span>
                            )}
                          </span>
                          {product.product_type === 'variable' && (
                            <span className="product-type-badge" style={{
                              display: 'inline-block',
                              padding: '2px 6px',
                              borderRadius: '3px',
                              fontSize: '10px',
                              backgroundColor: '#f0f0f0',
                              color: '#666',
                              marginLeft: '5px'
                            }}>
                              וריאציות
                            </span>
                          )}
                          {product.badge_text && (
                            <span className="product-badge" style={{
                              display: 'inline-block',
                              padding: '2px 6px',
                              borderRadius: '3px',
                              fontSize: '10px',
                              backgroundColor: product.badge_color || '#000',
                              color: '#fff',
                              marginLeft: '5px'
                            }}>
                              {product.badge_text}
                            </span>
                          )}
                          {product.is_out_of_stock && (
                            <span className="out-of-stock-badge" style={{
                              display: 'inline-block',
                              padding: '2px 6px',
                              borderRadius: '3px',
                              fontSize: '10px',
                              backgroundColor: '#6c757d',
                              color: '#fff',
                              marginLeft: '5px'
                            }}>
                              אזל מהמלאי
                            </span>
                          )}
                        </div>
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
                onClick={() => setIsCategoryPickerOpen(true)}
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

  // פונקציות לעיצוב וסידור עבור סקשנים (המקוריות נשארו)
  const renderStyleTab = () => {
    const commonStyleControls = (
      <>
        <div className="property-group-title">טיפוגרפיה</div>
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
    switch (selectedSection.type) {
      case 'hero':
      case 'row':
        return (
          <>
            {commonStyleControls}
            <div className="property-group-title">רקע</div>
            <div className="property-group">
              <label className="property-label">צבע רקע</label>
              <ColorPicker
                value={selectedSection.backgroundColor || ''}
                onChange={(value) => handleChange('backgroundColor', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">תמונת רקע</label>
              <ImagePicker
                value={selectedSection.backgroundImage || ''}
                onChange={(value) => handleChange('backgroundImage', value)}
              />
            </div>
            <div className="property-group-title">עמודות</div>
            <div className="property-group">
              <label className="property-label">רדיוס פינות</label>
              <RangeSlider
                min={0}
                max={20}
                value={selectedSection.columnBorderRadius || 4}
                onChange={(value) => handleChange('columnBorderRadius', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">צל לעמודות</label>
              <SwitchControl
                checked={selectedSection.columnShadow === true}
                onChange={(checked) => handleChange('columnShadow', checked)}
              />
            </div>
          </>
        );
      case 'button':
        return (
          <>
            {commonStyleControls}
            <div className="property-group-title">עיצוב כפתור</div>
            <div className="property-group">
              <label className="property-label">צבע רקע כפתור</label>
              <ColorPicker
                value={selectedSection.buttonColor || '#5271ff'}
                onChange={(value) => handleChange('buttonColor', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">צבע טקסט</label>
              <ColorPicker
                value={selectedSection.buttonTextColor || '#ffffff'}
                onChange={(value) => handleChange('buttonTextColor', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">רדיוס פינות</label>
              <RangeSlider
                min={0}
                max={50}
                value={selectedSection.buttonBorderRadius || 4}
                onChange={(value) => handleChange('buttonBorderRadius', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">רוחב (פיקסלים)</label>
              <RangeSlider
                min={0}
                max={400}
                value={selectedSection.buttonWidth || 0}
                onChange={(value) => handleChange('buttonWidth', value)}
              />
              <small>0 = אוטומטי</small>
            </div>
            <div className="property-group">
              <label className="property-label">צל</label>
              <SwitchControl
                checked={selectedSection.buttonShadow === true}
                onChange={(checked) => handleChange('buttonShadow', checked)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">אפקט מעבר עכבר</label>
              <SelectControl
                options={[
                  { value: 'none', label: 'ללא' },
                  { value: 'lighten', label: 'הבהרה' },
                  { value: 'darken', label: 'הכהייה' },
                  { value: 'scale', label: 'הגדלה' },
                  { value: 'shadow', label: 'צל מוגבר' }
                ]}
                value={selectedSection.hoverEffect || 'none'}
                onChange={(value) => handleChange('hoverEffect', value)}
              />
            </div>
          </>
        );
      case 'image':
        return (
          <>
            {commonStyleControls}
            <div className="property-group-title">עיצוב תמונה</div>
            <div className="property-group">
              <label className="property-label">רדיוס פינות</label>
              <RangeSlider
                min={0}
                max={50}
                value={selectedSection.borderRadius || 0}
                onChange={(value) => handleChange('borderRadius', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">אטימות</label>
              <RangeSlider
                min={0}
                max={100}
                value={(selectedSection.opacity || 1) * 100}
                onChange={(value) => handleChange('opacity', value / 100)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">צל</label>
              <SwitchControl
                checked={selectedSection.shadow === true}
                onChange={(checked) => handleChange('shadow', checked)}
              />
            </div>
            {selectedSection.shadow && (
              <>
                <div className="property-group">
                  <label className="property-label">צבע צל</label>
                  <ColorPicker
                    value={selectedSection.shadowColor || 'rgba(0, 0, 0, 0.2)'}
                    onChange={(value) => handleChange('shadowColor', value)}
                  />
                </div>
                <div className="property-group">
                  <label className="property-label">עוצמת טשטוש</label>
                  <RangeSlider
                    min={0}
                    max={50}
                    value={selectedSection.shadowBlur || 10}
                    onChange={(value) => handleChange('shadowBlur', value)}
                  />
                </div>
              </>
            )}
            <div className="property-group">
              <label className="property-label">הגדלה בהצבעה</label>
              <SwitchControl
                checked={selectedSection.hoverZoom === true}
                onChange={(checked) => handleChange('hoverZoom', checked)}
              />
            </div>
            {selectedSection.hoverZoom && (
              <div className="property-group">
                <label className="property-label">מידת הגדלה</label>
                <RangeSlider
                  min={101}
                  max={150}
                  value={(selectedSection.zoomLevel || 1.05) * 100}
                  onChange={(value) => handleChange('zoomLevel', value / 100)}
                />
              </div>
            )}
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

  const renderSettingsTab = () => {
    return (
      <>
        <div className="property-group-title">זיהוי</div>
        <CustomIdentifiers 
          customId={selectedSection?.customId} 
          customClass={selectedSection?.customClass}
          onChange={handleChange}
        />
        <div className="property-group-title">ניראות במכשירים</div>
        <DeviceVisibilityControl 
          values={{
            showOnDesktop: selectedSection?.showOnDesktop !== false,
            showOnTablet: selectedSection?.showOnTablet !== false,
            showOnMobile: selectedSection?.showOnMobile !== false
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
            top: selectedSection?.marginTop || '',
            right: selectedSection?.marginRight || '',
            bottom: selectedSection?.marginBottom || '',
            left: selectedSection?.marginLeft || ''
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
            top: selectedSection?.paddingTop || '',
            right: selectedSection?.paddingRight || '',
            bottom: selectedSection?.paddingBottom || '',
            left: selectedSection?.paddingLeft || ''
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
          animation={selectedSection?.animation}
          duration={selectedSection?.animationDuration}
          delay={selectedSection?.animationDelay}
          onChange={handleChange}
        />
        <div className="property-actions">
          <button 
            className="duplicate-button"
            onClick={() => console.log('שכפול סקשן - יש לממש בהתאם')}
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

  // פונקציה חדשה לרינדור טאב תוכן עבור ווידג'טים בתוך עמודה
  const renderWidgetContentTab = (widget) => {
    switch (widget.type) {
      case 'button':
        return (
          <>
            <div className="property-group">
              <label className="property-label">טקסט כפתור</label>
              <input
                type="text"
                className="text-input"
                value={widget.buttonText || ''}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                placeholder="לדוגמה: לחץ כאן"
              />
            </div>
            <div className="property-group">
              <label className="property-label">קישור</label>
              <input
                type="text"
                className="text-input"
                value={widget.buttonLink || ''}
                onChange={(e) => handleChange('buttonLink', e.target.value)}
                placeholder="הכנס URL"
              />
            </div>
            <div className="property-group">
              <label className="property-label">יישור</label>
              <SelectControl
                options={[
                  { value: 'right', label: 'ימין' },
                  { value: 'center', label: 'מרכז' },
                  { value: 'left', label: 'שמאל' }
                ]}
                value={widget.alignment || 'center'}
                onChange={(value) => handleChange('alignment', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">סגנון</label>
              <SelectControl
                options={[
                  { value: 'filled', label: 'מלא' },
                  { value: 'outline', label: 'מתאר' },
                  { value: 'link', label: 'קישור' }
                ]}
                value={widget.buttonStyle || 'filled'}
                onChange={(value) => handleChange('buttonStyle', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">גודל</label>
              <SelectControl
                options={[
                  { value: 'small', label: 'קטן' },
                  { value: 'medium', label: 'בינוני' },
                  { value: 'large', label: 'גדול' }
                ]}
                value={widget.buttonSize || 'medium'}
                onChange={(value) => handleChange('buttonSize', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">פתיחה בחלון חדש</label>
              <SwitchControl
                checked={widget.openInNewTab === true}
                onChange={(checked) => handleChange('openInNewTab', checked)}
              />
            </div>
            {widget.shadow && (
              <>
                <div className="property-group">
                  <label className="property-label">צבע צל</label>
                  <ColorPicker
                    value={widget.shadowColor || 'rgba(0, 0, 0, 0.2)'}
                    onChange={(value) => handleChange('shadowColor', value)}
                  />
                </div>
                <div className="property-group">
                  <label className="property-label">עוצמת טשטוש</label>
                  <RangeSlider
                    min={0}
                    max={50}
                    value={widget.shadowBlur || 10}
                    onChange={(value) => handleChange('shadowBlur', value)}
                  />
                </div>
              </>
            )}
            <div className="property-group">
              <label className="property-label">הגדלה בהצבעה</label>
              <SwitchControl
                checked={widget.hoverZoom === true}
                onChange={(checked) => handleChange('hoverZoom', checked)}
              />
            </div>
            {widget.hoverZoom && (
              <div className="property-group">
                <label className="property-label">מידת הגדלה</label>
                <RangeSlider
                  min={101}
                  max={150}
                  value={(widget.zoomLevel || 1.05) * 100}
                  onChange={(value) => handleChange('zoomLevel', value / 100)}
                />
              </div>
            )}
          </>
        );
      case 'text':
        return (
          <>
            <div className="property-group-title">עיצוב</div>
            <div className="property-group">
              <label className="property-label">צבע כותרת</label>
              <ColorPicker
                value={widget.titleColor || '#202123'}
                onChange={(value) => handleChange('titleColor', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">צבע טקסט</label>
              <ColorPicker
                value={widget.contentColor || '#444444'}
                onChange={(value) => handleChange('contentColor', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">צבע רקע</label>
              <ColorPicker
                value={widget.backgroundColor || 'transparent'}
                onChange={(value) => handleChange('backgroundColor', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">מסגרת</label>
              <SwitchControl
                checked={widget.border === true}
                onChange={(checked) => handleChange('border', checked)}
              />
            </div>
            {widget.border && (
              <>
                <div className="property-group">
                  <label className="property-label">צבע מסגרת</label>
                  <ColorPicker
                    value={widget.borderColor || '#dddddd'}
                    onChange={(value) => handleChange('borderColor', value)}
                  />
                </div>
                <div className="property-group">
                  <label className="property-label">רדיוס פינות</label>
                  <RangeSlider
                    min={0}
                    max={20}
                    value={widget.borderRadius || 0}
                    onChange={(value) => handleChange('borderRadius', value)}
                  />
                </div>
              </>
            )}
            {widget.dropCap && (
              <div className="property-group">
                <label className="property-label">צבע אות פתיחה</label>
                <ColorPicker
                  value={widget.dropCapColor || widget.contentColor || '#444444'}
                  onChange={(value) => handleChange('dropCapColor', value)}
                />
              </div>
            )}
            <div className="property-group">
              <label className="property-label">צבע הדגשה</label>
              <ColorPicker
                value={widget.highlightColor || ''}
                onChange={(value) => handleChange('highlightColor', value)}
              />
            </div>
          </>
        );
      case 'video':
        return (
          <>
            <div className="property-group-title">עיצוב וידאו</div>
            <div className="property-group">
              <label className="property-label">רדיוס פינות</label>
              <RangeSlider
                min={0}
                max={20}
                value={widget.borderRadius || 0}
                onChange={(value) => handleChange('borderRadius', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">צל</label>
              <SwitchControl
                checked={widget.shadow === true}
                onChange={(checked) => handleChange('shadow', checked)}
              />
            </div>
            {widget.shadow && (
              <div className="property-group">
                <label className="property-label">צבע צל</label>
                <ColorPicker
                  value={widget.shadowColor || 'rgba(0, 0, 0, 0.2)'}
                  onChange={(value) => handleChange('shadowColor', value)}
                />
              </div>
            )}
            <div className="property-group">
              <label className="property-label">צבע כיתוב</label>
              <ColorPicker
                value={widget.captionColor || '#666'}
                onChange={(value) => handleChange('captionColor', value)}
              />
            </div>
          </>
        );
      default:
        return <div>אין הגדרות עיצוב זמינות עבור ווידג'ט זה</div>;
    }
  };

  // פונקציה חדשה לרינדור טאב Settings עבור ווידג'טים
  const renderWidgetSettingsTab = (widget) => {
    return (
      <>
        <div className="property-group-title">מרווחים</div>
        <SpacingControl 
          type="margin"
          values={{
            top: widget.marginTop || '',
            right: widget.marginRight || '',
            bottom: widget.marginBottom || '',
            left: widget.marginLeft || ''
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
            top: widget.paddingTop || '',
            right: widget.paddingRight || '',
            bottom: widget.paddingBottom || '',
            left: widget.paddingLeft || ''
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
          animation={widget.animation}
          duration={widget.animationDuration}
          delay={widget.animationDelay}
          onChange={handleChange}
        />
        <div className="property-actions">
          <button 
            className="delete-button"
            onClick={handleDelete}
          >
            <FiTrash2 /> מחק ווידג'ט
          </button>
        </div>
      </>
    );
  };

  // עדכון פונקציית renderTabContent בהתאם לווידג'ט או סקשן
  const renderTabContent = () => {
    if (activeTab === 'content') {
      if (selectedWidget) {
        return renderWidgetContentTab(selectedWidget);
      } else {
        return renderContentTab();
      }
    } else if (activeTab === 'style') {
      if (selectedWidget) {
        return renderWidgetContentTab(selectedWidget); // במידה ואין הגדרות עיצוב שונות לווידג'ט, אפשר להשתמש בלוגיקה דומה
      } else {
        return renderStyleTab();
      }
    } else if (activeTab === 'settings') {
      if (selectedWidget) {
        return renderWidgetSettingsTab(selectedWidget);
      } else {
        return renderSettingsTab();
      }
    }
  };

  // פונקציה לרינדור הטאבים (נשארה ללא שינוי)
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

  return (
    <div className="property-panel">
      <div className="panel-header">
        <h3>{getItemTitle()}</h3>
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
