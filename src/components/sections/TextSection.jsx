import React from 'react';

const TextSection = ({ data }) => {
  const { 
    title,
    content,
    
    // מאפייני יישור
    alignment = 'right',
    
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
    
    // מאפייני טיפוגרפיה תוכן
    contentFontFamily, 
    contentFontSize, 
    contentFontWeight, 
    contentFontStyle, 
    contentTextDecoration, 
    contentTextTransform, 
    contentLineHeight, 
    contentLetterSpacing,
    contentColor,
    
    // מאפייני מרווחים
    marginTop, marginRight, marginBottom, marginLeft,
    paddingTop, paddingRight, paddingBottom, paddingLeft,
    
    // מאפייני אנימציה
    animation, animationDuration, animationDelay,
    
    // רוחב מקסימלי
    maxWidth,
    
    // רקע
    backgroundColor,
    
    // הדגשות ואפקטים
    highlightColor,
    dropCap = false,
    dropCapColor,
    
    // גבולות
    border,
    borderColor,
    borderRadius
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
    maxWidth: maxWidth ? `${maxWidth}px` : '1000px',
    margin: '0 auto',
    backgroundColor: backgroundColor || 'transparent',
    border: border ? `1px solid ${borderColor || '#dddddd'}` : 'none',
    borderRadius: borderRadius ? `${borderRadius}px` : '0',
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
    marginBottom: title ? '15px' : 0,
    textAlign: alignment
  };

  // סגנונות לתוכן
  const contentStyle = {
    fontFamily: contentFontFamily || "'Noto Sans Hebrew', sans-serif",
    fontSize: contentFontSize ? `${contentFontSize}px` : '16px',
    fontWeight: contentFontWeight || 'normal',
    fontStyle: contentFontStyle || 'normal',
    textDecoration: contentTextDecoration || 'none',
    textTransform: contentTextTransform || 'none',
    lineHeight: contentLineHeight || 1.6,
    letterSpacing: contentLetterSpacing ? `${contentLetterSpacing}px` : 'normal',
    color: contentColor || '#444444',
    textAlign: alignment,
    margin: 0
  };

  // עיבוד התוכן עם תמיכה ב-HTML פשוט
  const processContent = () => {
    // עטיפת טקסט ב-span עם פסיק בתחילת משפט אם נדרש dropCap
    if (dropCap && content && content.length > 0) {
      const firstChar = content.charAt(0);
      const restOfContent = content.slice(1);
      
      return (
        <p style={contentStyle}>
          <span className="drop-cap" style={{
            float: 'right',
            fontSize: '3em',
            fontFamily: contentFontFamily || "'Noto Sans Hebrew', sans-serif",
            lineHeight: '0.8',
            marginRight: '0',
            marginLeft: '0.1em',
            color: dropCapColor || contentColor || '#444444',
          }}>
            {firstChar}
          </span>
          {restOfContent}
        </p>
      );
    }
    
    return <p style={contentStyle}>{content}</p>;
  };

  return (
    <div className="text-section" style={containerStyle}>
      {title && <h2 className="section-title" style={titleStyle}>{title}</h2>}
      
      <div className="text-content">
        {processContent()}
      </div>
    </div>
  );
};

export default TextSection;