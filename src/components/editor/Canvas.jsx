import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useEditor } from '../../contexts/EditorContext';
import HeroSection from '../sections/HeroSection';
import ProductsSection from '../sections/ProductsSection';
import BannerSection from '../sections/BannerSection';
import TextWithImageSection from '../sections/TextWithImageSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import CollectionListSection from '../sections/CollectionListSection';
import NewsletterSection from '../sections/NewsletterSection';
import { FiTrash2, FiMenu } from 'react-icons/fi';

const Canvas = () => {
  const { 
    sections, 
    selectedSectionId, 
    setSelectedSectionId, 
    deleteSection, 
    draggedItem, 
    handleSidebarDrop 
  } = useEditor();

  // רינדור סקשן לפי סוג
  const renderSection = (section) => {
    switch (section.type) {
      case 'hero':
        return <HeroSection data={section} />;
      case 'products':
        return <ProductsSection data={section} />;
      case 'banner':
        return <BannerSection data={section} />;
      case 'text-image':
        return <TextWithImageSection data={section} />;
      case 'testimonials':
        return <TestimonialsSection data={section} />;
      case 'collections':
        return <CollectionListSection data={section} />;
      case 'newsletter':
        return <NewsletterSection data={section} />;
      default:
        return <div>Unknown section type: {section.type}</div>;
    }
  };

  // טיפול בגרירת אלמנט מהסיידבר
  const handleDragOver = (e) => {
    if (draggedItem) {
      e.preventDefault();
      e.stopPropagation();
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

  // רינדור של מקום לשחרור בין סקשנים
  const renderDropZones = () => {
    if (!draggedItem) return null;

    return (
      <div className="drop-zones">
        {/* אזור גרירה בתחילת הקנבס */}
        <div 
          className="drop-zone" 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 0)}
          style={{
            height: '50px',
            margin: '10px 0',
            border: '2px dashed #ccc',
            borderRadius: '8px',
            backgroundColor: 'rgba(82, 113, 255, 0.05)'
          }}
        >
          <div className="drop-zone-label">שחרר כאן</div>
        </div>

        {/* אזורי גרירה בין הסקשנים */}
        {sections.map((_, index) => (
          <div 
            key={`drop-zone-${index + 1}`}
            className="drop-zone" 
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index + 1)}
            style={{
              height: '50px',
              margin: '10px 0',
              border: '2px dashed #ccc',
              borderRadius: '8px',
              backgroundColor: 'rgba(82, 113, 255, 0.05)'
            }}
          >
            <div className="drop-zone-label">שחרר כאן</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="canvas">
      <Droppable droppableId="sections" type="SECTIONS">
 {(provided, snapshot) => (
  <div
    ref={provided.innerRef}
    {...provided.droppableProps}
    className={`canvas-area ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
    onDragOver={handleDragOver}
  >
    {sections.length === 0 && !draggedItem && (
      <div className="empty-canvas">
        <p>גרור רכיבים לכאן כדי ליצור את דף הבית שלך</p>
      </div>
    )}
    
    {draggedItem && sections.length === 0 && (
      <div
        className="drop-zone-empty"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 0)}
        style={{
          height: '150px',
          margin: '20px 0',
          border: '2px dashed #ccc',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(82, 113, 255, 0.05)'
        }}
      >
        <div className="drop-zone-label">שחרר כאן להוספת {draggedItem.name}</div>
      </div>
    )}
    
    {/* רינדור אזורי שחרור מיוחדים כשגוררים מהסיידבר */}
    {draggedItem && sections.length > 0 && renderDropZones()}
    
    {/* רינדור הסקשנים הקיימים */}
    {sections.map((section, index) => (
      <Draggable
        key={section.id}
        draggableId={section.id}
        index={index}
      >
        {(providedDrag, snapshotDrag) => (
          <div
            ref={providedDrag.innerRef}
            {...providedDrag.draggableProps}
            className={`canvas-section ${selectedSectionId === section.id ? 'selected' : ''} ${snapshotDrag.isDragging ? 'dragging' : ''}`}
            onClick={() => setSelectedSectionId(section.id)}
          >
            <div className="section-handle" {...providedDrag.dragHandleProps}>
              <FiMenu size={18} className="drag-icon" />
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
                title="מחק סקשן"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        )}
      </Draggable>
    ))}
    {provided.placeholder}
  </div>
 )}
</Droppable>
    </div>
  );
};

export default Canvas;