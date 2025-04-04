// תיקון לקובץ Sidebar.jsx
import React from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { FiLayout, FiImage, FiGrid, FiType, FiMessageSquare, FiList, FiColumns, FiMail, FiStar, FiVideo, FiBox, FiTarget, FiAlignJustify, FiFileText } from 'react-icons/fi';


// רכיב פריט גרירה משופר
const DraggableItem = ({ component, icon }) => {
  const { addSection, setIsDragging } = useEditor();
  
  // טיפול בגרירה
  const handleDragStart = (e) => {
    // שמירת נתוני הגרירה בפורמט משותף
    const dragData = { 
      type: component.id, 
      name: component.name,
      isNew: true,
      rowCompatible: component.rowCompatible || false // מוסיף מידע על תאימות שורה
    };

    
    // שמירה בשני סוגי פורמטים לתמיכה טובה יותר בדפדפנים שונים
    e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    try {
      e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    } catch (error) {
      console.warn('Browser does not support application/json dataTransfer', error);
    }
    
    e.dataTransfer.effectAllowed = 'copy';
    
    // עדכון מצב גרירה גלובלי
    setIsDragging(true);
    
    // שמירת המידע גם בלוקל סטורג' כגיבוי
    window.localStorage.setItem('dragData', JSON.stringify(dragData));
    
    // יצירת אלמנט ויזואלי לגרירה
    try {
      const ghostElement = document.createElement('div');
      ghostElement.className = 'drag-preview';
      ghostElement.innerHTML = `<div class="component-preview">${component.name}</div>`;
      ghostElement.style.position = 'absolute';
      ghostElement.style.top = '-1000px';
      ghostElement.style.left = '-1000px';
      ghostElement.style.padding = '10px 15px';
      ghostElement.style.background = '#5271ff';
      ghostElement.style.color = 'white';
      ghostElement.style.borderRadius = '4px';
      ghostElement.style.zIndex = '9999';
      ghostElement.style.pointerEvents = 'none';
      
      document.body.appendChild(ghostElement);
      e.dataTransfer.setDragImage(ghostElement, ghostElement.offsetWidth / 2, 20);
      
      // נשמור את האלמנט כך שנוכל להסיר אותו בסיום
      window.currentDragGhost = ghostElement;
    } catch (error) {
      console.warn('Error creating drag ghost', error);
    }
  };
  
  // טיפול בסיום גרירה
  const handleDragEnd = () => {
    // ניקוי מצב גרירה גלובלי
    setIsDragging(false);
    
    // הסרת אלמנט הגרירה מה-DOM
    try {
      if (window.currentDragGhost && window.currentDragGhost.parentNode) {
        window.currentDragGhost.parentNode.removeChild(window.currentDragGhost);
        window.currentDragGhost = null;
      }
    } catch (error) {
      console.warn('Error removing drag ghost', error);
    }
  };

  // הוספת רכיב באמצעות לחיצה פשוטה
  const handleClick = () => {
    // אם זה ווידג'ט, אי אפשר להוסיף אותו ישירות לקנבס
    if (component.isWidget) {
      alert('ווידג\'טים ניתן להוסיף רק בגרירה לתוך שורת עמודות');
      return;
    }
    addSection(component.id);
  };
  
  return (
    <div
    className={`component-item ${component.rowCompatible ? 'row-compatible' : ''}`}
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
    {component.rowCompatible && (
      <div className="row-compatibility-badge" title="ניתן לגרירה בתוך שורה">
        <span className="row-icon">⊞</span>
      </div>
    )}
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
      case 'row':
        return <FiColumns size={24} />;
      case 'button':
        return <FiBox size={24} />;
      case 'image':
        return <FiImage size={24} />;
      case 'text':
        return <FiFileText size={24} />;
      case 'video':
        return <FiVideo size={24} />;
        case 'cta':
          return <FiTarget size={24} />; // החלפנו את FiZap ב-FiTarget
        case 'icon':
          return <FiStar size={24} />;
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
        { id: 'cta', name: 'קריאה לפעולה (CTA)', rowCompatible: true }, // מסומן כתואם שורה
        { id: 'row', name: 'שורה', icon: <FiAlignJustify size={24} /> }
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
        { id: 'video', name: 'וידאו' },
      ]
    },
    {
      id: 'elements',
      title: 'אלמנטים',
      components: [
        { id: 'icon', name: 'אייקון', rowCompatible: true }, // מסומן כתואם שורה
        { id: 'button', name: 'כפתור' },
        { id: 'image', name: 'תמונה', rowCompatible: true }, // גם רכיב תמונה יכול להיות בשורה
        { id: 'text', name: 'טקסט', rowCompatible: true }   // גם רכיב טקסט יכול להיות בשורה
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