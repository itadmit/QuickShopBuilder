import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useEditor } from '../../contexts/EditorContext';
import { 
  FiType, 
  FiImage, 
  FiVideo, 
  FiGrid, 
  FiList, 
  FiLayers, 
  FiChevronDown, 
  FiChevronUp, 
  FiMail,
  FiSearch 
} from 'react-icons/fi';
import { BsCardHeading, BsLayoutTextWindow, BsChat } from 'react-icons/bs';
import { HiOutlineTemplate } from 'react-icons/hi';

// רכיבים זמינים לגרירה לתוך הבילדר
const COMPONENT_CATEGORIES = [
  {
    id: 'basic',
    title: 'בסיסי',
    components: [
      { id: 'hero', name: 'כותרת ראשית', icon: <BsCardHeading /> },
      { id: 'banner', name: 'באנר', icon: <HiOutlineTemplate /> },
      { id: 'text-image', name: 'טקסט ותמונה', icon: <BsLayoutTextWindow /> },
    ]
  },
  {
    id: 'content',
    title: 'תוכן',
    components: [
      { id: 'products', name: 'מוצרים', icon: <FiGrid /> },
      { id: 'collections', name: 'קטגוריות', icon: <FiLayers /> },
      { id: 'testimonials', name: 'המלצות', icon: <BsChat /> },
    ]
  },
  {
    id: 'media',
    title: 'מדיה',
    components: [
      { id: 'gallery', name: 'גלריה', icon: <FiImage /> },
      { id: 'video', name: 'וידאו', icon: <FiVideo /> },
    ]
  },
  {
    id: 'forms',
    title: 'טפסים',
    components: [
      { id: 'newsletter', name: 'ניוזלטר', icon: <FiMail /> },
      { id: 'contact', name: 'צור קשר', icon: <FiList /> },
    ]
  },
];

const Sidebar = () => {
  const { addSection, handleSidebarDragStart } = useEditor();
  // מצב לשמירת מצב קטגוריות פתוחות/סגורות
  const [expandedCategories, setExpandedCategories] = useState(
    COMPONENT_CATEGORIES.reduce((acc, category) => ({ ...acc, [category.id]: true }), {})
  );
  // טאב פעיל
  const [activeTab, setActiveTab] = useState('components'); // components, templates, layers
  // חיפוש
  const [searchQuery, setSearchQuery] = useState('');

  // פונקציה להוספת סקשן באמצעות לחיצה
  const handleAddComponent = (componentType) => {
    addSection(componentType);
  };

  // פונקציה להחלפת מצב קטגוריה (פתוח/סגור)
  const toggleCategory = (categoryId) => {
    setExpandedCategories({
      ...expandedCategories,
      [categoryId]: !expandedCategories[categoryId]
    });
  };

  // פונקציה לטיפול בתחילת גרירה נטיבית (fallback ל-react-beautiful-dnd)
  const handleNativeDragStart = (e, component) => {
    // הגדרת הנתונים שיועברו בגרירה
    e.dataTransfer.setData('text/plain', JSON.stringify({
      type: component.id,
      name: component.name
    }));
    
    // עדכון הקונטקסט עם נתוני הגרירה
    handleSidebarDragStart({
      type: component.id,
      name: component.name
    });
  };

  // סינון רכיבים לפי חיפוש
  const filteredCategories = searchQuery.trim() === '' 
    ? COMPONENT_CATEGORIES 
    : COMPONENT_CATEGORIES.map(category => ({
        ...category,
        components: category.components.filter(comp => 
          comp.name.includes(searchQuery) || comp.id.includes(searchQuery)
        )
      })).filter(category => category.components.length > 0);

  return (
    <div className="sidebar">
      {/* טאבים */}
      <div className="sidebar-tabs">
        <button 
          className={`sidebar-tab ${activeTab === 'components' ? 'active' : ''}`}
          onClick={() => setActiveTab('components')}
        >
          רכיבים
        </button>
        <button 
          className={`sidebar-tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          תבניות
        </button>
        <button 
          className={`sidebar-tab ${activeTab === 'layers' ? 'active' : ''}`}
          onClick={() => setActiveTab('layers')}
        >
          שכבות
        </button>
      </div>

      {/* תיבת חיפוש */}
      <div className="sidebar-search">
        <div className="search-input">
          <input 
            type="text" 
            placeholder="חיפוש..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon"><FiSearch /></span>
        </div>
      </div>

      {/* תוכן הטאב הפעיל */}
      {activeTab === 'components' ? (
        // תצוגת רכיבים
        <div className="sidebar-content">
          {filteredCategories.map((category) => (
            <div key={category.id} className="component-category">
              <h3 
                className="category-title"
                onClick={() => toggleCategory(category.id)}
              >
                {category.title} 
                {expandedCategories[category.id] ? <FiChevronUp /> : <FiChevronDown />}
              </h3>
              
              {expandedCategories[category.id] && (
                <Droppable 
                  droppableId={`category-${category.id}`} 
                  type="COMPONENTS"
                  isDropDisabled={true}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="components-grid"
                    >
                      {category.components.map((component, index) => (
                        <Draggable
                          key={component.id}
                          draggableId={`component-${component.id}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`component-item ${snapshot.isDragging ? 'dragging' : ''}`}
                              onClick={() => handleAddComponent(component.id)}
                              draggable="true"
                              onDragStart={(e) => handleNativeDragStart(e, component)}
                            >
                              <div className="component-icon">
                                {component.icon}
                              </div>
                              <div className="component-name">
                                {component.name}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </div>
          ))}
        </div>
      ) : activeTab === 'templates' ? (
        // תצוגת תבניות
        <div className="sidebar-content">
          <div className="template-list">
            <div className="template-item">
              <div className="template-name">דף בית מודרני</div>
              <div className="template-description">דף בית לחנות מודרנית עם הדגשת מוצרים מובחרים</div>
            </div>
            <div className="template-item">
              <div className="template-name">דף בית מינימליסטי</div>
              <div className="template-description">עיצוב נקי ומינימליסטי לחנות אופנה</div>
            </div>
            <div className="template-item">
              <div className="template-name">דף בית לקפה</div>
              <div className="template-description">עיצוב מותאם לבתי קפה ומסעדות</div>
            </div>
          </div>
        </div>
      ) : (
        // תצוגת שכבות
        <div className="layers-view">
          <p className="info-message">
            <span className="info-icon"><FiLayers /></span>
            תצוגת שכבות תהיה זמינה בקרוב
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;