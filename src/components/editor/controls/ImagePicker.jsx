import React, { useState, useEffect, useRef } from 'react';
import { FiImage, FiX, FiUploadCloud, FiTrash2, FiEdit, FiFolder } from 'react-icons/fi';
import { createPortal } from 'react-dom';
import mediaService from '../../../api/mediaService';

// Media Library Modal Component
const MediaLibrary = ({ isOpen, onClose, onSelect, initialValue }) => {
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState(initialValue || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

  // אם מבצעים התחברות מחדש ארוכה, נייצג טיימאאוט
  const [isReconnecting, setIsReconnecting] = useState(false);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // טעינת תמונות מ-S3
      fetchImages();
      
      // הגדרת מאזיני גרירה ושחרור עבור המודאל
      const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropAreaRef.current?.classList.add('drag-over');
      };
      
      const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropAreaRef.current?.classList.remove('drag-over');
      };
      
      const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropAreaRef.current?.classList.remove('drag-over');
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleFileUpload(e.dataTransfer.files);
        }
      };
      
      const modalElement = document.querySelector('.media-library-modal');
      if (modalElement) {
        modalElement.addEventListener('dragover', handleDragOver);
        modalElement.addEventListener('dragleave', handleDragLeave);
        modalElement.addEventListener('drop', handleDrop);
        
        return () => {
          modalElement.removeEventListener('dragover', handleDragOver);
          modalElement.removeEventListener('dragleave', handleDragLeave);
          modalElement.removeEventListener('drop', handleDrop);
        };
      }
    }
  }, [isOpen]);

  // ניקוי טיימרים בעת unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // שליפת התמונות מה-S3
  const fetchImages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // מזהה החנות מגיע מה-window.SERVER_DATA שהוגדר לך בקובץ App.js
      const storeId = window.SERVER_DATA?.storeId;
      
      if (!storeId) {
        throw new Error('מזהה חנות חסר. אנא רענן את הדף ונסה שוב.');
      }
      
      // קריאה ל-API דרך שירות המדיה
      const imagesData = await mediaService.getImages(storeId);
      setImages(imagesData);
      
    } catch (error) {
      console.error('Error fetching images:', error);
      
      // אם יש שגיאת חיבור, ננסה להתחבר מחדש אחרי 5 שניות
      if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
        setError('שגיאת חיבור. מנסה להתחבר מחדש...');
        setIsReconnecting(true);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          fetchImages();
        }, 5000);
      } else {
        setError(`שגיאה בטעינת התמונות: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
      setIsReconnecting(false);
    }
  };

  // פונקציה לטיפול בקבצים שנבחרו או נגררו
  const handleFileUpload = (files) => {
    // המרת FileList למערך
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setError('אנא בחר קבצי תמונה בלבד (JPG, PNG, GIF, וכו׳).');
      return;
    }
    
    // העלאת כל קובץ תמונה
    imageFiles.forEach(uploadImage);
  };

  // העלאת תמונה ל-S3
  const uploadImage = async (file) => {
    // בדיקת גודל הקובץ (מגבלת 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('הקובץ גדול מדי. גודל מקסימלי: 5MB.');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // מזהה החנות
      const storeId = window.SERVER_DATA?.storeId;
      
      if (!storeId) {
        throw new Error('מזהה חנות חסר. אנא רענן את הדף ונסה שוב.');
      }
      
      // העלאת התמונה באמצעות שירות המדיה
      const uploadedImage = await mediaService.uploadImage(
        storeId, 
        file, 
        (progress) => setUploadProgress(progress)
      );
      
      // תמונה חדשה התווספה בהצלחה
      setImages(prevImages => [uploadedImage, ...prevImages]);
      setSelectedImage(uploadedImage.url);
      
      // בדיקת הצהרה
      if (!uploadedImage || !uploadedImage.url) {
        throw new Error('התשובה מהשרת חסרה את כתובת התמונה');
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      setError(`שגיאה בהעלאה: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // מחיקת תמונה מ-S3
  const handleDeleteImage = async (imageUrl) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק תמונה זו?')) {
      try {
        const storeId = window.SERVER_DATA?.storeId;
        
        if (!storeId) {
          throw new Error('מזהה חנות חסר. אנא רענן את הדף ונסה שוב.');
        }
        
        // מחיקת התמונה באמצעות שירות המדיה
        await mediaService.deleteImage(storeId, imageUrl);
        
        // עדכון מצב המרכיב
        setImages(prevImages => prevImages.filter(img => img.url !== imageUrl));
        
        // איפוס התמונה הנבחרת אם נמחקה
        if (selectedImage === imageUrl) {
          setSelectedImage(null);
        }
        
      } catch (error) {
        console.error('Error deleting image:', error);
        setError(`שגיאה במחיקת התמונה: ${error.message}`);
      }
    }
  };

  // סינון תמונות לפי תיבת החיפוש
  const filteredImages = searchTerm 
    ? images.filter(img => img.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : images;

  if (!isOpen) return null;

  // יצירת פורטל להרנדור המודאל בסוף אלמנט ה-body
  return createPortal(
    <div className="media-library-overlay">
      <div className="media-library-modal" ref={dropAreaRef}>
        <div className="modal-header">
          <h2>ספריית מדיה</h2>
          <div className="modal-header-actions">
            <button 
              className="upload-button"
              onClick={() => fileInputRef.current?.click()}
            >
              <FiUploadCloud /> העלאת תמונה
            </button>
            <button 
              className="close-button"
              onClick={onClose}
            >
              <FiX />
            </button>
          </div>
        </div>
        
        <div className="modal-search">
          <input
            type="text"
            placeholder="חיפוש תמונות..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="modal-content">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileUpload(e.target.files);
              }
            }}
            multiple
          />
          
          {isUploading && (
            <div className="upload-progress-container">
              <div className="upload-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <span>{uploadProgress}%</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="error-message">
              {error}
              <button onClick={() => setError(null)}>
                <FiX />
              </button>
            </div>
          )}
          
          {isLoading ? (
            <div className="loading-message">טוען תמונות...</div>
          ) : filteredImages.length === 0 ? (
            <div className="empty-message">
              {searchTerm ? 'לא נמצאו תמונות התואמות לחיפוש.' : 'אין תמונות בספריה. העלה תמונות להתחלה.'}
            </div>
          ) : (
            <div className="images-grid">
              {filteredImages.map((image) => (
                <div 
                  key={image.id}
                  className={`image-item ${selectedImage === image.url ? 'selected' : ''}`}
                  onClick={() => setSelectedImage(image.url)}
                >
                  <div className="image-preview">
                    <img src={image.url} alt={image.name} />
                    <div className="image-overlay">
                      <div className="image-actions">
                        <button 
                          className="select-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(image.url);
                          }}
                        >
                          בחר
                        </button>
                        <button 
                          className="delete-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(image.url);
                          }}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="image-info">
                    <div className="image-name">{image.name}</div>
                    <div className="image-size">{Math.round(image.size / 1024)}KB</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <div className="selection-info">
            {selectedImage ? '1 תמונה נבחרה' : 'לא נבחרו תמונות'}
          </div>
          <div className="modal-buttons">
            <button 
              className="cancel-button"
              onClick={onClose}
            >
              ביטול
            </button>
            <button 
              className="confirm-button"
              disabled={!selectedImage}
              onClick={() => {
                onSelect(selectedImage);
                onClose();
              }}
            >
              בחר
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Main ImagePicker Component
const ImagePicker = ({ value, onChange }) => {
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  
  const openMediaLibrary = () => {
    setIsMediaLibraryOpen(true);
  };

  const closeMediaLibrary = () => {
    setIsMediaLibraryOpen(false);
  };

  const handleSelectImage = (imageUrl) => {
    onChange(imageUrl);
  };
  
  const handleRemoveImage = () => {
    onChange('');
  };

  return (
    <div className="image-picker">
      {value ? (
        // הצגת תצוגה מקדימה של התמונה כאשר נבחרה תמונה
        <div className="image-preview">
          <img src={value} alt="תצוגה מקדימה" />
          <div className="image-actions">
            <button 
              className="replace-image-button"
              onClick={openMediaLibrary}
              title="החלף תמונה"
            >
              <FiEdit /> החלף
            </button>
            <button 
              className="remove-image-button"
              onClick={handleRemoveImage}
              title="הסר תמונה"
            >
              <FiTrash2 /> הסר
            </button>
          </div>
        </div>
      ) : (
        // הצגת ממשק העלאה כאשר אין תמונה
        <div className="image-upload">
          <div 
            className="upload-area"
            onClick={openMediaLibrary}
          >
            <FiFolder size={32} opacity={0.4} />
            <p>לחץ לבחירת תמונה מהמדיה או גרור תמונה לכאן</p>
            <button className="browse-button">
              בחר תמונה
            </button>
          </div>
        </div>
      )}
      
      {/* MediaLibrary Modal */}
      <MediaLibrary 
        isOpen={isMediaLibraryOpen}
        onClose={closeMediaLibrary}
        onSelect={handleSelectImage}
        initialValue={value}
      />
    </div>
  );
};

export default ImagePicker;