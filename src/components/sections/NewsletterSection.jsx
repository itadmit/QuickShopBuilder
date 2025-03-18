import React from 'react';

const NewsletterSection = ({ data }) => {
  const { title, subtitle, buttonText, backgroundImage, backgroundColor } = data;

  // בחירת הסטייל בהתאם לאם יש תמונת רקע או צבע רקע
  const sectionStyle = backgroundImage 
    ? { backgroundImage: `url(${backgroundImage})` } 
    : { backgroundColor };

  // טיפול בשליחת טופס
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('הרשמה לניוזלטר נשלחה!');
  };

  return (
    <div className="newsletter-section" style={sectionStyle}>
      <div className="newsletter-content">
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input type="email" placeholder="הזן את כתובת המייל שלך" required />
          <button type="submit">{buttonText}</button>
        </form>
      </div>
    </div>
  );
};

export default NewsletterSection;