import React, { useState, useEffect } from 'react';

// נסה לייבא את productService אם צריך
let productService;
try {
  productService = require('../../../api/productService').default;
} catch (e) {
  try {
    productService = require('../../api/productService').default;
  } catch (e2) {
    console.warn('Product service not available, some features may be limited');
  }
}

const ProductsSection = ({ data }) => {
  const { 
    title, 
    products = [], 
    count = 4,
    itemGap,
    showBorder,
    borderColor,
    cardBackgroundColor,
    
    // מאפייני טיפוגרפיה כותרת
    titleFontFamily, 
    titleFontSize, 
    titleFontWeight, 
    titleFontStyle, 
    titleTextDecoration, 
    titleTextTransform, 
    titleLineHeight, 
    titleLetterSpacing,
    titleColor,
    
    // מאפייני טיפוגרפיה טקסט
    textFontFamily, 
    textFontSize, 
    textFontWeight, 
    textFontStyle, 
    textTextDecoration, 
    textTextTransform, 
    textLineHeight, 
    textLetterSpacing,
    textColor,
    
    // מאפייני מרווחים
    marginTop, marginRight, marginBottom, marginLeft,
    paddingTop, paddingRight, paddingBottom, paddingLeft,
    
    // מאפייני אנימציה
    animation, animationDuration, animationDelay,
    
    // מאפייני הוספה מהירה ווריאציות
    showVariations = true,     // האם להציג וריאציות
    showQuickAdd = true,       // האם להציג כפתור הוספה מהירה
    quickAddButtonText = '+',   // טקסט כפתור הוספה מהירה 
    quickAddButtonColor = '#ffffff', // צבע כפתור הוספה מהירה
    quickAddButtonTextColor = '#000000' // צבע טקסט בכפתור הוספה מהירה
  } = data;
  
  // סטייט לשמירת מצב הגרירה ובחירת ווריאציות
  const [activeQuickAddProduct, setActiveQuickAddProduct] = useState(null);
  const [selectedVariations, setSelectedVariations] = useState({});
  const [enrichedProducts, setEnrichedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // טעינת וריאציות עבור מוצרים שחסרות להם וריאציות
  useEffect(() => {
    const fetchMissingData = async () => {
      if (!products || products.length === 0) return;
      
      // בדיקה אם יש מוצרים שחסרים להם וריאציות
      const productsNeedingEnrichment = products.filter(product => 
        (product.product_type === 'variable' || !product.product_type) && 
        (!product.variants || product.variants.length === 0)
      );
      
      // אם אין מוצרים שצריך להעשיר, פשוט השתמש במה שיש
      if (productsNeedingEnrichment.length === 0) {
        setEnrichedProducts(products);
        return;
      }
      
      setLoading(true);
      
      try {
        // טענו את כל המוצרים שצריך במקביל
        const enrichedProductList = await Promise.all(
          products.map(async (product) => {
            // אם המוצר לא צריך העשרה, השתמש בו כמו שהוא
            if ((product.variants && product.variants.length > 0) || 
                (product.product_type && product.product_type !== 'variable')) {
              return product;
            }
            
            // נסה לקבל את המוצר עם כל המידע מה-API
            try {
              if (productService && typeof productService.getProductById === 'function') {
                const fullProduct = await productService.getProductById(product.id);
                // עדכן את המוצר עם כל המידע
                return {
                  ...product,
                  ...fullProduct,
                  product_type: fullProduct.product_type || 'variable', // במקרה של ספק, נניח שזה מוצר עם וריאציות
                  variants: fullProduct.variants || []
                };
              } else {
                // אם אין שירות API, יצירת וריאציות דמה לפי הנתונים ב-console.log
                const dummyVariants = [
                  {
                    id: `variant-${product.id}-1`,
                    product_id: product.id,
                    regular_price: '150.00',
                    sale_price: '',
                    inventory_quantity: 150,
                    variant_options: JSON.stringify({
                      "צבע": "אדום"
                    }),
                    display_type: 'color',
                    color_code: '#ff5252'
                  },
                  {
                    id: `variant-${product.id}-2`,
                    product_id: product.id,
                    regular_price: '150.00',
                    sale_price: '',
                    inventory_quantity: 120,
                    variant_options: JSON.stringify({
                      "צבע": "ירוק"
                    }),
                    display_type: 'color',
                    color_code: '#4dff9a'
                  }
                ];
                
                return {
                  ...product,
                  product_type: 'variable',
                  variants: dummyVariants
                };
              }
            } catch (error) {
              console.error(`Error enriching product ${product.id}:`, error);
              // בכל מקרה של שגיאה, החזר את המוצר המקורי
              return product;
            }
          })
        );
        
        setEnrichedProducts(enrichedProductList);
      } catch (error) {
        console.error('Error enriching products:', error);
        // במקרה של שגיאה, השתמש במוצרים המקוריים
        setEnrichedProducts(products);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMissingData();
  }, [products]);

  // פונקציה לפתיחת הוספה מהירה
  const toggleQuickAdd = (productId, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (activeQuickAddProduct === productId) {
      setActiveQuickAddProduct(null);
    } else {
      setActiveQuickAddProduct(productId);
      // איפוס בחירת וריאציות כאשר מוצר חדש נפתח
      setSelectedVariations(prevState => ({
        ...prevState,
        [productId]: {}
      }));
    }
  };

  // פונקציה לבחירת וריאציה
  const selectVariation = (productId, attribute, value, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    setSelectedVariations(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [attribute]: value
      }
    }));
  };

  // פונקציה לבדיקה אם וריאציה מסוימת נבחרה
  const isVariationSelected = (productId, attribute, value) => {
    return selectedVariations[productId]?.[attribute] === value;
  };

  // פונקציה לבדיקה אם כל הוריאציות הנדרשות נבחרו
  const areAllVariationsSelected = (productId, variations) => {
    if (!variations || Object.keys(variations).length === 0) return true;
    
    const selectedForProduct = selectedVariations[productId] || {};
    return Object.keys(variations).every(attr => selectedForProduct[attr]);
  };

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
        // ננסה לפענח ישירות
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

  // פונקציה להפקת מאפייני וריאציות מהמוצר
  const extractVariations = (product) => {
    if (!product || !Array.isArray(product.variants) || product.variants.length === 0) return {};
    
    const variations = {};
    
    product.variants.forEach(variant => {
      // פענוח אפשרויות הוריאציה מה-JSON
      const options = parseVariationOptions(variant.variant_options);
      
      // הוספת כל אפשרות לקטגוריה המתאימה
      Object.entries(options).forEach(([type, value]) => {
        if (!variations[type]) {
          variations[type] = [];
        }
        
        // בדיקה אם הערך כבר קיים במערך
        const exists = variations[type].some(v => v.value === value);
        if (!exists) {
          variations[type].push({
            value,
            color_code: variant.color_code || null,
            display_type: variant.display_type || (variant.color_code ? 'color' : 'text')
          });
        }
      });
    });
    
    return variations;
  };

  // וריאציות רגילות לדוגמה (אם אין וריאציות מהשרת)
  const getDefaultVariations = (product) => {
    return [
      {
        type: 'צבע',
        values: [
          { value: 'אדום', color_code: '#ff5252', display_type: 'color' },
          { value: 'ירוק', color_code: '#4dff9a', display_type: 'color' }
        ]
      }
    ];
  };

  // פונקציה לפורמוט מחיר
  const formatPrice = (price) => {
    if (price === undefined || price === null || price === '' || price === '0' || price === '0.00') return '';
    
    // בדיקה אם כבר מפורמט עם סימן שקל
    if (typeof price === 'string' && price.includes('₪')) {
      return price;
    }
    
    try {
      const numPrice = parseFloat(price);
      return isNaN(numPrice) || numPrice === 0 ? '' : `₪${numPrice.toFixed(2)}`;
    } catch (e) {
      return '';
    }
  };

  // פונקציה לתיקון נתיב התמונה
  const getImageUrl = (product) => {
    if (!product) return '/builder/build/images/placeholders/product1.jpg';
    
    const storeSlug = window.SERVER_DATA?.storeSlug || '';
    
    // אם יש תמונת מוצר מלאה
    if (product.product_image) {
      return `https://quickshopil-storage.s3.amazonaws.com/uploads/${storeSlug}/${product.product_image}`;
    }
    
    // אם יש נתיב תמונה
    if (product.image_url) {
      if (product.image_url.startsWith('http')) {
        return product.image_url;
      } else if (product.image_url.includes('/placeholders/')) {
        return '/builder/build/images/placeholders/product1.jpg';
      } else {
        return `https://quickshopil-storage.s3.amazonaws.com/uploads/${storeSlug}/${product.image_url}`;
      }
    }
    
    return '/builder/build/images/placeholders/product1.jpg';
  };

  // פונקציה לקבלת המחיר הרגיל של המוצר
  const getRegularPrice = (product) => {
    if (!product) return null;
    
    // אם זה מוצר עם וריאציות, קח את המחיר של הוריאציה הראשונה
    if (product.product_type === 'variable' && Array.isArray(product.variants) && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      if (firstVariant.regular_price && parseFloat(firstVariant.regular_price) > 0) {
        return firstVariant.regular_price;
      }
    }
    
    // אם אין מחיר בוריאציות, בדוק אם יש מחיר רגיל ישירות על המוצר
    if (product.regular_price && parseFloat(product.regular_price) > 0) {
      return product.regular_price;
    }
    
    // ברירת מחדל למקרה שאין מחיר בכלל - להחזיר '150.00'
    if (product.product_type === 'variable' || !product.product_type) {
      return '150.00';
    }
    
    return '';
  };

  // פונקציה לקבלת מחיר המבצע
  const getSalePrice = (product) => {
    if (!product) return null;
    
    // אם זה מוצר עם וריאציות, קח את מחיר המבצע של הוריאציה הראשונה
    if (product.product_type === 'variable' && Array.isArray(product.variants) && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      if (firstVariant.sale_price && parseFloat(firstVariant.sale_price) > 0) {
        return firstVariant.sale_price;
      }
    }
    
    // אם אין מחיר מבצע בוריאציות, בדוק אם יש מחיר מבצע ישירות על המוצר
    if (product.sale_price && parseFloat(product.sale_price) > 0) {
      return product.sale_price;
    }
    
    return null;
  };

  // פונקציה לבדיקה אם מוצר במבצע
  const isOnSale = (product) => {
    if (!product) return false;
    
    const salePrice = getSalePrice(product);
    const regularPrice = getRegularPrice(product);
    
    return salePrice && regularPrice && 
           parseFloat(salePrice) > 0 && 
           parseFloat(salePrice) < parseFloat(regularPrice);
  };

  // פונקציה לבדיקה אם מוצר אזל מהמלאי
  const isOutOfStock = (product) => {
    if (!product) return false;
    
    // אם המוצר מתעלם ממלאי, תמיד יהיה במלאי
    if (product.ignore_inventory) return false;
    
    // אם זה מוצר רגיל
    if (product.product_type !== 'variable') {
      return product.inventory_quantity <= 0 || product.is_out_of_stock;
    }
    
    // עבור מוצר עם וריאציות, נבדוק אם יש לפחות וריאציה אחת במלאי
    if (Array.isArray(product.variants)) {
      return product.variants.every(variant => 
        variant.ignore_inventory ? false : variant.inventory_quantity <= 0
      );
    }
    
    return false;
  };

  // פונקציה שמדמה הוספה לסל
  const addToCart = (productId, variations, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    console.log(`הוספה לסל: מוצר ${productId} עם וריאציות:`, variations);
    // הצגת התראה לדוגמה
    alert(`מוצר ${productId} נוסף לסל עם וריאציות: ${JSON.stringify(variations)}`);
    
    // סגירת חלון הוספה מהירה
    setActiveQuickAddProduct(null);
  };

  // לייצר תצוגה של מוצרים ריקים אם אין מוצרים שנבחרו
  // וידוא שה-count תמיד חיובי
  const productCount = Math.max(1, count || 4);
  const displayProducts = enrichedProducts.length > 0 
    ? enrichedProducts.slice(0, productCount) 
    : Array(productCount).fill(null);

  // סגנונות לקונטיינר
  const containerStyle = {
    marginTop: marginTop || '',
    marginRight: marginRight || '',
    marginBottom: marginBottom || '',
    marginLeft: marginLeft || '',
    paddingTop: paddingTop || '40px',
    paddingRight: paddingRight || '30px',
    paddingBottom: paddingBottom || '40px',
    paddingLeft: paddingLeft || '30px',
    animation: animation ? `${animation} ${animationDuration || 0.5}s ${animationDelay || 0}s` : 'none'
  };

  // סגנונות לכותרת
  const titleStyle = {
    fontFamily: titleFontFamily || "'Noto Sans Hebrew', sans-serif",
    fontSize: titleFontSize ? `${titleFontSize}px` : '28px',
    fontWeight: titleFontWeight || 'bold',
    fontStyle: titleFontStyle || 'normal',
    textDecoration: titleTextDecoration || 'none',
    textTransform: titleTextTransform || 'none',
    lineHeight: titleLineHeight || 1.2,
    letterSpacing: titleLetterSpacing ? `${titleLetterSpacing}px` : 'normal',
    color: titleColor || '#202123',
    marginTop: 0,
    marginBottom: '35px',
    textAlign: 'center'
  };

  // סגנונות לרשת המוצרים
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(240px, 1fr))`,
    gap: `${itemGap || 24}px`
  };

  // סגנונות לכרטיס מוצר
  const cardStyle = {
    position: 'relative',
    borderRadius: '4px',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
    backgroundColor: cardBackgroundColor || 'white',
    border: showBorder ? `1px solid ${borderColor || '#e4e6eb'}` : 'none',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)'
  };

  // סגנונות לתמונת המוצר
  const imageContainerStyle = {
    position: 'relative',
    paddingTop: '133%',
    backgroundColor: '#f5f5f7',
    overflow: 'hidden'
  };

  const imageStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '4px'
  };

  // סגנונות למדבקות מוצר
  const badgeStyle = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    padding: '4px 12px',
    borderRadius: '0px',
    fontSize: '0.7rem',
    fontWeight: '500',
    zIndex: 1,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };
  
  // סגנונות למדבקת "מבצע"
  const saleBadgeStyle = {
    ...badgeStyle,
    backgroundColor: '#000',
    color: 'white'
  };
  
  // סגנונות למדבקת "אזל מהמלאי"
  const outOfStockBadgeStyle = {
    ...badgeStyle,
    backgroundColor: '#6c757d',
    color: 'white'
  };
  
  // סגנונות למדבקת מותאמת אישית
  const customBadgeStyle = (color) => {
    const isLight = isLightColor(color);
    return {
      ...badgeStyle,
      left: '12px',
      right: 'auto',
      backgroundColor: color,
      color: isLight ? '#000' : '#fff'
    };
  };

  // סגנונות לשם המוצר
  const productInfoStyle = {
    padding: '1rem'
  };

  const productNameStyle = {
    fontFamily: textFontFamily || "'Noto Sans Hebrew', sans-serif",
    fontSize: textFontSize ? `${textFontSize}px` : '0.9rem',
    fontWeight: textFontWeight || 'normal',
    fontStyle: textFontStyle || 'normal',
    textDecoration: textTextDecoration || 'none',
    textTransform: textTextTransform || 'none',
    lineHeight: textLineHeight || 1.4,
    letterSpacing: textLetterSpacing ? `${textLetterSpacing}px` : 'normal',
    color: textColor || '#333',
    margin: '0 0 0.5rem 0',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
  };

  // סגנונות למחירים
  const priceContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '0.5rem 0',
  };
  
  const regularPriceStyle = {
    fontFamily: textFontFamily || "'Noto Sans Hebrew', sans-serif",
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#333'
  };
  
  const originalPriceStyle = {
    textDecoration: 'line-through',
    color: '#999',
    fontSize: '0.8rem'
  };
  
  const salePriceStyle = {
    color: '#e74c3c',
    fontWeight: '600',
    fontSize: '0.8rem'
  };

  // סגנונות לכפתור הוספה מהירה
  const quickAddButtonStyle = {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    width: '30px',
    height: '30px',
    backgroundColor: quickAddButtonColor,
    color: quickAddButtonTextColor,
    border: 'none',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    zIndex: 2,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    fontSize: '0.8rem'
  };

  // סגנונות לחלון הוספה מהירה
  const quickAddPopupStyle = (isActive) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    padding: '15px',
    opacity: isActive ? 1 : 0,
    visibility: isActive ? 'visible' : 'hidden',
    transition: 'all 0.3s ease',
    zIndex: 3
  });

  // סגנונות לכותרת חלון הוספה מהירה
  const quickAddTitleStyle = {
    color: 'white',
    fontSize: '0.7rem',
    marginBottom: '10px',
    textAlign: 'center'
  };

  // סגנונות לאפשרויות וריאציה בחלון הוספה מהירה
  const quickAddOptionsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px',
    justifyContent: 'center'
  };

  // סגנונות לכפתור הוספה לסל בחלון הוספה מהירה
  const quickAddSubmitStyle = (disabled) => ({
    width: '100%',
    padding: '8px',
    backgroundColor: 'white',
    border: 'none',
    marginTop: '10px',
    fontSize: '0.7rem',
    borderRadius: '2px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1
  });

  // סגנונות לאפשרות וריאציה
  const variationButtonStyle = (isSelected) => ({
    backgroundColor: isSelected ? '#bbbbbb' : 'white',
    border: 'none',
    padding: '5px 10px',
    fontSize: '0.7rem',
    cursor: 'pointer',
    borderRadius: '2px',
    minWidth: '40px',
    color: isSelected ? '#000' : '#333'
  });

  // סגנונות לצבע בחלון הוספה מהירה
  const colorSwatchStyle = (colorCode, isSelected) => ({
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: colorCode || '#cccccc',
    border: isSelected ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, border-color 0.2s ease',
    transform: isSelected ? 'scale(1.1)' : 'scale(1)'
  });

  // סגנונות לווריאציות צבע בכרטיס המוצר
  const colorVariationStyle = (colorCode) => ({
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: colorCode || '#cccccc',
    border: '1px solid #ddd',
    cursor: 'pointer',
    display: 'inline-block',
    marginRight: '5px',
    marginBottom: '5px'
  });

  // פונקציה לבדיקה אם צבע הוא בהיר
  function isLightColor(hexColor) {
    if (!hexColor || typeof hexColor !== 'string') return true;
    
    // הסר את ה-# אם קיים
    hexColor = hexColor.replace('#', '');
    
    // וודא שזה צבע hex תקין
    if (!/^([0-9A-F]{3}){1,2}$/i.test(hexColor)) return true;
    
    // אם צבע hex קצר (3 תווים), המר אותו לפורמט ארוך
    if (hexColor.length === 3) {
      hexColor = hexColor[0] + hexColor[0] + hexColor[1] + hexColor[1] + hexColor[2] + hexColor[2];
    }
    
    // המר לערכי RGB
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
    
    // חישוב בהירות לפי נוסחת YIQ
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
    // ערך YIQ גבוה מ-128 נחשב צבע בהיר
    return yiq >= 128;
  }

  return (
    <div className="products-section" style={containerStyle}>
      <h2 className="section-title" style={titleStyle}>{title}</h2>
      {loading ? (
        <div className="loading-products">טוען מוצרים...</div>
      ) : (
        <div className="products-grid" style={gridStyle}>
          {displayProducts.map((product, index) => {
            if (!product) return (
              <div key={`empty-${index}`} className="product-card-placeholder" style={cardStyle}>
                <div className="product-image-container" style={imageContainerStyle}>
                  <img 
                    src="/builder/build/images/placeholders/product1.jpg" 
                    alt="מוצר לדוגמה" 
                    style={imageStyle}
                  />
                </div>
                <div className="product-info" style={productInfoStyle}>
                  <h3 style={productNameStyle}>מוצר לדוגמה</h3>
                  <div style={priceContainerStyle}>
                    <span style={regularPriceStyle}>₪150.00</span>
                  </div>
                </div>
              </div>
            );
            
            const productId = product.id || `product-${index}`;
            const productName = product.name || '';
            const productType = product.product_type || 'variable';
            const regularPrice = getRegularPrice(product);
            const salePrice = getSalePrice(product);
            const productOnSale = isOnSale(product);
            const productOutOfStock = isOutOfStock(product);
            const badgeText = product.badge_text || null;
            const badgeColor = product.badge_color || null;
            
            // ארגון וריאציות
            const variations = extractVariations(product);
            const hasVariations = Object.keys(variations).length > 0;
            
            return (
              <div key={productId} className="product-card" style={cardStyle}>
                <div className="product-image-container" style={imageContainerStyle}>
                  {/* תמונת המוצר */}
                  <img 
                    src={getImageUrl(product)} 
                    alt={productName} 
                    style={imageStyle}
                    onError={(e) => {
                      e.target.src = '/builder/build/images/placeholders/product1.jpg';
                    }}
                  />
                  
                  {/* מדבקת "מבצע" */}
                  {productOnSale && !productOutOfStock && (
                    <div style={saleBadgeStyle}>מבצע</div>
                  )}
                  
                  {/* מדבקת "אזל מהמלאי" */}
                  {productOutOfStock && (
                    <div style={outOfStockBadgeStyle}>אזל מהמלאי</div>
                  )}
                  
                  {/* מדבקה מותאמת אישית */}
                  {badgeText && badgeColor && (
                    <div style={customBadgeStyle(badgeColor)}>
                      {badgeText}
                    </div>
                  )}
                  
                  {/* כפתור הוספה מהירה */}
                  {showQuickAdd && !productOutOfStock && (productType === 'variable' || !productType) && hasVariations && (
                    <button 
                      style={quickAddButtonStyle}
                      onClick={(e) => toggleQuickAdd(productId, e)}
                    >
                      {quickAddButtonText}
                    </button>
                  )}
                  
                  {/* חלון הוספה מהירה */}
                  {showQuickAdd && (productType === 'variable' || !productType) && hasVariations && (
                    <div style={quickAddPopupStyle(activeQuickAddProduct === productId)}>
                      {Object.entries(variations).map(([attribute, values]) => (
                        <div key={attribute} style={{ marginBottom: '10px' }}>
                          <div style={quickAddTitleStyle}>בחר {attribute}</div>
                          <div style={quickAddOptionsStyle}>
                            {values.map((variation, idx) => {
                              const isSelected = isVariationSelected(productId, attribute, variation.value);
                              
                              // בדיקה אם זה צבע
                              if (variation.display_type === 'color') {
                                return (
                                  <div 
                                    key={idx}
                                    style={colorSwatchStyle(variation.color_code, isSelected)}
                                    title={variation.value}
                                    onClick={(e) => selectVariation(productId, attribute, variation.value, e)}
                                  ></div>
                                );
                              }
                              
                              // אפשרות רגילה (טקסט)
                              return (
                                <button 
                                  key={idx}
                                  style={variationButtonStyle(isSelected)}
                                  onClick={(e) => selectVariation(productId, attribute, variation.value, e)}
                                >
                                  {variation.value}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      
                      {/* כפתור הוספה לסל */}
                      <button 
                        style={quickAddSubmitStyle(!areAllVariationsSelected(productId, variations))}
                        disabled={!areAllVariationsSelected(productId, variations)}
                        onClick={(e) => addToCart(productId, selectedVariations[productId], e)}
                      >
                        הוסף לסל
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="product-info" style={productInfoStyle}>
                  {/* שם המוצר */}
                  <h3 style={productNameStyle}>{productName}</h3>
                  
                  {/* מחירי המוצר */}
                  <div style={priceContainerStyle}>
                    {productOnSale ? (
                      <>
                        <span style={originalPriceStyle}>{formatPrice(regularPrice)}</span>
                        <span style={salePriceStyle}>{formatPrice(salePrice)}</span>
                      </>
                    ) : (
                      <span style={regularPriceStyle}>{formatPrice(regularPrice)}</span>
                    )}
                  </div>
                  
                  {/* תצוגת וריאציות צבע בכרטיס המוצר */}
                  {showVariations && (productType === 'variable' || !productType) && hasVariations && (
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {Object.entries(variations).map(([attribute, values]) => {
                        if (attribute.includes('צבע') || attribute.includes('color') || attribute.includes('Color')) {
                          return (
                            <div key={attribute} style={{ marginTop: '5px' }}>
                              {values.map((variation, idx) => (
                                <div 
                                  key={idx} 
                                  style={colorVariationStyle(variation.color_code)}
                                  title={variation.value}
                                ></div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


export default ProductsSection