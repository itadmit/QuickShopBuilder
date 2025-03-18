// בקובץ Editor.jsx
import React, { useEffect } from 'react';
import { useEditor } from '../../contexts/EditorContext';
// ייבוא כל הסקשנים
import HeroSection from '../sections/HeroSection';
import BannerSection from '../sections/BannerSection';
import TextWithImageSection from '../sections/TextWithImageSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import ProductsSection from '../sections/ProductsSection';
import CollectionListSection from '../sections/CollectionListSection';
import NewsletterSection from '../sections/NewsletterSection';

// ייבוא רכיבי הממשק
import Toolbar from './Toolbar';
import Sidebar from './Sidebar';
import PropertyPanel from './PropertyPanel';

const Editor = () => {
  const { 
    sections, 
    loadLayout,
    addSection,
    reorderSections,
    selectedSectionId,
    setSelectedSectionId
  } = useEditor();

  // טעינת הלייאאוט בטעינה הראשונית
  useEffect(() => {
    console.log("Editor mounted, loading layout");
    loadLayout();
  }, [loadLayout]);

  // פונקציה לרנדור סקשן לפי סוג
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
      default:
        return <div>סוג סקשן לא מוכר: {section.type}</div>;
    }
  };

  // פונקציות גרירה HTML5 native
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data && data.type) {
        // מוסיף את הסקשן בסוף הרשימה
        addSection(data.type, sections.length);
      }
    } catch (error) {
      console.error('Error processing drop:', error);
    }
  };

  return (
    <div className="editor-container">
      {/* סרגל כלים עליון */}
      <Toolbar />
      
      <div className="editor-workspace">
        {/* סיידבר */}
        <Sidebar />
        
        {/* אזור הקנבס המרכזי */}
        <div className="canvas">
          <div 
            className="canvas-area"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {sections.map((section, index) => (
              <div
                key={section.id}
                className={`canvas-section ${selectedSectionId === section.id ? 'selected' : ''}`}
                onClick={() => setSelectedSectionId(section.id)}
              >
                <div className="section-handle">
                  <i className="drag-icon"></i>
                </div>
                <div className="section-content">
                  {renderSection(section)}
                </div>
              </div>
            ))}
            
            {sections.length === 0 && (
              <div className="empty-canvas">
                <p>גרור רכיבים לכאן כדי ליצור את דף הבית שלך</p>
              </div>
            )}
          </div>
        </div>
        
        {/* פאנל מאפיינים */}
        <PropertyPanel />
      </div>
    </div>
  );
};

export default Editor;