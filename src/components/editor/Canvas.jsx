// Canvas.jsx - גרסה פשוטה יותר המתמקדת באזורי שחרור ברורים
import React, { useState } from 'react';
import { useEditor } from '../../contexts/EditorContext';

// ייבוא כל הסקשנים
import HeroSection from '../sections/HeroSection';
import BannerSection from '../sections/BannerSection';
import TextWithImageSection from '../sections/TextWithImageSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import ProductsSection from '../sections/ProductsSection';
import CollectionListSection from '../sections/CollectionListSection';
import NewsletterSection from '../sections/NewsletterSection';

const Canvas = () => {
  const { 
    sections, 
    selectedSectionId, 
    setSelectedSectionId,
    deleteSection,
    addSection,
    reorderSections,
    isDragging, 
    setIsDragging
  } = useEditor();

  // מצב מקומי לסימון אזור שחרור פעיל
  const [activeDropZoneIndex, setActiveDropZoneIndex] = useState(null);

  // פונקציה לרנדור סקשן לפי סוג
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

  // פונקציות גרירה HTML5 native
  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setActiveDropZoneIndex(index);
    
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setActiveDropZoneIndex(null);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    setActiveDropZoneIndex(null);
    localStorage.removeItem('dragData');
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    setActiveDropZoneIndex(null);
    setIsDragging(false);
    
    try {
      // נסיון לקבל נתונים מהדראג
      let dragData;
      
      // בדיקה אם יש נתונים ב-dataTransfer
      const jsonData = e.dataTransfer.getData('application/json');
      const textData = e.dataTransfer.getData('text/plain');
      
      if (jsonData) {
        dragData = JSON.parse(jsonData);
      } else if (textData) {
        dragData = JSON.parse(textData);
      } else {
        // נסיון לקרוא מ-localStorage
        const localData = localStorage.getItem('dragData');
        if (localData) {
          dragData = JSON.parse(localData);
        }
      }
      
      if (dragData) {
        // אם יש נתוני ID - זה סידור מחדש של סקשן קיים
        if (dragData.id && dragData.index !== undefined) {
          // ביצוע סידור מחדש
          reorderSections(dragData.index, dropIndex);
        } 
        // אחרת זה הוספת סקשן חדש
        else if (dragData.type) {
          addSection(dragData.type, dropIndex);
        }
      }
    } catch (error) {
      console.error('Error processing drop:', error);
    }
    
    // ניקוי הנתונים בכל מקרה
    localStorage.removeItem('dragData');
  };

  // פונקציה לתחילת גרירת סקשן קיים
  const handleSectionDragStart = (e, section, index) => {
    // שמירת נתוני הגרירה
    const dragData = {
      id: section.id,
      type: section.type,
      index: index
    };
    
    e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
    
    // גם שומרים ב-localStorage למקרה שנצטרך
    localStorage.setItem('dragData', JSON.stringify(dragData));
    
    setIsDragging(true);
    
    // הוספת סגנון לאלמנט הנגרר
    if (e.target) {
      setTimeout(() => {
        if (e.target) {
          e.target.classList.add('dragging');
        }
      }, 0);
    }
  };

  return (
    <div className="canvas">
      <div 
        className={`canvas-area ${isDragging ? 'drag-over' : ''}`}
        onDragOver={(e) => handleDragOver(e, sections.length)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, sections.length)}
        onDragEnd={handleDragEnd}
      >
        {/* אזור שחרור עליון (כשאין סקשנים או בתחילת הרשימה) */}
        {isDragging && (
          <div 
            className={`drop-zone ${activeDropZoneIndex === 0 ? 'active' : ''}`}
            onDragOver={(e) => handleDragOver(e, 0)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 0)}
          >
            <div className="drop-zone-label">שחרר כאן להוספה בתחילת העמוד</div>
          </div>
        )}
        
        {/* הסקשנים עם אזורי שחרור ביניהם */}
        {sections.map((section, index) => (
          <React.Fragment key={section.id}>
            <div
              className={`canvas-section ${selectedSectionId === section.id ? 'selected' : ''}`}
              onClick={() => setSelectedSectionId(section.id)}
              draggable={true}
              onDragStart={(e) => handleSectionDragStart(e, section, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="section-handle">
                <i className="drag-icon"></i>
              </div>
              <div className="section-content">
                {renderSection(section)}
              </div>
              <div className="section-actions">
                <button
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('האם אתה בטוח שברצונך למחוק את הסקשן הזה?')) {
                      deleteSection(section.id);
                    }
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
            
            {/* אזור שחרור לאחר כל סקשן (נראה רק בזמן גרירה) */}
            {isDragging && (
              <div 
                className={`drop-zone ${activeDropZoneIndex === index + 1 ? 'active' : ''}`}
                onDragOver={(e) => handleDragOver(e, index + 1)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index + 1)}
              >
                <div className="drop-zone-label">שחרר כאן</div>
              </div>
            )}
          </React.Fragment>
        ))}
        
        {/* אם אין סקשנים ואין גרירה פעילה */}
        {sections.length === 0 && !isDragging && (
          <div className="empty-canvas">
            <p>גרור רכיבים לכאן כדי ליצור את דף הבית שלך</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;