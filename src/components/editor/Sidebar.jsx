// בקובץ Sidebar.jsx
import React from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { FiLayout, FiImage, FiGrid, FiType, FiMessageSquare, FiList } from 'react-icons/fi';

const Sidebar = () => {
  const { addSection } = useEditor();

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
      ]
    }
  ];

  // פונקציה לטיפול בתחילת גרירה
  const handleDragStart = (e, component) => {
    // שמירת מידע על האלמנט שנגרר
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: component.id,
      name: component.name
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        {COMPONENT_CATEGORIES.map((category) => (
          <div key={category.id} className="component-category">
            <h3 className="category-title">{category.title}</h3>
            
            <div className="components-grid">
              {category.components.map((component) => (
                <div
                  key={component.id}
                  className="component-item"
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, component)}
                >
                  <div className="component-icon">
                    {getIconByType(component.id)}
                  </div>
                  <div className="component-name">
                    {component.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;