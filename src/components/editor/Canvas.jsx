// בקובץ Canvas.jsx
import React from 'react';
import { useEditor } from '../../contexts/EditorContext';

const Canvas = () => {
  const { 
    sections, 
    selectedSectionId, 
    setSelectedSectionId, 
    deleteSection, 
    draggedItem, 
    handleSidebarDrop 
  } = useEditor();

  // טיפול בגרירת אלמנט מהסיידבר
  const handleDragOver = (e) => {
    if (draggedItem) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  // טיפול בשחרור אלמנט מהסיידבר
  const handleDrop = (e, dropIndex) => {
    if (draggedItem) {
      e.preventDefault();
      e.stopPropagation();
      handleSidebarDrop(dropIndex);
    }
  };

  // רינדור אזורי שחרור בין הסקשנים
  const renderDropZones = () => {
    if (!draggedItem) return null;

    return Array.from({ length: sections.length + 1 }).map((_, index) => (
      <div 
        key={`drop-zone-${index}`}
        className="drop-zone" 
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, index)}
      >
        <div className="drop-zone-label">
          שחרר כאן להוספת {draggedItem.name}
        </div>
      </div>
    ));
  };

  return (
    <div 
      className="canvas"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, sections.length)}
    >
      {sections.length === 0 && !draggedItem && (
        <div className="empty-canvas">
          <p>גרור רכיבים מהצד כדי ליצור את דף הבית שלך</p>
        </div>
      )}
      
      {draggedItem && renderDropZones()}
      
      {sections.map((section, index) => (
        <React.Fragment key={section.id}>
          {draggedItem && <div className="drop-zone" onDrop={(e) => handleDrop(e, index)} />}
          
          <div 
            className={`canvas-section ${selectedSectionId === section.id ? 'selected' : ''}`}
            onClick={() => setSelectedSectionId(section.id)}
            data-id={section.id}
            data-type={section.type}
          >
            <div className="section-content">
              {/* רנדור של הסקשן בהתאם לסוג */}
              {/* ... */}
            </div>
            <div className="section-actions">
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSection(section.id);
                }}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
          
          {draggedItem && index === sections.length - 1 && (
            <div className="drop-zone" onDrop={(e) => handleDrop(e, index + 1)} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Canvas;