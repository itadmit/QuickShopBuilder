import React from 'react';

const TextWithImageSection = ({ data }) => {
  const { 
    title, 
    content, 
    image, 
    imagePosition = 'right',
    imageWidth,
    
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
    display: 'flex',
    flexDirection: imagePosition === 'right' ? 'row' : 'row-reverse',
    gap: '40px',
    alignItems: 'center',
    animation: animation ? `${animation} ${animationDuration || 0.5}s ${animationDelay || 0}s` : 'none'
  };

  // סגנונות לחלק הטקסט
  const textContainerStyle = {
    flex: 1
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
    marginBottom: '20px'
  };

  // סגנונות לטקסט
  const contentStyle = {
    fontFamily: textFontFamily || "'Noto Sans Hebrew', sans-serif",
    fontSize: textFontSize ? `${textFontSize}px` : '16px',
    fontWeight: textFontWeight || 'normal',
    fontStyle: textFontStyle || 'normal',
    textDecoration: textTextDecoration || 'none',
    textTransform: textTextTransform || 'none',
    lineHeight: textLineHeight || 1.6,
    letterSpacing: textLetterSpacing ? `${textLetterSpacing}px` : 'normal',
    color: textColor || '#65676b',
    margin: 0
  };

  // סגנונות לתמונה
  const imageContainerStyle = {
    flex: imageWidth ? `0 0 ${imageWidth}%` : '1',
    maxWidth: imageWidth ? `${imageWidth}%` : '500px'
  };

  const imageStyle = {
    width: '100%',
    borderRadius: '8px',
    display: 'block'
  };

  return (
    <div className={`text-with-image-section image-${imagePosition}`} style={containerStyle}>
      <div className="text-content" style={textContainerStyle}>
        <h2 style={titleStyle}>{title}</h2>
        <div className="section-text" style={contentStyle}>{content}</div>
      </div>
      <div className="image-container" style={imageContainerStyle}>
        <img src={image} alt={title} style={imageStyle} />
      </div>
    </div>
  );
};

export default TextWithImageSection;