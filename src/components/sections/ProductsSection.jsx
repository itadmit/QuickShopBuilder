import React from 'react';

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

  // לייצר תצוגה של מוצרים ריקים אם אין מוצרים שנבחרו
  const displayProducts = products.length > 0 
    ? products.slice(0, count) 
    : Array(count).fill(null);

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
    border: showBorder ? `1px solid ${borderColor || '#e4e6eb'}` : 'none'
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

  return (
    <div className="products-section" style={containerStyle}>
      <h2 className="section-title" style={titleStyle}>{title}</h2>
      <div className="products-grid" style={gridStyle}>
        {displayProducts.map((product, index) => (
          <div key={product ? product.id : `placeholder-${index}`} className="product-card" style={cardStyle}>
            <div className="product-image" style={imageContainerStyle}>
              {product?.image_url && (
                <img 
                  src={product.image_url} 
                  alt={product.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </div>
            <h3 className="product-title" style={productTitleStyle}>
              {product?.title || 'שם המוצר'}
            </h3>
            <div className="product-price" style={priceStyle}>
              {product?.price ? `₪${product.price}` : '₪00.00'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsSection;