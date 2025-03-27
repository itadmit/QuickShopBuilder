// DragLayerPreview.jsx
import React, { useEffect, useState } from 'react';
import { useEditor } from '../../contexts/EditorContext';

// רכיבי תצוגה מקדימה
import HeroSection from '../sections/HeroSection';
import BannerSection from '../sections/BannerSection';
import TextWithImageSection from '../sections/TextWithImageSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import ProductsSection from '../sections/ProductsSection';
import CollectionListSection from '../sections/CollectionListSection';
import NewsletterSection from '../sections/NewsletterSection';

const DragLayerPreview = () => {
  const { isDragging, draggedItem } = useEditor();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragData, setDragData] = useState(null);

  // עדכון מיקום העכבר בזמן גרירה
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // ניסיון לקרוא את המידע מ-localStorage (אם קיים)
    try {
      const savedDragData = localStorage.getItem('dragData');
      if (savedDragData) {
        setDragData(JSON.parse(savedDragData));
      }
    } catch (error) {
      console.warn('Error reading drag data from localStorage:', error);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging]);

  // אם אין גרירה, לא מציגים כלום
  if (!isDragging) return null;

  // קביעת המידע על האלמנט שנגרר
  const itemToPreview = draggedItem || dragData;
  if (!itemToPreview) return null;

  // יצירת רכיב לתצוגה מקדימה בהתאם לסוג
  const renderPreviewContent = () => {
    // יצירת אובייקט dummy לתצוגה מקדימה
    const previewData = createDummyDataForType(itemToPreview.type);

    switch (itemToPreview.type) {
      case 'hero':
        return <HeroSection data={previewData} />;
      case 'banner':
        return <BannerSection data={previewData} />;
      case 'text-image':
        return <TextWithImageSection data={previewData} />;
      case 'testimonials':
        return <TestimonialsSection data={previewData} />;
      case 'products':
        return <ProductsSection data={previewData} />;
      case 'collections':
        return <CollectionListSection data={previewData} />;
      case 'newsletter':
        return <NewsletterSection data={previewData} />;
        case 'cta':
          return <CTASection data={previewData} />;
        case 'icon':
          return <IconSection data={previewData} />;
      default:
        return <div>רכיב {itemToPreview.name}</div>;
    }
  };

  // יצירת נתוני ברירת מחדל לפי סוג הרכיב
  const createDummyDataForType = (type) => {
    switch (type) {
      case 'hero':
        return {
          title: 'כותרת ראשית',
          subtitle: 'כותרת משנה',
          buttonText: 'לפעולה',
          buttonLink: '#',
          backgroundImage: '/images/placeholders/hero-bg.jpg'
        };
      case 'banner':
        return {
          title: 'כותרת הבאנר',
          subtitle: 'תיאור קצר',
          buttonText: 'לפרטים',
          buttonLink: '#',
          backgroundImage: '/images/placeholders/banner-bg.jpg'
        };
      case 'text-image':
        return {
          title: 'כותרת',
          content: 'תוכן טקסטואלי יופיע כאן',
          image: '/images/placeholders/about-img.jpg',
          imagePosition: 'right'
        };
      case 'testimonials':
        return {
          title: 'המלצות לקוחות',
          testimonials: [
            { id: 1, author: 'שם הלקוח', content: 'תוכן ההמלצה יופיע כאן' }
          ]
        };
      case 'products':
        return {
          title: 'מוצרים',
          products: [],
          count: 4
        };
      case 'collections':
        return {
          title: 'קטגוריות',
          collections: [],
          count: 3
        };
          // נוסיף את הסקשנים החדשים
    case 'cta':
      return {
        title: 'כותרת CTA',
        content: 'תוכן כאן יעודד את המשתמשים לפעולה',
        buttonText: 'לחץ כאן',
        buttonLink: '#',
        image: '/builder/build/images/placeholders/cta-bg.jpg',
        overlayType: 'bottom',
        overlayOpacity: 0.5,
      };
    case 'icon':
      return {
        iconName: 'FiStar',
        iconSize: 40,
        iconColor: '#5271ff',
        iconStrokeWidth: 2,
        iconAlignment: 'center',
        title: 'כותרת אייקון',
        content: 'תוכן טקסט שמתאר את האייקון',
      };

      case 'newsletter':
        return {
          title: 'הרשמה לעדכונים',
          subtitle: 'הישארו מעודכנים',
          buttonText: 'הרשמה',
          backgroundColor: '#f7f7f7'
        };
      default:
        return {};
    }
  };

  return (
    <div 
      className="drag-preview-layer"
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 1000,
        left: position.x + 15,
        top: position.y + 15,
        opacity: 0.6,
        transform: 'scale(0.4)',
        transformOrigin: 'top left',
        width: '600px',
        maxHeight: '300px',
        overflow: 'hidden'
      }}
    >
      <div className="drag-preview-content">
        {renderPreviewContent()}
      </div>
    </div>
  );
};

export default DragLayerPreview;