import React from 'react';
import { useDrag } from 'react-dnd';
import { useEditor } from '../../contexts/EditorContext';

const DraggableComponent = ({ component, icon }) => {
  const { addSection, showToast } = useEditor();
  
  // הגדרת הרכיב כרכיב שניתן לגרור
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { 
      id: component.id, 
      name: component.name, 
      isNew: true 
    },
    // פונקציה שמבוצעת בסוף הגרירה
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      
      // אם הגרירה הסתיימה בהצלחה ולא שוחררה
      if (!dropResult) {
        console.log('הגרירה בוטלה או לא הסתיימה על אזור שחרור');
      }
    },
    // אוסף נתונים על מצב הגרירה
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [component]);

  // פונקציה שתופעל בלחיצה על הרכיב (הוספה מהירה)
  const handleClick = () => {
    addSection(component.id);
    showToast && showToast(`נוסף רכיב ${component.name}`, 'success');
  };

  return (
    <div
      ref={drag}
      className={`component-item ${isDragging ? 'dragging' : ''}`}
      onClick={handleClick}
    >
      <div className="component-icon">
        {icon}
      </div>
      <div className="component-name">
        {component.name}
      </div>
      <div className="drag-hint">גרור או לחץ להוספה</div>
    </div>
  );
};

export default DraggableComponent;