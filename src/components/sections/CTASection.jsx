import React, { useState } from 'react';

const CTASection = ({ data }) => {
  const { 
    title, 
    content, 
    buttonText, 
    buttonLink, 
    image,
    overlayType = 'bottom', // 'bottom', 'full', 'none'
    overlayOpacity = 0.5,
    
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

  // מצב שומר של שגיאות תמונה
  const [imageError, setImageError] = useState(false);

  // סגנונות לקונטיינר העיקרי
  const containerStyle = {
    marginTop: marginTop || '',
    marginRight: marginRight || '',
    marginBottom: marginBottom || '',
    marginLeft: marginLeft || '',
    paddingTop: paddingTop || '',
    paddingRight: paddingRight || '',
    paddingBottom: paddingBottom || '',
    paddingLeft: paddingLeft || '',
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    animation: animation ? `${animation} ${animationDuration || 0.5}s ${animationDelay || 0}s` : 'none',
    backgroundColor: imageError ? '#f0f0f0' : 'transparent' // רקע אפור אם התמונה נכשלה
  };

  // סגנונות לתמונת הרקע
  const imageStyle = {
    width: '100%',
    height: 'auto',
    display: 'block'
  };

  // סגנונות לאוברליי
  const overlayStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
    padding: '30px',
    
    // אם האוברליי מלא, צריך למקם אותו על כל התמונה
    ...(overlayType === 'full' ? {
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    } : {
      // אם האוברליי רק בתחתית
      ...(overlayType === 'bottom' ? {
        background: `linear-gradient(to top, rgba(0,0,0,${overlayOpacity}) 0%, rgba(0,0,0,0) 100%)`
      } : {})
    }),
    
    // אם אין אוברליי בכלל
    ...(overlayType === 'none' ? {
      backgroundColor: 'transparent',
      background: 'none'
    } : {})
  };

  // סגנונות לכותרת
  const titleStyle = {
    fontFamily: titleFontFamily || "'Noto Sans Hebrew', sans-serif",
    fontSize: titleFontSize ? `${titleFontSize}px` : '24px',
    fontWeight: titleFontWeight || 'bold',
    fontStyle: titleFontStyle || 'normal',
    textDecoration: titleTextDecoration || 'none',
    textTransform: titleTextTransform || 'none',
    lineHeight: titleLineHeight || 1.2,
    letterSpacing: titleLetterSpacing ? `${titleLetterSpacing}px` : 'normal',
    color: titleColor || 'white',
    margin: '0 0 10px',
    textShadow: overlayType === 'none' ? '0 1px 3px rgba(0,0,0,0.7)' : 'none'
  };

  // סגנונות לטקסט תוכן
  const contentStyle = {
    fontFamily: textFontFamily || "'Noto Sans Hebrew', sans-serif",
    fontSize: textFontSize ? `${textFontSize}px` : '16px',
    fontWeight: textFontWeight || 'normal',
    fontStyle: textFontStyle || 'normal',
    textDecoration: textTextDecoration || 'none',
    textTransform: textTextTransform || 'none',
    lineHeight: textLineHeight || 1.5,
    letterSpacing: textLetterSpacing ? `${textLetterSpacing}px` : 'normal',
    color: textColor || 'white',
    margin: '0 0 20px',
    textShadow: overlayType === 'none' ? '0 1px 3px rgba(0,0,0,0.7)' : 'none'
  };

  // סגנונות לכפתור
  const buttonStyle = {
    fontFamily: buttonFontFamily || "'Noto Sans Hebrew', sans-serif",
    fontSize: buttonFontSize ? `${buttonFontSize}px` : '14px',
    fontWeight: buttonFontWeight || '500',
    lineHeight: buttonLineHeight || 1.2,
    backgroundColor: buttonColor || '#5271ff',
    color: buttonTextColor || 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'all 0.3s ease',
    boxShadow: overlayType === 'none' ? '0 2px 5px rgba(0,0,0,0.2)' : 'none'
  };

  // שימוש בתמונת פלייסהולדר בסיסית לגיבוי
  const fallbackImage = '/images/placeholders/hero-bg.jpg';

  return (
    <div className="cta-section" style={containerStyle}>
      {!imageError && (
        <img 
          src={image || fallbackImage} 
          alt={title} 
          style={imageStyle}
          onError={(e) => {
            console.log('Image load error:', e);
            // במקרה של כישלון, נסה את התמונה החלופית
            if (image !== fallbackImage && !e.target.src.includes(fallbackImage)) {
              e.target.src = fallbackImage;
            } else {
              // אם גם התמונה החלופית נכשלה, הגדר מצב שגיאה
              setImageError(true);
            }
          }}
        />
      )}
      
      <div className="cta-overlay" style={overlayStyle}>
        <h2 style={{...titleStyle, color: imageError ? '#333' : titleStyle.color}}>{title}</h2>
        <p style={{...contentStyle, color: imageError ? '#555' : contentStyle.color}}>{content}</p>
        {buttonText && (
          <a href={buttonLink || '#'} className="cta-button" style={buttonStyle}>
            {buttonText}
          </a>
        )}
      </div>
    </div>
  );
};

export default CTASection;