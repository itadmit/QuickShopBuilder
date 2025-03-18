// בקובץ Sidebar.jsx - שיפור מנגנון הגרירה
import React, { useState } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { FiLayout, FiImage, FiGrid, FiType, FiMessageSquare, FiList, FiColumns, FiMail } from 'react-icons/fi';

// רכיב פריט גרירה משופר
const DraggableItem = ({ component, icon }) => {
  const { addSection, setIsDragging } = useEditor();
  const [isDragging, setItemDragging] = useState(false);

  // טיפול בגרירה
  const handleDragStart = (e) => {
    // שמירת נתוני הגרירה
    const data = { 
      type: component.id, 
      name: component.name 
    };
    
    e.dataTransfer.setData('text/plain', JSON.stringify(data));
    e.dataTransfer.setData('application/json', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'copy';
    
    setItemDragging(true);
    setIsDragging(true); // עדכון מצב גרירה גלובלי
    
    // שמירת המידע גם בלוקל סטורג'
    window.localStorage.setItem('dragData', JSON.stringify(data));
    
    // יצירת אלמנט גרירה מותאם אישית
    setTimeout(() => {
      try {
        const componentItem = e.currentTarget;
        const rect = componentItem.getBoundingClientRect();
        
        // יצירת אלמנט פשוט יותר לתצוגת גרירה
        const dragPreview = document.createElement('div');
        dragPreview.innerHTML = `<div class="drag-preview"><div class="drag-preview-icon">${icon.props.size}</div><div>${component.name}</div></div>`;
        dragPreview.style.position = 'absolute';
        dragPreview.style.top = '-1000px';
        dragPreview.style.left = '-1000px';
        dragPreview.style.backgroundColor = 'white';
        dragPreview.style.padding = '8px 12px';
        dragPreview.style.borderRadius = '4px';
        dragPreview.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        dragPreview.style.zIndex = '9999';
        dragPreview.style.pointerEvents = 'none';
        dragPreview.classList.add('drag-ghost');
        
        document.body.appendChild(dragPreview);
        e.dataTransfer.setDragImage(dragPreview, dragPreview.offsetWidth / 2, 20);
      } catch (error) {
        console.warn('Error creating drag image:', error);
      }
    }, 0);
  };
  
  // טיפול בסיום גרירה
  const handleDragEnd = () => {
    setItemDragging(false);
    setIsDragging(false); // ניקוי מצב גרירה גלובלי
    
    // ניקוי אלמנטי גרירה וסטייט
    try {
      const dragGhosts = document.querySelectorAll('.drag-ghost');
      dragGhosts.forEach(ghost => {
        document.body.removeChild(ghost);
      });
    } catch (error) {
      console.warn('Error removing drag ghosts:', error);
    }
  };

  // הוספת רכיב באמצעות לחיצה
  const handleClick = () => {
    addSection(component.id);
  };
  
  return (
    <div
      className={`component-item ${isDragging ? 'dragging' : ''}`}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
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

const Sidebar = () => {
  // מיפוי אייקונים לפי ID
  const getIconByType = (type) => {
    switch(type) {
      case 'hero':
        return <FiLayout size={24} />;
      case 'banner':
        return <FiImage size={24} />;
      case 'text-image':
        return <FiType size={24} />;
      case 'products':
        return <FiGrid size={24} />;
      case 'testimonials':
        return <FiMessageSquare size={24} />;
      case 'collections':
        return <FiColumns size={24} />;
      case 'newsletter':
        return <FiMail size={24} />;
      default:
        return <FiList size={24} />;
    }
  };

  // רשימת הרכיבים הזמינים
  const COMPONENT_CATEGORIES = [
    {
      id: 'basic',
      title: 'בסיסי',
      components: [
        { id: 'hero', name: 'כותרת ראשית' },
        { id: 'banner', name: 'באנר' },
        { id: 'text-image', name: 'טקסט ותמונה' },
      ]
    },
    {
      id: 'content',
      title: 'תוכן',
      components: [
        { id: 'products', name: 'מוצרים' },
        { id: 'testimonials', name: 'המלצות' },
        { id: 'collections', name: 'קטגוריות' },
        { id: 'newsletter', name: 'ניוזלטר' },
      ]
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>רכיבים</h3>
        <p className="sidebar-helper-text">גרור רכיבים לקנבס או לחץ עליהם להוספה מהירה</p>
      </div>
      <div className="sidebar-content">
        {COMPONENT_CATEGORIES.map((category) => (
          <div key={category.id} className="component-category">
            <h3 className="category-title">{category.title}</h3>
            
            <div className="components-grid">
              {category.components.map((component) => (
                <DraggableItem
                  key={component.id}
                  component={component}
                  icon={getIconByType(component.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;