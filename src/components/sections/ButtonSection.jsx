import React from 'react';

const ButtonSection = ({ data }) => {
  const { 
    title,
    buttonText = 'לחץ כאן',
    buttonLink = '#',
    openInNewTab = false,
    
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
    
    // מאפייני כפתור
    buttonFontFamily,
    buttonFontSize,
    buttonFontWeight,
    buttonSize = 'medium', // small, medium, large
    buttonStyle = 'filled', // filled, outline, link
    buttonColor = '#5271ff',
    buttonTextColor = '#ffffff',
    buttonBorderRadius,
    buttonWidth,
    
    // מאפייני מרווחים
    marginTop, marginRight, marginBottom, marginLeft,
    paddingTop, paddingRight, paddingBottom, paddingLeft,
    
    // מאפייני אנימציה
    animation, animationDuration, animationDelay,
    buttonAnimation = '',
    
    // אפקט הצללה
    buttonShadow = false,
    buttonShadowColor = 'rgba(0,0,0,0.2)',
    
    // אייקון
    iconPosition = 'right', // right, left
    icon,
    
    // אפקטים בריחוף
    hoverEffect = 'none', // none, lighten, darken, scale, shadow
    hoverScale = 1.05
  } = data;

  // מיפוי גודל הכפתור
  const buttonSizeMap = {
    small: {
      padding: '8px 16px',
      fontSize: buttonFontSize ? `${buttonFontSize}px` : '14px'
    },
    medium: {
      padding: '12px 24px',
      fontSize: buttonFontSize ? `${buttonFontSize}px` : '16px'
    },
    large: {
      padding: '16px 32px',
      fontSize: buttonFontSize ? `${buttonFontSize}px` : '18px'
    }
  };

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

  // סגנונות בסיסיים לכפתור
  const getButtonBaseStyle = () => {
    const sizeStyles = buttonSizeMap[buttonSize] || buttonSizeMap.medium;
    
    const baseStyle = {
      display: 'inline-block',
      textDecoration: 'none',
      fontFamily: buttonFontFamily || "'Noto Sans Hebrew', sans-serif",
      fontSize: sizeStyles.fontSize,
      fontWeight: buttonFontWeight || '500',
      padding: sizeStyles.padding,
      borderRadius: buttonBorderRadius ? `${buttonBorderRadius}px` : '4px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'center',
      width: buttonWidth ? `${buttonWidth}px` : 'auto',
      boxShadow: buttonShadow ? `0 4px 6px ${buttonShadowColor}` : 'none',
    };

    // הוספת סגנונות בהתאם לסוג הכפתור
    switch (buttonStyle) {
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: buttonColor,
          border: `2px solid ${buttonColor}`
        };
      case 'link':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: buttonColor,
          border: 'none',
          padding: '0',
          textDecoration: 'underline'
        };
      case 'filled':
      default:
        return {
          ...baseStyle,
          backgroundColor: buttonColor,
          color: buttonTextColor,
          border: 'none'
        };
    }
  };

  // כפתור סגנון בסיסי
  const buttonBaseStyle = getButtonBaseStyle();

  // יצירת אפקט hover בהתאם לבחירה
  const getHoverStyle = () => {
    switch (hoverEffect) {
      case 'lighten':
        return `
          .button-section-button:hover {
            filter: brightness(1.1);
          }
        `;
      case 'darken':
        return `
          .button-section-button:hover {
            filter: brightness(0.9);
          }
        `;
      case 'scale':
        return `
          .button-section-button:hover {
            transform: scale(${hoverScale});
          }
        `;
      case 'shadow':
        return `
          .button-section-button:hover {
            box-shadow: 0 6px 12px ${buttonShadowColor || 'rgba(0,0,0,0.3)'};
          }
        `;
      default:
        return '';
    }
  };

  return (
    <div className="button-section" style={containerStyle}>
      {title && <h2 className="section-title" style={titleStyle}>{title}</h2>}
      
      <div className="button-container">
        <a 
          href={buttonLink}
          target={openInNewTab ? "_blank" : "_self"}
          rel={openInNewTab ? "noopener noreferrer" : ""}
          className="button-section-button"
          style={buttonBaseStyle}
        >
          {icon && iconPosition === 'left' && (
            <span className="button-icon left-icon" style={{ marginLeft: '8px' }}>
              {icon}
            </span>
          )}
          
          {buttonText}
          
          {icon && iconPosition === 'right' && (
            <span className="button-icon right-icon" style={{ marginRight: '8px' }}>
              {icon}
            </span>
          )}
        </a>
      </div>
      
      {/* אפקט hover מותאם */}
      <style>
        {getHoverStyle()}
        
        {/* אנימציית כפתור מותאמת אם נבחרה */}
        {buttonAnimation && `
          .button-section-button {
            animation: ${buttonAnimation} 1s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default ButtonSection;