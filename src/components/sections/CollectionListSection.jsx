import React from 'react';

const CollectionListSection = ({ data }) => {
  const { 
    title, 
    collections = [], 
    count = 3,
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
  
  // לייצר תצוגה של קטגוריות ריקות אם אין קטגוריות שנבחרו
  const displayCollections = collections.length > 0 
    ? collections.slice(0, count) 
    : Array(count).fill(null);

  // סגנונות לקונטיינר
  const containerStyle = {
    marginTop: marginTop || '',
    marginRight: marginRight || '',
    marginBottom: marginBottom || '',
    marginLeft: marginLeft || '',
    paddingTop: paddingTop || '50px',
    paddingRight: paddingRight || '30px',
    paddingBottom: paddingBottom || '50px',
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

  // סגנונות לרשת הקטגוריות
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(320px, 1fr))`,
    gap: `${itemGap || 24}px`
  };

  // סגנונות לכרטיס קטגוריה
// סגנונות לכרטיס קטגוריה
const cardStyle = {
  position: 'relative',
  height: '200px',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  backgroundColor: cardBackgroundColor || 'white',
  border: showBorder ? `1px solid ${borderColor || '#e4e6eb'}` : 'none'
};

// סגנונות לתמונת הקטגוריה
const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s'
};

// סגנונות לכותרת הקטגוריה
const collectionTitleStyle = {
  fontFamily: textFontFamily || "'Noto Sans Hebrew', sans-serif",
  fontSize: textFontSize ? `${textFontSize}px` : '18px',
  fontWeight: textFontWeight || 'bold',
  fontStyle: textFontStyle || 'normal',
  textDecoration: textTextDecoration || 'none',
  textTransform: textTextTransform || 'none',
  lineHeight: textLineHeight || 1.4,
  letterSpacing: textLetterSpacing ? `${textLetterSpacing}px` : 'normal',
  color: textColor || 'white',
  position: 'absolute',
  bottom: 0,
  right: 0,
  left: 0,
  margin: 0,
  padding: '15px',
  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
  textAlign: 'center'
};

return (
  <div className="collection-list-section" style={containerStyle}>
    <h2 style={titleStyle}>{title}</h2>
    <div className="collections-grid" style={gridStyle}>
      {displayCollections.map((collection, index) => (
        <div key={collection ? collection.id : `placeholder-${index}`} className="collection-card" style={cardStyle}>
          <div className="collection-image">
            {collection?.image_url && (
              <img src={collection.image_url} alt={collection.title} style={imageStyle} />
            )}
          </div>
          <h3 style={collectionTitleStyle}>{collection ? collection.title : 'שם קטגוריה לדוגמה'}</h3>
        </div>
      ))}
    </div>
  </div>
);
};

export default CollectionListSection;