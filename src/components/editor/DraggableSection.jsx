import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useEditor } from '../../contexts/EditorContext';
import HeroSection from '../sections/HeroSection';
import BannerSection from '../sections/BannerSection';
import TextWithImageSection from '../sections/TextWithImageSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import ProductsSection from '../sections/ProductsSection';
import CollectionListSection from '../sections/CollectionListSection';
import NewsletterSection from '../sections/NewsletterSection';
import { FiMove, FiTrash2, FiCopy, FiChevronUp, FiChevronDown } from 'react-icons/fi';

const DraggableSection = ({ section, index, moveSection }) => {
  const ref = useRef(null);
  const handleRef = useRef(null);
  
  const { selectedSectionId, setSelectedSectionId, deleteSection, addSection, sections } = useEditor();
  const isSelected = selectedSectionId === section.id;

  // הגדרת הרכיב כרכיב שניתן לגרור
  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: 'SECTION',
    item: { id: section.id, index, type: 'SECTION' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // הגדרת הרכיב כאזור שחרור (גם מקבל גרירה)
  const [{ handlerId, isOver, canDrop }, drop] = useDrop({
    accept: ['COMPONENT', 'SECTION'],
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }

      // אין לעשות כלום אם גוררים את עצמו
      if (item.type === 'SECTION' && item.index === index) {
        return;
      }

      // קבלת מיקום הריחוף
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // האם בחצי העליון או התחתון של הרכיב
      const isInUpperHalf = hoverClientY < hoverMiddleY;

      // אם זה רכיב חדש מהסיידבר
      if (item.isNew) {
        // לא מבצעים הוספה בזמן hover, רק בdrop
        return;
      }

      // אם זה סקשן קיים (גרירה מסקשן אחד למיקום חדש)
      if (item.type === 'SECTION') {
        // יש לבצע החלפה רק אם חוצים את אמצע האזור
        if (
          (item.index < index && !isInUpperHalf) ||
          (item.index > index && isInUpperHalf)
        ) {
          // הזזת הסקשן
          moveSection(item.index, index);
          
          // עדכון האינדקס של הפריט הנגרר
          item.index = index;
        }
      }
    },
    drop(item, monitor) {
      if (!ref.current) {
        return;
      }

      // אם זה רכיב חדש מהסיידבר
      if (item.isNew) {
        const hoverBoundingRect = ref.current.getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
        
        // אם במחצית העליונה - הוסף מעל, אחרת מתחת
        if (hoverClientY < hoverMiddleY) {
          addSection(item.id, index);
        } else {
          addSection(item.id, index + 1);
        }
        
        return { dropped: true };
      }
      
      return undefined;
    }
  });

  // שילוב הגרירה והשחרור
  dragPreview(drop(ref)); // כל הרכיב הוא preview לגרירה וגם אזור שחרור
  drag(handleRef); // רק הידית היא אזור שממנו ניתן לגרור

  // פונקציה להעתקת סקשן
  const handleDuplicate = (e) => {
    e.stopPropagation();
    
    // יצירת עותק של הסקשן
    const newSection = JSON.parse(JSON.stringify(section));
    newSection.id = `section-${Date.now()}`;
    
    // הוספת הסקשן המשוכפל אחרי המקורי
    const newSections = [...sections];
    newSections.splice(index + 1, 0, newSection);
    
    // עדכון הסקשנים
    // setSections(newSections);
    
    // או לחלופין להשתמש בפונקציית ה-addSection אם יש צורך בלוגיקה נוספת
    // TODO: לממש את הלוגיקה של שכפול סקשן
  };

  // פונקציה לרנדור תוכן הסקשן
  const renderSectionContent = () => {
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

  // חיווי ויזואלי לאזור השחרור
  let dropIndicator = null;
  if (isOver && canDrop) {
    const hoverBoundingRect = ref.current?.getBoundingClientRect();
    const clientOffset = window.lastClientY || 0; // שימוש במיקום אחרון ידוע אם אין עדכני
    const hoverClientY = clientOffset - (hoverBoundingRect?.top || 0);
    const hoverMiddleY = ((hoverBoundingRect?.bottom || 0) - (hoverBoundingRect?.top || 0)) / 2;
    
    const isInUpperHalf = hoverClientY < hoverMiddleY;
    
    if (isInUpperHalf) {
      dropIndicator = <div className="drop-indicator-line top"></div>;
    } else {
      dropIndicator = <div className="drop-indicator-line bottom"></div>;
    }
  }

  return (
    <div
      ref={ref}
      className={`canvas-section ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''} ${isOver && canDrop ? 'hover-active' : ''}`}
      onClick={() => setSelectedSectionId(section.id)}
      data-handler-id={handlerId}
    >
      {dropIndicator}
      
      <div 
        ref={handleRef}
        className="section-handle" 
        title="גרור כדי לסדר מחדש"
      >
        <FiMove />
      </div>
      
      <div className="section-content">
        {renderSectionContent()}
      </div>
      
      <div className="section-actions">
        <button 
          className="section-action-button move-up"
          onClick={(e) => {
            e.stopPropagation();
            if (index > 0) {
              moveSection(index, index - 1);
            }
          }}
          title="הזז למעלה"
          disabled={index === 0}
        >
          <FiChevronUp />
        </button>
        <button 
          className="section-action-button move-down"
          onClick={(e) => {
            e.stopPropagation();
            if (index < sections.length - 1) {
              moveSection(index, index + 1);
            }
          }}
          title="הזז למטה"
          disabled={index === sections.length - 1}
        >
          <FiChevronDown />
        </button>
        <button 
          className="section-action-button duplicate"
          onClick={handleDuplicate}
          title="שכפל רכיב"
        >
          <FiCopy />
        </button>
        <button 
          className="section-action-button delete"
          onClick={(e) => {
            e.stopPropagation();
            deleteSection(section.id);
          }}
          title="מחק רכיב"
        >
          <FiTrash2 />
        </button>
      </div>
      
      {isDragging && (
        <div className="drag-overlay">
          <div className="drag-message">גורר...</div>
        </div>
      )}
    </div>
  );
};

export default DraggableSection;