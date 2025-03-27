// src/components/editor/PropertyPanel.jsx
import React, { useState, useEffect } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { FiX } from 'react-icons/fi';

// ייבוא פאנלים עבור סוגי סקשנים שונים
import HeroContentPanel from './panels/ContentPanels/HeroContentPanel';
import BannerContentPanel from './panels/ContentPanels/BannerContentPanel';
import TextImageContentPanel from './panels/ContentPanels/TextImageContentPanel';
import ProductsContentPanel from './panels/ContentPanels/ProductsContentPanel';
import TestimonialsContentPanel from './panels/ContentPanels/TestimonialsContentPanel';
import CollectionsContentPanel from './panels/ContentPanels/CollectionsContentPanel';
import NewsletterContentPanel from './panels/ContentPanels/NewsletterContentPanel';
import CTAContentPanel from './panels/ContentPanels/CTAContentPanel';
import IconContentPanel from './panels/ContentPanels/IconContentPanel';
import VideoContentPanel from './panels/ContentPanels/VideoContentPanel';
import ButtonContentPanel from './panels/ContentPanels/ButtonContentPanel';
import RowContentPanel from './panels/ContentPanels/RowContentPanel';

// ייבוא פאנלים עבור סוגי סקשנים שונים (עיצוב)
import HeroStylePanel from './panels/StylePanels/HeroStylePanel';
import BannerStylePanel from './panels/StylePanels/BannerStylePanel';
import TextImageStylePanel from './panels/StylePanels/TextImageStylePanel';
import ProductsStylePanel from './panels/StylePanels/ProductsStylePanel';
import TestimonialsStylePanel from './panels/StylePanels/TestimonialsStylePanel';
import CollectionsStylePanel from './panels/StylePanels/CollectionsStylePanel';
import NewsletterStylePanel from './panels/StylePanels/NewsletterStylePanel';
import CTAStylePanel from './panels/StylePanels/CTAStylePanel';
import IconStylePanel from './panels/StylePanels/IconStylePanel';
import VideoStylePanel from './panels/StylePanels/VideoStylePanel';
import ButtonStylePanel from './panels/StylePanels/ButtonStylePanel';
import RowStylePanel from './panels/StylePanels/RowStylePanel';

// ייבוא פאנלים עבור ווידג'טים בתוך שורה
import WidgetContentPanel from './panels/WidgetPanels/WidgetContentPanel';
import WidgetStylePanel from './panels/WidgetPanels/WidgetStylePanel';

// ייבוא פאנל הגדרות משותף
import SettingsPanel from './panels/CommonPanels/SettingsPanel';

// ייבוא פאנל ריק
import EmptyPanel from './panels/CommonPanels/EmptyPanel';

