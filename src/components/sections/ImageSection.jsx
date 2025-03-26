import React from 'react';

const ImageSection = ({ data }) => {
  const { 
    title,
    image,
    altText = '',
    linkUrl = '',
    imageWidth,
    borderRadius,
    
    // מאפייני יישור
    alignment = 'center',
    
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
    
    // מאפייני מרווחים
    marginTop, marginRight, marginBottom, marginLeft,
    paddingTop, paddingRight, paddingBottom, paddingLeft,
    
    // מאפייני אנימציה
    animation, animationDuration, animationDelay,
    
    // אפקטים
    shadow,
    shadowColor,
    shadowBlur,
    shadowOffset,
    
    // מאפייני הגדלה בהצבעה
    hoverZoom = false,
    zoomLevel = 1.05,
    
    // אפקט אופקי
    opacity = 1
  } = data;

  // סגנונות לקונטיינר
  const containerStyle = {
    marginTop: marginTop || '',
    marginRight: marginRight || '',
    marginBottom: marginBottom || '',
    marginLeft: marginLeft || '',
    paddingTop: paddingTop || '20px',
    paddingRight: paddingRight || '30px',
    paddingBottom: paddingBottom || '20px',
    paddingLeft: paddingLeft || '30px',
    textAlign: alignment,
    animation: animation ? `${animation} ${animationDuration || 0.5}s ${animationDelay || 0}s` : 'none'
  };

  // סגנונות לכותרת
  const titleStyle = {
    fontFamily: titleFontFamily || "'Noto Sans Hebrew', sans-serif",
    fontSize: titleFontSize ? `${titleFontSize}px` : '22px',
    fontWeight: titleFontWeight || 'bold',
    fontStyle: titleFontStyle || 'normal',
    textDecoration: titleTextDecoration || 'none',
    textTransform: titleTextTransform || 'none',
    lineHeight: titleLineHeight || 1.2,
    letterSpacing: titleLetterSpacing ? `${titleLetterSpacing}px` : 'normal',
    color: titleColor || '#202123',
    marginTop: 0,
    marginBottom: title ? '15px' : 0,
    textAlign: alignment
  };

  // סגנונות למכל התמונה
  const imageContainerStyle = {
    display: 'inline-block',
    maxWidth: imageWidth ? `${imageWidth}px` : '100%',
    width: imageWidth ? `${imageWidth}px` : '100%',
    margin: '0 auto',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: borderRadius ? `${borderRadius}px` : '0',
    boxShadow: shadow ? `${shadowOffset || 5}px ${shadowOffset || 5}px ${shadowBlur || 10}px ${shadowColor || 'rgba(0,0,0,0.2)'}` : 'none',
    transition: 'transform 0.3s ease',
    cursor: linkUrl ? 'pointer' : 'default',
  };

  // סגנונות לתמונה עצמה
  const imageStyle = {
    display: 'block',
    width: '100%',
    opacity: opacity,
    transition: 'transform 0.3s ease',
    transform: 'scale(1)',
  };

  // סגנונות למכל התמונה כאשר עומדים עליה עם העכבר
  const imageContainerHoverStyle = {
    ...imageContainerStyle,
    ':hover img': {
      transform: hoverZoom ? `scale(${zoomLevel})` : 'scale(1)'
    }
  };

  // רינדור התמונה עם או בלי קישור
  const renderImage = () => {
    const img = (
      <img 
        src={image || '/builder/build/images/placeholders/image-placeholder.jpg'} 
        alt={altText} 
        style={imageStyle}
        className={hoverZoom ? 'hover-zoom-image' : ''}
      />
    );

    // אם יש URL, עוטפים את התמונה בקישור
    if (linkUrl) {
      return (
        <a href={linkUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
          {img}
        </a>
      );
    }

    return img;
  };

  return (
    <div className="image-section" style={containerStyle}>
      {title && <h2 className="section-title" style={titleStyle}>{title}</h2>}
      
      <div 
        className={`image-container ${hoverZoom ? 'hover-zoom' : ''}`} 
        style={imageContainerStyle}
      >
        {renderImage()}
      </div>
      
      {/* CSS בשורת סגנון נפרדת כדי להוסיף את אפקט ההגדלה באמצעות סלקטור CSS רגיל */}
      {hoverZoom && (
        <style>
          {`
          .hover-zoom:hover .hover-zoom-image {
            transform: scale(${zoomLevel});
          }
          `}
        </style>
      )}
    </div>
  );
};

export default ImageSection;