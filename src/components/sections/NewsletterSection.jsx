import React from 'react';

const NewsletterSection = ({ data }) => {
  const { 
    title, 
    subtitle, 
    buttonText,
    backgroundImage,
    backgroundColor,
    buttonColor,
    buttonTextColor,
    
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
    
    // מאפייני מרווחים
    marginTop, marginRight, marginBottom, marginLeft,
    paddingTop, paddingRight, paddingBottom, paddingLeft,
    
    // מאפייני אנימציה
    animation, animationDuration, animationDelay
  } = data;

  // בחירת הסטייל בהתאם לאם יש תמונת רקע או צבע רקע
  const backgroundStyle = backgroundImage 
    ? { backgroundImage: `url(${backgroundImage})` } 
    : { backgroundColor: backgroundColor || '#f7f7f7' };

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
    ...backgroundStyle,
    position: 'relative',
    borderRadius: '8px',
    animation: animation ? `${animation} ${animationDuration || 0.5}s ${animationDelay || 0}s` : 'none'
  };

  // שכבת אוברליי - רק אם יש תמונת רקע
  const overlayStyle = backgroundImage ? {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '8px'
  } : null;

  // סגנונות לאזור התוכן
  const contentStyle = {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    maxWidth: '650px',
    margin: '0 auto'
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
    color: titleColor || (backgroundImage ? 'white' : '#202123'),
    marginTop: 0,
    marginBottom: '18px'
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
    color: textColor || (backgroundImage ? 'white' : '#65676b'),
    marginBottom: '30px'
  };

  // סגנונות לטופס
  const formStyle = {
    display: 'flex',
    maxWidth: '550px',
    margin: '0 auto'
  };

  // סגנונות לשדה הטקסט
  const inputStyle = {
    flex: 1,
    padding: '14px',
    border: '1px solid #e4e6eb',
    borderRadius: '4px 0 0 4px',
    fontSize: '15px'
  };

  // סגנונות לכפתור
  const buttonStyle = {
    fontFamily: buttonFontFamily || "'Noto Sans Hebrew', sans-serif",
    fontSize: buttonFontSize ? `${buttonFontSize}px` : '14px',
    fontWeight: buttonFontWeight || '500',
    lineHeight: buttonLineHeight || 1.2,
    padding: '14px 28px',
    backgroundColor: buttonColor || '#5271ff',
    color: buttonTextColor || 'white',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  // טיפול בשליחת טופס
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('הרשמה לניוזלטר נשלחה!');
  };

  return (
    <div className="newsletter-section" style={containerStyle}>
      {backgroundImage && <div className="newsletter-overlay" style={overlayStyle}></div>}
      <div className="newsletter-content" style={contentStyle}>
        <h2 style={titleStyle}>{title}</h2>
        <p style={subtitleStyle}>{subtitle}</p>
        <form className="newsletter-form" style={formStyle} onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="הזן את כתובת המייל שלך" 
            required 
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>{buttonText}</button>
        </form>
      </div>
    </div>
  );
};

export default NewsletterSection;