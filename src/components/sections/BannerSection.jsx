import React from 'react';

const BannerSection = ({ data }) => {
  const { 
    title, 
    subtitle, 
    buttonText, 
    buttonLink, 
    backgroundImage,
    height,
    overlayOpacity,
    
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
    
    // מאפייני טיפוגרפיה כפתור
    buttonFontFamily, 
    buttonFontSize, 
    buttonFontWeight, 
    buttonLineHeight,
    buttonColor,
    buttonTextColor,
    
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
    paddingTop: paddingTop || '',
    paddingRight: paddingRight || '',
    paddingBottom: paddingBottom || '',
    paddingLeft: paddingLeft || '',
    height: height ? `${height}px` : '220px',
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    animation: animation ? `${animation} ${animationDuration || 0.5}s ${animationDelay || 0}s` : 'none'
  };

  // סגנונות לשיכבת האובר-ליי
  const overlayStyle = {
    backgroundColor: `rgba(0, 0, 0, ${overlayOpacity || 0.4})`
  };

  // סגנונות לכותרת
  const titleStyle = {
    fontFamily: titleFontFamily || "'Noto Sans Hebrew', sans-serif",
    fontSize: titleFontSize ? `${titleFontSize}px` : '32px',
    fontWeight: titleFontWeight || 'bold',
    fontStyle: titleFontStyle || 'normal',
    textDecoration: titleTextDecoration || 'none',
    textTransform: titleTextTransform || 'none',
    lineHeight: titleLineHeight || 1.2,
    letterSpacing: titleLetterSpacing ? `${titleLetterSpacing}px` : 'normal',
    color: titleColor || 'white',
    margin: '0 0 15px'
  };

  // סגנונות לטקסט משנה
  const subtitleStyle = {
    fontFamily: textFontFamily || "'Noto Sans Hebrew', sans-serif",
    fontSize: textFontSize ? `${textFontSize}px` : '16px',
    fontWeight: textFontWeight || 'normal',
    fontStyle: textFontStyle || 'normal',
    textDecoration: textTextDecoration || 'none',
    textTransform: textTextTransform || 'none',
    lineHeight: textLineHeight || 1.5,
    letterSpacing: textLetterSpacing ? `${textLetterSpacing}px` : 'normal',
    color: textColor || 'white',
    margin: '0 0 20px'
  };

  // סגנונות לכפתור
  const buttonStyle = {
    fontFamily: buttonFontFamily || "'Noto Sans Hebrew', sans-serif",
    fontSize: buttonFontSize ? `${buttonFontSize}px` : '14px',
    fontWeight: buttonFontWeight || '500',
    lineHeight: buttonLineHeight || 1.2,
    backgroundColor: buttonColor || '#ffffff',
    color: buttonTextColor || '#202123',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'all 0.3s ease'
  };

  return (
    <div className="banner-section" style={containerStyle}>
      <div className="banner-overlay" style={overlayStyle}></div>
      <div className="banner-content">
        <h2 style={titleStyle}>{title}</h2>
        {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
        {buttonText && (
          <a href={buttonLink || '#'} className="banner-button" style={buttonStyle}>
            {buttonText}
          </a>
        )}
      </div>
    </div>
  );
};

export default BannerSection;