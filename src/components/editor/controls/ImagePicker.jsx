// קוד ImagePicker.jsx משופר
import React, { useState } from 'react';
import { FiImage, FiX, FiUploadCloud } from 'react-icons/fi';

const ImagePicker = ({ value, onChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // פונקציה להעלאת תמונה
  const handleImageUpload = async (e) => {
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
    setUploadProgress(0);
    setErrorMessage('');
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      // העלאת הקובץ באמצעות fetch API עם מעקב אחר התקדמות
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });
      
      xhr.onload = function() {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              onChange(response.url);
              setUploadProgress(100);
              setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
              }, 500);
            } else {
              throw new Error(response.error || 'העלאה נכשלה');
            }
          } catch (error) {
            setErrorMessage('שגיאה בפענוח תגובת השרת');
            setIsUploading(false);
          }
        } else {
          setErrorMessage(`שגיאת שרת: ${xhr.status}`);
          setIsUploading(false);
        }
      };
      
      xhr.onerror = function() {
        setErrorMessage('שגיאת תקשורת');
        setIsUploading(false);
      };
      
      xhr.open('POST', '/editor/upload.php', true);
      xhr.send(formData);
      
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage(`שגיאה בהעלאה: ${error.message}`);
      setIsUploading(false);
    }
  };

  // הסרת התמונה הנוכחית
  const handleRemoveImage = async () => {
    if (value && value.startsWith('/uploads/')) {
      try {
        // שליחת בקשה למחיקת התמונה מהשרת
        const response = await fetch('/editor/delete-image.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: value })
        });
        
        const data = await response.json();
        if (!data.success) {
          console.warn('Image deletion warning:', data.message);
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    
    // מחיקת התמונה מהממשק, בכל מקרה
    onChange('');
  };

  return (
    <div className="image-picker">
      {value ? (
        // תצוגת תמונה נבחרת
        <div className="image-preview">
          <img src={value} alt="Selected" />
          <button 
            className="remove-image-button"
            onClick={handleRemoveImage}
            title="הסר תמונה"
          >
            <FiX />
          </button>
        </div>
      ) : (
        // תצוגת אזור העלאה
        <div className="image-upload">
          <div 
            className="upload-area"
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const input = document.createElement('input');
                input.type = 'file';
                input.files = e.dataTransfer.files;
                handleImageUpload({ target: input });
              }
            }}
          >
            <FiImage size={32} opacity={0.3} />
            <p>גרור תמונה לכאן או לחץ כדי להעלות</p>
            
            {isUploading ? (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="progress-text">{uploadProgress}%</div>
              </div>
            ) : (
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="file-input"
              />
            )}
          </div>
          
          {!isUploading && (
            <button
              className="upload-button"
              onClick={() => document.querySelector('.file-input').click()}
            >
              <FiUploadCloud /> העלה תמונה
            </button>
          )}
        </div>
      )}
      
      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default ImagePicker;