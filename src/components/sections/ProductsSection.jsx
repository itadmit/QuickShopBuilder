import React, { useEffect, useState } from 'react';

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
    animation, animationDuration, animationDelay
  } = data;
  
  // מצב לשמירת מחירי וריאציות שנטענו
  const [processedProducts, setProcessedProducts] = useState([]);

  // פונקציה להתאמת נתיב התמונה - מוסיפה את ה-base URL החסר
  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return '/builder/build/images/placeholders/no-image.jpg';
    
    // אם זו כבר URL מלאה, החזר אותה כמו שהיא
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // אם זה נתיב יחסי מהפרויקט שלנו
    if (imageUrl.startsWith('/')) {
      return imageUrl;
    }
    
    // אחרת, זהו רק שם הקובץ - נוסיף את ה-base URL
    const storeSlug = window.SERVER_DATA?.storeSlug || 'yogev';
    return `https://quickshopil-storage.s3.amazonaws.com/uploads/${storeSlug}/${imageUrl}`;
  };
  
  // פונקציה לקביעת צבע טקסט בהתאם לצבע הרקע
  const getTextColor = (hexColor) => {
    if (!hexColor || hexColor.length < 7) return '#fff';
    
    // המרת hex צבע לערכי RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    
    // חישוב בהירות הצבע (נוסחת YIQ)
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
    // אם בהיר, החזר טקסט שחור, אחרת לבן
    return yiq >= 128 ? '#000' : '#fff';
  };

  // פונקציה לעיבוד וריאציות ומחירים של מוצרים
  const processProductPrices = (productList) => {
    return productList.map(product => {
      // אם המוצר כבר מעובד עם מחירים ווריאציות, נשאיר אותו כפי שהוא
      if (product?.processedWithVariants) {
        return product;
      }

      let minRegularPrice = product?.regular_price || 0;
      let minSalePrice = product?.sale_price || 0;
      let hasVariations = product?.product_type === 'variable';
      let isOnSale = false;

      // אם יש וריאציות למוצר
      if (hasVariations && product?.variations) {
        // מצא את המחיר המינימלי מבין כל הוריאציות
        Object.values(product.variations || {}).forEach(variants => {
          variants.forEach(variant => {
            // קביעת מחיר רגיל מינימלי
            if (variant.regular_price && (minRegularPrice === 0 || variant.regular_price < minRegularPrice)) {
              minRegularPrice = parseFloat(variant.regular_price);
            }
            
            // קביעת מחיר מבצע מינימלי
            if (variant.sale_price && (minSalePrice === 0 || variant.sale_price < minSalePrice)) {
              minSalePrice = parseFloat(variant.sale_price);
              isOnSale = true;
            }
          });
        });
      }

      // אם יש מחיר מבצע והוא נמוך יותר, סמן שהמוצר במבצע
      if (minSalePrice > 0 && minSalePrice < minRegularPrice) {
        isOnSale = true;
      } else if (minSalePrice === 0 || minSalePrice >= minRegularPrice) {
        // אם אין מחיר מבצע או שהוא גבוה יותר, אפס אותו
        minSalePrice = 0;
        isOnSale = false;
      }

      // פורמט מחירים
      const formattedRegularPrice = minRegularPrice ? `₪${minRegularPrice.toFixed(2)}` : '₪0.00';
      const formattedSalePrice = minSalePrice ? `₪${minSalePrice.toFixed(2)}` : '';

      // החזר מוצר מעודכן עם מחירים ומידע על מבצע
      return {
        ...product,
        processedWithVariants: true,
        display_regular_price: minRegularPrice,
        display_sale_price: isOnSale ? minSalePrice : 0,
        price_formatted: formattedRegularPrice,
        sale_price_formatted: formattedSalePrice,
        is_on_sale: isOnSale
      };
    });
  };

  // עדכון מוצרים בעת טעינה
  useEffect(() => {
    if (validProducts.length > 0) {
      console.log("Before processing:", validProducts);
      const processed = processProductPrices(validProducts);
      console.log("After processing:", processed);
      setProcessedProducts(processed);
    } else {
      setProcessedProducts([]);
    }
  }, [products]);

  // בדיקה וניקוי נתוני המוצרים
  const validProducts = Array.isArray(products) ? products : [];
  
  console.log("ProductsSection: ", {
    title,
    productsLength: validProducts.length,
    count,
    sampleProduct: validProducts[0] || 'No products'
  });

  // לייצר תצוגה של מוצרים ריקים אם אין מוצרים שנבחרו
  // וידוא שה-count תמיד חיובי
  const productCount = Math.max(1, count || 4);
  const displayProducts = processedProducts.length > 0 
    ? processedProducts.slice(0, productCount) 
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
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    backgroundColor: cardBackgroundColor || 'white',
    border: showBorder ? `1px solid ${borderColor || '#e4e6eb'}` : 'none',
    position: 'relative' // חשוב לתגיות מיקום אבסולוטיות
  };

  // סגנונות לתמונת המוצר
  const imageContainerStyle = {
    width: '100%',
    height: '220px',
    backgroundColor: '#f5f5f7',
    overflow: 'hidden',
    position: 'relative'
  };

  // סגנונות לשם המוצר
  const productTitleStyle = {
    fontFamily: textFontFamily || "'Noto Sans Hebrew', sans-serif",
    fontSize: textFontSize ? `${textFontSize}px` : '16px',
    fontWeight: textFontWeight || '600',
    fontStyle: textFontStyle || 'normal',
    textDecoration: textTextDecoration || 'none',
    textTransform: textTextTransform || 'none',
    lineHeight: textLineHeight || 1.4,
    letterSpacing: textLetterSpacing ? `${textLetterSpacing}px` : 'normal',
    color: textColor || '#202123',
    padding: '14px 18px 6px',
    margin: 0
  };

  // סגנונות למחיר המוצר
  const priceStyle = {
    fontFamily: textFontFamily || "'Noto Sans Hebrew', sans-serif",
    fontSize: textFontSize ? `${textFontSize}px` : '18px',
    fontWeight: '700',
    color: '#5271ff',
    padding: '0 18px 18px',
    margin: 0
  };
  
  // סגנונות למדבקות
  const badgeStyle = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: '#000',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '0px',
    fontSize: '0.7rem',
    fontWeight: '500',
    zIndex: 1,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };
  
  const outOfStockBadgeStyle = {
    ...badgeStyle,
    backgroundColor: '#6c757d',
    right: '12px'
  };
  
  const saleBadgeStyle = {
    ...badgeStyle,
    right: '12px'
  };
  
  const customBadgeStyle = (color) => ({
    ...badgeStyle,
    backgroundColor: color || '#000',
    color: getTextColor(color),
    left: '12px',
    right: 'auto'
  });
  
  // סגנונות לעיגולי צבע
  const colorSwatchStyle = {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '1px solid #ddd',
    cursor: 'pointer',
    display: 'inline-block',
    margin: '0 3px 5px 0'
  };
  
  const variantImageStyle = {
    width: '30px',
    height: '30px',
    border: '1px solid #eee',
    borderRadius: '4px',
    overflow: 'hidden',
    display: 'inline-block',
    margin: '0 3px 5px 0'
  };
  
  const variationGroupStyle = {
    display: 'flex',
    gap: '5px',
    flexWrap: 'wrap'
  };

  return (
    <div className="products-section" style={containerStyle}>
      <h2 className="section-title" style={titleStyle}>{title}</h2>
      <div className="products-grid" style={gridStyle}>
        {displayProducts.map((product, index) => (
          <div key={product ? product.id : `placeholder-${index}`} className="product-card" style={cardStyle}>
            {/* תגיות ומדבקות */}
            {product?.is_out_of_stock && (
              <div style={outOfStockBadgeStyle}>אזל מהמלאי</div>
            )}
            
            {product?.is_on_sale && (
              <div style={saleBadgeStyle}>מבצע</div>
            )}
            
            {product?.badge_text && product?.badge_color && (
              <div style={customBadgeStyle(product.badge_color)}>
                {product.badge_text}
              </div>
            )}
            
            <div className="product-image-container" style={imageContainerStyle}>
              <img 
                src={getFullImageUrl(product?.image_url || product?.product_image)} 
                alt={product?.name || product?.title || 'מוצר'} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  console.error('Error loading image:', product?.image_url || product?.product_image);
                  e.target.src = "/builder/build/images/placeholders/no-image.jpg";
                }}
              />
            </div>
            
            <div className="product-info">
              <h3 className="product-title" style={productTitleStyle}>
                {product?.name || product?.title || 'שם המוצר'}
              </h3>
              
              <div className="product-price" style={priceStyle}>
                {product?.is_on_sale ? (
                  <>
                    <span style={{textDecoration: 'line-through', marginLeft: '8px', fontSize: '14px', color: '#65676b'}}>
                      {product.price_formatted || `₪${product.display_regular_price?.toFixed(2) || '0.00'}`}
                    </span>
                    <span style={{color: '#ff5252'}}>
                      {product.sale_price_formatted || `₪${product.display_sale_price?.toFixed(2) || '0.00'}`}
                    </span>
                  </>
                ) : (
                  <span>
                    {product?.price_formatted || 
                     (product?.display_regular_price ? `₪${product.display_regular_price?.toFixed(2)}` : 
                      (product?.regular_price ? `₪${product.regular_price?.toFixed(2)}` : '₪0.00'))}
                  </span>
                )}
              </div>
              
              {/* תצוגת וריאציות */}
              {product?.product_type === 'variable' && product?.variations && (
                <div className="product-variations" style={{ marginTop: '10px' }}>
                  {Object.entries(product.variations || {}).map(([type, variants]) => {
                    // תצוגת צבעים
                    if (type.toLowerCase() === 'צבע' || type.toLowerCase() === 'color') {
                      return (
                        <div key={type} style={variationGroupStyle}>
                          {variants.map((variant, idx) => {
                            if (variant.display_type === 'color') {
                              return (
                                <div 
                                  key={idx}
                                  style={{
                                    ...colorSwatchStyle, 
                                    backgroundColor: variant.color_code || '#ccc'
                                  }}
                                  title={variant.value}
                                />
                              );
                            } else if (variant.display_type === 'image' && variant.variant_image) {
                              return (
                                <div key={idx} style={variantImageStyle}>
                                  <img 
                                    src={getFullImageUrl(variant.variant_image)}
                                    alt={variant.value}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsSection;