import React from 'react';

const TestimonialsSection = ({ data }) => {
  const { 
    title, 
    testimonials = [],
    backgroundColor,
    cardBackgroundColor,
    textColor,
    
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
    backgroundColor: backgroundColor || '#f8f9fb',
    borderRadius: '8px',
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

  // סגנונות לרשת העדויות
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px'
  };

  // סגנונות לכרטיס עדות
  const cardStyle = {
    backgroundColor: cardBackgroundColor || '#ffffff',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
    position: 'relative',
    transition: 'all 0.3s ease'
  };

  // סגנונות לתוכן העדות
  const contentStyle = {
    fontFamily: textFontFamily || "'Noto Sans Hebrew', sans-serif",
    fontSize: textFontSize ? `${textFontSize}px` : '15px',
    fontWeight: textFontWeight || 'normal',
    fontStyle: textFontStyle || 'italic',
    textDecoration: textTextDecoration || 'none',
    textTransform: textTextTransform || 'none',
    lineHeight: textLineHeight || 1.6,
    letterSpacing: textLetterSpacing ? `${textLetterSpacing}px` : 'normal',
    color: textColor || '#202123',
    marginBottom: '18px'
  };

  // סגנונות לשם הכותב
  const authorStyle = {
    fontFamily: textFontFamily || "'Noto Sans Hebrew', sans-serif",
    fontSize: textFontSize ? `${textFontSize}px` : '15px',
    fontWeight: '700',
    color: textColor || '#202123',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  return (
    <div className="testimonials-section" style={containerStyle}>
      <h2 style={titleStyle}>{title}</h2>
      <div className="testimonials-grid" style={gridStyle}>
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="testimonial-card" style={cardStyle}>
            <div className="testimonial-content" style={contentStyle}>"{testimonial.content}"</div>
            <div className="testimonial-author" style={authorStyle}>- {testimonial.author}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;