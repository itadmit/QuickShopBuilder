import React, { useState } from 'react';
import * as FiIcons from 'react-icons/fi';  // Feather Icons
import * as AiIcons from 'react-icons/ai';  // Ant Design Icons
import * as BiIcons from 'react-icons/bi';  // Bootstrap Icons
import * as BsIcons from 'react-icons/bs';  // Bootstrap Icons
import * as FaIcons from 'react-icons/fa';  // Font Awesome Icons
import * as HiIcons from 'react-icons/hi';  // Heroicons
import * as IoIcons from 'react-icons/io5'; // Ionicons 5
import * as RiIcons from 'react-icons/ri';  // Remix Icons

const IconSection = ({ data }) => {
  const { 
    iconName = 'FiStar',  // שם האייקון ברירת מחדל
    iconSize = 40,        // גודל האייקון
    iconColor = '#333333', // צבע האייקון
    iconStrokeWidth = 2,  // עובי קו האייקון (רק לאייקונים תואמים)
    iconAlignment = 'center', // יישור האייקון: 'right', 'center', 'left'
    title,                  // כותרת אופציונלית
    content,                // תוכן טקסט אופציונלי
    
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
    
    // מאפיינים נוספים
    backgroundColor,
    backgroundOpacity = 1,
    borderRadius = 0,
    showBorder = false,
    borderColor = '#e0e0e0',
    borderWidth = 1
  } = data;

  // יצירת האייקון הדינמי מתוך הספריות
  const getIconComponent = () => {
    // פיצול שם האייקון לפרפיקס ושם
    const prefix = iconName.substring(0, 2);
    
    // בחירת הספריה המתאימה לפי הפרפיקס
    let IconLibrary;
    switch (prefix) {
      case 'Fi': IconLibrary = FiIcons; break;
      case 'Ai': IconLibrary = AiIcons; break;
      case 'Bi': IconLibrary = BiIcons; break;
      case 'Bs': IconLibrary = BsIcons; break;
      case 'Fa': IconLibrary = FaIcons; break;
      case 'Hi': IconLibrary = HiIcons; break;
      case 'Io': IconLibrary = IoIcons; break;
      case 'Ri': IconLibrary = RiIcons; break;
      default: IconLibrary = FiIcons; // ברירת מחדל - Feather Icons
    }
    
    // מציאת האייקון בספריה
    const Icon = IconLibrary[iconName];
    
    // אם לא נמצא האייקון, החזר אייקון ברירת מחדל
    if (!Icon) {
      return <FiIcons.FiStar size={iconSize} color={iconColor} strokeWidth={iconStrokeWidth} />;
    }
    
    // החזרת האייקון עם המאפיינים המבוקשים
    return <Icon size={iconSize} color={iconColor} strokeWidth={iconStrokeWidth} />;
  };

  // סגנונות לקונטיינר העיקרי
  const containerStyle = {
    marginTop: marginTop || '',
    marginRight: marginRight || '',
    marginBottom: marginBottom || '',
    marginLeft: marginLeft || '',
    paddingTop: paddingTop || '20px',
    paddingRight: paddingRight || '20px',
    paddingBottom: paddingBottom || '20px',
    paddingLeft: paddingLeft || '20px',
    backgroundColor: backgroundColor ? `rgba(${hexToRgb(backgroundColor)}, ${backgroundOpacity})` : 'transparent',
    borderRadius: `${borderRadius}px`,
    border: showBorder ? `${borderWidth}px solid ${borderColor}` : 'none',
    textAlign: iconAlignment,
    animation: animation ? `${animation} ${animationDuration || 0.5}s ${animationDelay || 0}s` : 'none'
  };

  // סגנונות לאייקון
  const iconStyle = {
    marginBottom: (title || content) ? '15px' : '0'
  };

  // סגנונות לכותרת
  const titleStyle = {
    fontFamily: titleFontFamily || "'Noto Sans Hebrew', sans-serif",
    fontSize: titleFontSize ? `${titleFontSize}px` : '18px',
    fontWeight: titleFontWeight || 'bold',
    fontStyle: titleFontStyle || 'normal',
    textDecoration: titleTextDecoration || 'none',
    textTransform: titleTextTransform || 'none',
    lineHeight: titleLineHeight || 1.2,
    letterSpacing: titleLetterSpacing ? `${titleLetterSpacing}px` : 'normal',
    color: titleColor || '#333',
    margin: '0 0 10px',
    textAlign: iconAlignment
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
    color: textColor || '#666',
    margin: '0',
    textAlign: iconAlignment
  };

  // המרת צבע HEX ל-RGB לשימוש ב-rgba
  const hexToRgb = (hex) => {
    // הסרת ה-# אם קיים
    hex = hex.replace(/^#/, '');
    
    // פיצול לערוצי צבע
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    
    return `${r}, ${g}, ${b}`;
  };

  return (
    <div className="icon-section" style={containerStyle}>
      <div className="icon-container" style={iconStyle}>
        {getIconComponent()}
      </div>
      
      {title && <h3 style={titleStyle}>{title}</h3>}
      {content && <p style={contentStyle}>{content}</p>}
    </div>
  );
};

export default IconSection;