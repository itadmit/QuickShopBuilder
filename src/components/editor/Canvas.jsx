// Canvas.jsx - גישה משולבת: גרירה מהסיידבר + כפתורי ניווט
import React, { useState, useEffect } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { FiArrowUp, FiArrowDown, FiTrash2 } from 'react-icons/fi';

// ייבוא כל הסקשנים
import HeroSection from '../sections/HeroSection';
import BannerSection from '../sections/BannerSection';
import TextWithImageSection from '../sections/TextWithImageSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import ProductsSection from '../sections/ProductsSection';
import CollectionListSection from '../sections/CollectionListSection';
import NewsletterSection from '../sections/NewsletterSection';


// ייבוא הרכיבים החדשים
import RowSection from '../sections/RowSection';
import ButtonSection from '../sections/ButtonSection';
import ImageSection from '../sections/ImageSection';
import TextSection from '../sections/TextSection';
import VideoSection from '../sections/VideoSection';

const Canvas = () => {
  const { 
    sections, 
    selectedSectionId, 
    setSelectedSectionId,
    deleteSection,
    addSection,
    reorderSections,
    isDragging, 
    setIsDragging,
    showToast
  } = useEditor();

  // מצב מקומי לסימון אזור שחרור פעיל
  const [activeDropZoneIndex, setActiveDropZoneIndex] = useState(null);
  
  // הוספת ניטור לאירועי גרירה גלובליים
  useEffect(() => {
    const handleGlobalDragEnd = () => {
      console.log("Global drag end event");
      setIsDragging(false);
      setActiveDropZoneIndex(null);
      localStorage.removeItem('dragData');
    };
    
    document.addEventListener('dragend', handleGlobalDragEnd);
    
    return () => {
      document.removeEventListener('dragend', handleGlobalDragEnd);
    };
  }, [setIsDragging, setActiveDropZoneIndex]); // Pass setActiveDropZoneIndex dependency

  // פונקציה לרנדור סקשן לפי סוג
  // בפונקציה renderSection נוסיף את הרכיב החדש:
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
    case 'row':
      return <RowSection data={section} />;  // הוספנו את רכיב השורה
    case 'button':
      return <ButtonSection data={section} />;  // הוספנו את הרכיב הזה
    case 'image':
      return <ImageSection data={section} />;   // הוספנו את הרכיב הזה
    case 'text':
      return <TextSection data={section} />;    // הוספנו את הרכיב הזה
    case 'video':
      return <VideoSection data={section} />;   // הוספנו את הרכיב הזה
    default:
      return <div>סוג סקשן לא מוכר: {section.type}</div>;
  }
};

  // פונקציה להזזת סקשן למעלה
  const moveSectionUp = (index) => {
    if (index > 0) {
      reorderSections(index, index - 1);
      showToast && showToast("הרכיב הועבר למעלה", "success");
    }
  };

  // פונקציה להזזת סקשן למטה
  const moveSectionDown = (index) => {
    if (index < sections.length - 1) {
      reorderSections(index, index + 1);
      showToast && showToast("הרכיב הועבר למטה", "success");
    }
  };

  // פונקציות גרירה HTML5 native
  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    
    // קביעת אפקט הגרירה
    e.dataTransfer.dropEffect = 'copy';
    setActiveDropZoneIndex(index);
    
    // עדכון מצב גרירה גלובלי אם לא מעודכן כבר
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropZoneIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Drop event at index:", dropIndex);
    setActiveDropZoneIndex(null);
    setIsDragging(false);
    
    try {
      // ניסיון לקבל נתונים מהדראג
      let dragData;
      
      // ניסיון לקרוא מ-dataTransfer
      let jsonData;
      let textData;
      
      try {
        jsonData = e.dataTransfer.getData('application/json');
      } catch (error) {
        console.warn('Could not read application/json from dataTransfer', error);
      }
      
      try {
        textData = e.dataTransfer.getData('text/plain');
      } catch (error) {
        console.warn('Could not read text/plain from dataTransfer', error);
      }
      
      if (jsonData) {
        dragData = JSON.parse(jsonData);
        console.log("Successfully parsed JSON data from dataTransfer", dragData);
      } else if (textData) {
        dragData = JSON.parse(textData);
        console.log("Successfully parsed text data from dataTransfer", dragData);
      } else {
        // ניסיון לקרוא מ-localStorage כגיבוי
        const localData = localStorage.getItem('dragData');
        
        if (localData) {
          dragData = JSON.parse(localData);
          console.log("Retrieved drag data from localStorage", dragData);
        } else {
          console.warn("No drag data found in dataTransfer or localStorage");
        }
      }
      
      if (dragData && dragData.type) {
        // זה רכיב חדש מהסיידבר
        console.log("Adding new section of type", dragData.type, "at index", dropIndex);
        
        addSection(dragData.type, dropIndex);
        showToast && showToast(`נוסף רכיב חדש מסוג ${dragData.name || dragData.type}`, "success");
      } else {
        console.warn("Invalid drag data format or no type information", dragData);
      }
    } catch (error) {
      console.error('Error processing drop:', error);
      showToast && showToast("אירעה שגיאה בהוספת הרכיב", "error");
    } finally {
      // ניקוי נתוני גרירה בכל מקרה
      localStorage.removeItem('dragData');
    }
  };

  return (
    <div className="canvas">
      <div 
        className={`canvas-area ${isDragging ? 'drag-over' : ''}`}
        onDragOver={(e) => handleDragOver(e, sections.length)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, sections.length)}
      >
        {/* אזור שחרור עליון (בתחילת הרשימה) */}
        <div 
          className={`drop-zone ${isDragging ? 'visible' : ''} ${activeDropZoneIndex === 0 ? 'active' : ''}`}
          onDragOver={(e) => handleDragOver(e, 0)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 0)}
        >
          <div className="drop-zone-label">שחרר כאן להוספה בתחילת העמוד</div>
        </div>
        
        {/* הסקשנים עם אזורי שחרור ביניהם */}
        {sections.map((section, index) => (
          <React.Fragment key={section.id}>
            {/* סקשן */}
            <div
              className={`canvas-section ${selectedSectionId === section.id ? 'selected' : ''}`}
              onClick={() => setSelectedSectionId(section.id)}
            >
              {/* תוכן הסקשן */}
              <div className="section-content">
                {renderSection(section)}
              </div>
              
              {/* כפתורי פעולה */}
              <div className="section-actions">
                {/* כפתור להזזה למעלה */}
                <button
                  className="section-control-button move-up"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSectionUp(index);
                  }}
                  disabled={index === 0}
                  title="הזז למעלה"
                >
                  <FiArrowUp />
                </button>
                
                {/* כפתור להזזה למטה */}
                <button
                  className="section-control-button move-down"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSectionDown(index);
                  }}
                  disabled={index === sections.length - 1}
                  title="הזז למטה"
                >
                  <FiArrowDown />
                </button>
                
                {/* כפתור למחיקה */}
                <button
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('האם אתה בטוח שברצונך למחוק את הסקשן הזה?')) {
                      deleteSection(section.id);
                      showToast && showToast("הסקשן נמחק בהצלחה", "success");
                    }
                  }}
                  title="מחק"
                >
                   <FiTrash2 size={28} />
                </button>
              </div>
            </div>
            
            {/* אזור שחרור אחרי הסקשן הנוכחי */}
            <div 
              className={`drop-zone ${isDragging ? 'visible' : ''} ${activeDropZoneIndex === index + 1 ? 'active' : ''}`}
              onDragOver={(e) => handleDragOver(e, index + 1)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index + 1)}
            >
              <div className="drop-zone-label">שחרר כאן</div>
            </div>
          </React.Fragment>
        ))}
        
        {/* אם אין סקשנים, מציגים הודעה מתאימה */}
        {sections.length === 0 && !isDragging && (
          <div className="empty-canvas">
            <p>גרור רכיבים לכאן כדי ליצור את דף הבית שלך</p>
          </div>
        )}
        
        {/* אם אין סקשנים ויש גרירה, מציגים אזור שחרור גדול */}
        {sections.length === 0 && isDragging && (
          <div 
            className="drop-zone-empty"
            onDragOver={(e) => handleDragOver(e, 0)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 0)}
          >
            <div className="drop-zone-label">שחרר כאן להוספת הרכיב</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;