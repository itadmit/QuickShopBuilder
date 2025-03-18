import React, { useState } from 'react';
import { FiImage, FiX, FiUploadCloud } from 'react-icons/fi';

const ImagePicker = ({ value, onChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // מדמה העלאת תמונה
  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    
    if (!file) return;
    
    // בדיקת סוג הקובץ
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('סוג הקובץ לא נתמך. אנא העלה תמונה בפורמט JPG, PNG, GIF או WEBP.');
      return;
    }
    
    // בדיקת גודל הקובץ (מקסימום 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('הקובץ גדול מדי. גודל מקסימלי: 5MB.');
      return;
    }
    
    setIsUploading(true);
    setErrorMessage('');
    
    // מדמה העלאה לשרת
    setTimeout(() => {
      // בפרויקט אמיתי כאן תהיה העלאה לשרת
      
      // יצירת URL לתמונה (דמה - בפרויקט אמיתי יוחזר מהשרת)
      const placeholderImages = [
        '/images/placeholders/image1.jpg',
        '/images/placeholders/image2.jpg',
        '/images/placeholders/image3.jpg'
      ];
      const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
      
      onChange(randomImage);
      setIsUploading(false);
    }, 1500);
  };

  // הסרת התמונה הנוכחית
  const handleRemoveImage = () => {
    onChange('');
  };

  // בחירת תמונה מספריית המדיה
  const handleChooseFromLibrary = () => {
    // בפרויקט אמיתי - כאן תהיה פתיחת ספריית מדיה
    // מדמה בחירת תמונה מספרייה
    const mockLibraryImages = [
      '/images/placeholders/library1.jpg',
      '/images/placeholders/library2.jpg',
      '/images/placeholders/library3.jpg',
      '/images/placeholders/library4.jpg'
    ];
    const selected = mockLibraryImages[Math.floor(Math.random() * mockLibraryImages.length)];
    onChange(selected);
  };

  return (
    <div className="image-picker">
      {value ? (
        // תצוגת תמונה נבחרת
        <div className="image-preview">
          <img src={value} alt="Selected" />
          <div className="image-actions">
            <button 
              className="remove-image-button"
              onClick={handleRemoveImage}
              title="הסר תמונה"
            >
              <FiX />
            </button>
          </div>
        </div>
      ) : (
        // תצוגת אזור העלאה
        <div className="image-upload">
          <div className="upload-area">
            <FiImage size={32} opacity={0.3} />
            <p>גרור תמונה לכאן או לחץ כדי להעלות</p>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              disabled={isUploading} 
              className="file-input"
            />
            {isUploading && <div className="loading-indicator">מעלה תמונה...</div>}
          </div>
          
          <div className="upload-options">
            <button
              className="upload-button"
              onClick={() => document.querySelector('.file-input').click()}
              disabled={isUploading}
            >
              <FiUploadCloud /> העלה תמונה
            </button>
            <div className="or-divider">או</div>
            <button 
              className="library-button"
              onClick={handleChooseFromLibrary}
              disabled={isUploading}
            >
              בחר מספריית המדיה
            </button>
          </div>
        </div>
      )}
      
      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default ImagePicker;