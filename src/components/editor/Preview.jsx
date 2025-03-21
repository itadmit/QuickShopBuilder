// Preview.jsx - קומפוננטת תצוגה מקדימה משופרת
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiMonitor, FiTablet, FiSmartphone } from 'react-icons/fi';

// ייבוא הקומפוננטות של הסקשנים
import HeroSection from '../sections/HeroSection';
import BannerSection from '../sections/BannerSection';
import TextWithImageSection from '../sections/TextWithImageSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import ProductsSection from '../sections/ProductsSection';
import CollectionListSection from '../sections/CollectionListSection';
import NewsletterSection from '../sections/NewsletterSection';

const Preview = ({ isOpen, onClose, sections }) => {
  const [device, setDevice] = useState('desktop');
  const [previewRoot, setPreviewRoot] = useState(null);

  // יצירת אלמנט לרינדור הפופאפ
  useEffect(() => {
    if (isOpen) {
      const rootElement = document.createElement('div');
      rootElement.className = 'preview-portal-root';
      document.body.appendChild(rootElement);
      setPreviewRoot(rootElement);
      
      // מניעת גלילה של הדף הראשי
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.removeChild(rootElement);
        document.body.style.overflow = '';
        setPreviewRoot(null);
      };
    }
  }, [isOpen]);

  // רינדור הסקשן המתאים
  const renderSection = (section) => {
    switch (section.type) {
      case 'hero':
        return <HeroSection data={section} />;
      case 'banner':
        return <BannerSection data={section} />;
      case 'text-image':
        return <TextWithImageSection data={section} />;
      case 'testimonials':
        return <TestimonialsSection data={section} />;
      case 'products':
        return <ProductsSection data={section} />;
      case 'collections':
        return <CollectionListSection data={section} />;
      case 'newsletter':
        return <NewsletterSection data={section} />;
      default:
        return <div>סוג סקשן לא מוכר: {section.type}</div>;
    }
  };

  if (!isOpen || !previewRoot) return null;

  // תוכן התצוגה המקדימה
  const previewContent = (
    <div className="preview-modal-overlay">
      <div className="preview-modal">
        <div className="preview-header">
          <div className="preview-title">תצוגה מקדימה של דף הבית</div>
          
          <div className="device-switcher">
            <button 
              className={`device-button ${device === 'desktop' ? 'active' : ''}`}
              onClick={() => setDevice('desktop')}
            >
              <FiMonitor />
              <span>מחשב</span>
            </button>
            <button 
              className={`device-button ${device === 'tablet' ? 'active' : ''}`}
              onClick={() => setDevice('tablet')}
            >
              <FiTablet />
              <span>טאבלט</span>
            </button>
            <button 
              className={`device-button ${device === 'mobile' ? 'active' : ''}`}
              onClick={() => setDevice('mobile')}
            >
              <FiSmartphone />
              <span>נייד</span>
            </button>
          </div>
          
          <button className="preview-close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <div className={`preview-content preview-${device}`}>
          <div className="preview-container">
            {sections.length > 0 ? (
              sections.map((section) => (
                <div key={section.id} className={`preview-section preview-section-${section.type}`}>
                  {renderSection(section)}
                </div>
              ))
            ) : (
              <div className="empty-preview-message">
                <p>אין תוכן להצגה. הוסף רכיבים לדף הבית כדי לראות תצוגה מקדימה.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // רינדור דרך פורטל
  return createPortal(previewContent, previewRoot);
};

export default Preview;