const PropertyPanel = () => {
  const { 
    sections, 
    selectedSectionId, 
    updateSection 
  } = useEditor();
  
  const [activeTab, setActiveTab] = useState('content'); // 'content', 'style', 'settings'
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [selectedWidgetInfo, setSelectedWidgetInfo] = useState(null);

  // בדיקה האם ה-ID שנבחר הוא של סקשן רגיל או של ווידג'ט בתוך שורה
  useEffect(() => {
    console.log("PropertyPanel - selectedSectionId:", selectedSectionId);
    
    // ריסט של מצב הווידג'ט
    setSelectedWidget(null);
    setSelectedWidgetInfo(null);
    
    if (!selectedSectionId) return;
    
    // חיפוש האם זהו סקשן רגיל
    const isRegularSection = sections.some(section => section.id === selectedSectionId);
    
    if (!isRegularSection) {
      // אם לא נמצא כסקשן רגיל, אנחנו מחפשים אותו כווידג'ט בתוך שורה
      sections.forEach(section => {
        if (section.type === 'row' && section.columnsContent) {
          section.columnsContent.forEach((column, columnIndex) => {
            if (column && Array.isArray(column.widgets)) {
              column.widgets.forEach((widget, widgetIndex) => {
                if (widget.id === selectedSectionId) {
                  setSelectedWidget(widget);
                  setSelectedWidgetInfo({
                    parentSectionId: section.id,
                    columnIndex,
                    widgetIndex
                  });
                }
              });
            }
          });
        }
      });
    }
  }, [selectedSectionId, sections]);

  // פונקציה לעדכון ווידג'ט בתוך שורה
  const updateWidget = (widgetData) => {
    if (!selectedWidget || !selectedWidgetInfo) return;

    const { parentSectionId, columnIndex, widgetIndex } = selectedWidgetInfo;
    const section = sections.find(s => s.id === parentSectionId);
    if (!section || !section.columnsContent) return;

    // עדכון הווידג'ט
    const newColumnsContent = [...section.columnsContent];
    if (newColumnsContent[columnIndex] && 
        Array.isArray(newColumnsContent[columnIndex].widgets) &&
        newColumnsContent[columnIndex].widgets[widgetIndex]) {
      
      newColumnsContent[columnIndex].widgets[widgetIndex] = {
        ...newColumnsContent[columnIndex].widgets[widgetIndex],
        ...widgetData
      };
      
      // עדכון של כל השורה
      updateSection(parentSectionId, { columnsContent: newColumnsContent });
    }
  };

  // פונקציה שבודקת אם זה סקשן רגיל, ווידג'ט, או שום דבר לא נבחר
  const getSelectedType = () => {
    if (selectedWidget) {
      return { type: 'widget', data: selectedWidget };
    }
    
    if (selectedSectionId) {
      const section = sections.find(s => s.id === selectedSectionId);
      if (section) {
        return { type: 'section', data: section };
      }
    }
    
    return { type: 'none', data: null };
  };

  // רנדור לשוניות
  const renderTabs = () => {
    return (
      <div className="property-tabs">
        <button 
          className={`tab ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          תוכן
        </button>
        <button 
          className={`tab ${activeTab === 'style' ? 'active' : ''}`}
          onClick={() => setActiveTab('style')}
        >
          עיצוב
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          הגדרות
        </button>
      </div>
    );
  };

  // רנדור של התוכן הספציפי בהתאם ללשונית הפעילה
  const renderContent = () => {
    const { type, data } = getSelectedType();
    
    if (type === 'none') {
      return <EmptyPanel />;
    }
    
    // אם נבחר ווידג'ט בתוך שורה
    if (type === 'widget') {
      switch (activeTab) {
        case 'content':
          return <WidgetContentPanel widget={data} onChange={updateWidget} />;
        case 'style':
          return <WidgetStylePanel widget={data} onChange={updateWidget} />;
        case 'settings':
          return <SettingsPanel data={data} onChange={updateWidget} isWidget={true} />;
        default:
          return <EmptyPanel />;
      }
    }
    
    // אם נבחר סקשן רגיל
    if (type === 'section') {
      const section = data;
      
      switch (activeTab) {
        case 'content':
          return renderContentPanel(section);
        case 'style':
          return renderStylePanel(section);
        case 'settings':
          return <SettingsPanel data={section} onChange={(data) => updateSection(section.id, data)} />;
        default:
          return <EmptyPanel />;
      }
    }
  };

  // רנדור של פאנל התוכן לפי סוג הסקשן
  const renderContentPanel = (section) => {
    switch (section.type) {
      case 'hero':
        return <HeroContentPanel data={section} onChange={(data) => updateSection(section.id, data)} />;
      case 'banner':
        return <BannerContentPanel data={section} onChange={(data) => updateSection(section.id, data)} />;
      case 'text-image':
        return <TextImageContentPanel data={section} onChange={(data) => updateSection(section.id, data)} />;
      case 'products':
        return <ProductsContentPanel data={section} onChange={(data) => updateSection(section.id, data)} />;
      case 'testimonials':
        return <TestimonialsContentPanel data={section} onChange={(data) => updateSection(section.id, data)} />;
      case 'collections':
        return <CollectionsContentPanel data={section} onChange={(data) => updateSection(section.id, data)} />;
      case 'newsletter':
        return <NewsletterContentPanel data={section} onChange={(data) => updateSection(section.id, data)} />;
      case 'cta':
        return <CTAContentPanel data={section} onChange={(data) => updateSection(section.id, data)} />;
      case 'icon':
        return <IconContentPanel data={section} onChange={(data) => updateSection(section.id, data)} />;
      case 'video':
        return <VideoContentPanel data={section} onChange={(data) => updateSection(section.id, data)} />;
      case 'button':
        return <ButtonContentPanel data={section} onChange={(data) => updateSection(section.id, data)} />;
      case 'row':
        return <RowContentPanel data={section} onChange={(data) => updateSection(section.id, data)} />;
      default:
        return <div>אין הגדרות תוכן זמינות עבור רכיב זה</div>;
    }
  };

  // רנדור של פאנל העיצוב לפי סוג הסקשן
  const renderStylePanel = (section) => {
    switch (section.type) {
      case 'hero':
        return <HeroStylePanel data={section} onChange={(data) => updateSection(section.id, data)} />;
      case 'banner':
        return <BannerStylePanel data={section} onChange={(data) => updateSection(section.id, data)} />;
      case 'text-image':
        return <TextImageStylePanel data={section} onChange={(data) => updateSection(section.id, data)} />;
      case 'products':
        return <ProductsStylePanel data={section} onChange={(data) => updateSection(section.id, data)} />;
      case 'testimonials':
        return <TestimonialsStylePanel data={section} onChange={(data) => updateSection(section.id, data)} />;
      case 'collections':
        return <CollectionsStylePanel data={section} onChange={(data) => updateSection(section.id, data)} />;
      case 'newsletter':
        return <NewsletterStylePanel data={section} onChange={(data) => updateSection(section.id, data)} />;
      case 'cta':
        return <CTAStylePanel data={section} onChange={(data) => updateSection(section.id, data)} />;
      case 'icon':
        return <IconStylePanel data={section} onChange={(data) => updateSection(section.id, data)} />;
      case 'video':
        return <VideoStylePanel data={section} onChange={(data) => updateSection(section.id, data)} />;
      case 'button':
        return <ButtonStylePanel data={section} onChange={(data) => updateSection(section.id, data)} />;
      case 'row':
        return <RowStylePanel data={section} onChange={(data) => updateSection(section.id, data)} />;
      default:
        return <div>אין הגדרות עיצוב זמינות עבור רכיב זה</div>;
    }
  };

  // קביעת הכותרת לפאנל
  const getPanelTitle = () => {
    const { type, data } = getSelectedType();
    
    if (type === 'none') {
      return 'הגדרות';
    }
    
    if (type === 'widget') {
      return data.name || 'ווידג\'ט';
    }
    
    if (type === 'section') {
      switch (data.type) {
        case 'hero': return 'כותרת ראשית';
        case 'banner': return 'באנר';
        case 'text-image': return 'טקסט ותמונה';
        case 'products': return 'מוצרים';
        case 'testimonials': return 'המלצות';
        case 'collections': return 'קטגוריות';
        case 'newsletter': return 'ניוזלטר';
        case 'cta': return 'קריאה לפעולה';
        case 'icon': return 'אייקון';
        case 'video': return 'וידאו';
        case 'button': return 'כפתור';
        case 'row': return 'שורה';
        default: return 'רכיב';
      }
    }
  };

  return (
    <div className="property-panel">
      <div className="panel-header">
        <h3>{getPanelTitle()}</h3>
        <button className="panel-toggle">
          <FiX />
        </button>
      </div>
      
      {renderTabs()}
      
      <div className="panel-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default PropertyPanel;