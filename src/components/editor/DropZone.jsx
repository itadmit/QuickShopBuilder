// קובץ DropZone.jsx - יש ליצור אותו בתיקייה components/editor
import React, { useState, useRef } from 'react';
import { FiPlus, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useEditor } from '../../contexts/EditorContext';

const DropZone = ({ isActive, index, onDrop, isFirst = false, isLast = false }) => {
  const [isOver, setIsOver] = useState(false);
  const dropZoneRef = useRef(null);
  const { dropIndicatorIndex } = useEditor();
  
  // בדיקה אם אזור השחרור הנוכחי מסומן
  const isHighlighted = dropIndicatorIndex === index;

  // קביעת אייקון והודעה מתאימים לפי המיקום
  let icon = <FiPlus />;
  let message = 'גרור רכיב לכאן';
  let highlightMessage = 'שחרר כאן ליצירת רכיב חדש';
  
  if (isFirst) {
    icon = <FiArrowUp />;
    message = 'גרור רכיב לראש הדף';
    highlightMessage = 'שחרר כאן להוספה בראש הדף';
  } else if (isLast) {
    icon = <FiArrowDown />;
    message = 'גרור רכיב לסוף הדף';
    highlightMessage = 'שחרר כאן להוספה בסוף הדף';
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsOver(true);
    
    // דאגה שהסקשן הקרוב ידע שגוררים מעליו או מתחתיו
    if (dropZoneRef.current) {
      const rect = dropZoneRef.current.getBoundingClientRect();
      
      // מציאת הסקשן הקרוב
      if (isFirst) {
        const nextSection = dropZoneRef.current.nextElementSibling;
        if (nextSection && nextSection.classList.contains('canvas-section')) {
          nextSection.classList.add('highlight-above');
        }
      } else if (isLast) {
        const prevSection = dropZoneRef.current.previousElementSibling;
        if (prevSection && prevSection.classList.contains('canvas-section')) {
          prevSection.classList.add('highlight-below');
        }
      } else {
        const prevSection = dropZoneRef.current.previousElementSibling;
        const nextSection = dropZoneRef.current.nextElementSibling;
        if (prevSection && prevSection.classList.contains('canvas-section')) {
          prevSection.classList.add('highlight-below');
        }
        if (nextSection && nextSection.classList.contains('canvas-section')) {
          nextSection.classList.add('highlight-above');
        }
      }
    }
  };

  const handleDragLeave = () => {
    setIsOver(false);
    
    // הסרת הסמנים מהסקשנים
    clearSectionHighlights();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    
    // הסרת הסמנים מהסקשנים
    clearSectionHighlights();
    
    // קריאה לפונקציית השחרור
    onDrop(index);
  };
  
  // פונקציה להסרת הסמנים מכל הסקשנים
  const clearSectionHighlights = () => {
    document.querySelectorAll('.canvas-section').forEach(section => {
      section.classList.remove('highlight-above');
      section.classList.remove('highlight-below');
    });
  };

  return (
    <div 
      ref={dropZoneRef}
      className={`drop-zone ${isOver ? 'drag-over' : ''} ${isHighlighted ? 'active' : ''} ${isActive ? 'visible' : ''} ${isFirst ? 'first' : ''} ${isLast ? 'last' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="drop-zone-label">
        <span className="drop-indicator">{icon}</span>
        {isOver || isHighlighted ? highlightMessage : message}
      </div>
    </div>
  );
};

export default DropZone;