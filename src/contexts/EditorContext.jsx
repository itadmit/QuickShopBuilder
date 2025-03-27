import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import builderService from '../api/builderService';

// יצירת קונטקסט
const EditorContext = createContext();

// Hook לשימוש בקונטקסט
export function useEditor() {
  return useContext(EditorContext);
}

// ספק הקונטקסט
export function EditorProvider({ children }) {
  // states
  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState('desktop');
  const [isLoading, setIsLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragImageElement, setDragImageElement] = useState(null);
  const [dropIndicatorIndex, setDropIndicatorIndex] = useState(null);

  // State חדש למעקב אחר ווידג'טים בתוך עמודות
  const [selectedWidgetInfo, setSelectedWidgetInfo] = useState(null);

  // משתני state נוספים
  const [storeData, setStoreData] = useState({
    storeId: window.SERVER_DATA?.storeId || null,
    storeName: window.SERVER_DATA?.storeName || '',
    storeSlug: window.SERVER_DATA?.storeSlug || '',
    userId: window.SERVER_DATA?.userId || null,
    apiBasePath: window.SERVER_DATA?.apiBasePath || '/builder/api'
  });

  // מידע על הגרירה הנוכחית
  const dragInfo = useRef({
    startX: 0,
    startY: 0,
    initialIndex: null,
    currentIndex: null,
    isDraggingSection: false
  });

  // הסקשן הנבחר הנוכחי
  const selectedSection = selectedSectionId 
    ? sections.find(section => section.id === selectedSectionId) 
    : null;

  // פונקציה להצגת הודעות טוסט
  const showToast = useCallback((message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;
    toast.innerHTML = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('visible');
      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
    }, 10);
  }, []);

  // פונקציה למציאת ווידג'ט נבחר בתוך עמודות
  const findSelectedWidget = useCallback(() => {
    if (!selectedSectionId) return null;

    let foundWidget = null;
    let foundParentId = null;
    let foundColIndex = null;
    let foundWidgetIndex = null;

    for (const section of sections) {
      if (section.type === 'row' && Array.isArray(section.columnsContent)) {
        for (let colIndex = 0; colIndex < section.columnsContent.length; colIndex++) {
          const column = section.columnsContent[colIndex];
          if (column && Array.isArray(column.widgets)) {
            for (let widgetIndex = 0; widgetIndex < column.widgets.length; widgetIndex++) {
              const widget = column.widgets[widgetIndex];
              if (widget && widget.id === selectedSectionId) {
                foundWidget = widget;
                foundParentId = section.id;
                foundColIndex = colIndex;
                foundWidgetIndex = widgetIndex;
                break;
              }
            }
            if (foundWidget) break;
          }
        }
        if (foundWidget) break;
      }
    }

    if (foundWidget) {
      const shouldUpdateInfo = !selectedWidgetInfo || 
        selectedWidgetInfo.parentSectionId !== foundParentId ||
        selectedWidgetInfo.columnIndex !== foundColIndex ||
        selectedWidgetInfo.widgetIndex !== foundWidgetIndex;
      if (shouldUpdateInfo) {
        setTimeout(() => {
          setSelectedWidgetInfo({
            parentSectionId: foundParentId,
            columnIndex: foundColIndex,
            widgetIndex: foundWidgetIndex
          });
        }, 0);
      }
      return foundWidget;
    }

    if (selectedWidgetInfo) {
      const { parentSectionId, columnIndex, widgetIndex } = selectedWidgetInfo;
      const parentSection = sections.find(section => section.id === parentSectionId);
      if (
        parentSection &&
        parentSection.columnsContent &&
        parentSection.columnsContent[columnIndex] &&
        Array.isArray(parentSection.columnsContent[columnIndex].widgets)
      ) {
        const widget = parentSection.columnsContent[columnIndex].widgets[widgetIndex];
        if (widget) return widget;
      }
      setTimeout(() => {
        setSelectedWidgetInfo(null);
      }, 0);
    }

    return null;
  }, [selectedSectionId, sections, selectedWidgetInfo]);

  // פונקציה לעדכון ווידג'ט בתוך עמודה
  const updateWidgetInColumn = useCallback((widgetId, data) => {
    if (!selectedWidgetInfo) {
      for (const section of sections) {
        if (section.type !== 'row' || !Array.isArray(section.columnsContent)) continue;
        for (let colIndex = 0; colIndex < section.columnsContent.length; colIndex++) {
          const column = section.columnsContent[colIndex];
          if (!column || !Array.isArray(column.widgets)) continue;
          for (let widgetIndex = 0; widgetIndex < column.widgets.length; widgetIndex++) {
            const widget = column.widgets[widgetIndex];
            if (widget && widget.id === widgetId) {
              const newSections = [...sections];
              const targetSection = newSections.find(s => s.id === section.id);
              if (!targetSection) continue;
              const updatedWidget = { ...widget, ...data };
              targetSection.columnsContent[colIndex].widgets[widgetIndex] = updatedWidget;
              setSections(newSections);
              return;
            }
          }
        }
      }
    } else {
      const { parentSectionId, columnIndex, widgetIndex } = selectedWidgetInfo;
      setSections(prevSections => {
        return prevSections.map(section => {
          if (section.id !== parentSectionId) return section;
          if (
            !section.columnsContent ||
            !section.columnsContent[columnIndex] ||
            !Array.isArray(section.columnsContent[columnIndex].widgets) ||
            !section.columnsContent[columnIndex].widgets[widgetIndex]
          ) {
            return section;
          }
          const newColumnsContent = [...section.columnsContent];
          const newWidgets = [...newColumnsContent[columnIndex].widgets];
          newWidgets[widgetIndex] = { ...newWidgets[widgetIndex], ...data };
          newColumnsContent[columnIndex] = { ...newColumnsContent[columnIndex], widgets: newWidgets };
          return { ...section, columnsContent: newColumnsContent };
        });
      });
    }
  }, [sections, selectedWidgetInfo]);

  // פונקציה למחיקת ווידג'ט מעמודה
  const deleteWidgetFromColumn = useCallback((widgetId) => {
    if (!selectedWidgetInfo && !widgetId) return;

    if (!selectedWidgetInfo) {
      for (const section of sections) {
        if (section.type !== 'row' || !Array.isArray(section.columnsContent)) continue;
        for (let colIndex = 0; colIndex < section.columnsContent.length; colIndex++) {
          const column = section.columnsContent[colIndex];
          if (!column || !Array.isArray(column.widgets)) continue;
          const widgetIndex = column.widgets.findIndex(w => w.id === widgetId);
          if (widgetIndex !== -1) {
            setSections(prevSections => {
              const newSections = [...prevSections];
              const targetSection = newSections.find(s => s.id === section.id);
              if (!targetSection) return prevSections;
              const newColumnsContent = [...targetSection.columnsContent];
              const newWidgets = [...newColumnsContent[colIndex].widgets];
              newWidgets.splice(widgetIndex, 1);
              newColumnsContent[colIndex] = { ...newColumnsContent[colIndex], widgets: newWidgets };
              targetSection.columnsContent = newColumnsContent;
              return newSections;
            });
            if (selectedSectionId === widgetId) {
              setSelectedSectionId(null);
              setSelectedWidgetInfo(null);
            }
            return;
          }
        }
      }
    } else {
      const { parentSectionId, columnIndex, widgetIndex } = selectedWidgetInfo;
      setSections(prevSections => {
        return prevSections.map(section => {
          if (section.id !== parentSectionId) return section;
          if (
            !section.columnsContent ||
            !section.columnsContent[columnIndex] ||
            !Array.isArray(section.columnsContent[columnIndex].widgets) ||
            !section.columnsContent[columnIndex].widgets[widgetIndex]
          ) {
            return section;
          }
          const newColumnsContent = [...section.columnsContent];
          const newWidgets = [...newColumnsContent[columnIndex].widgets];
          newWidgets.splice(widgetIndex, 1);
          newColumnsContent[columnIndex] = { ...newColumnsContent[columnIndex], widgets: newWidgets };
          return { ...section, columnsContent: newColumnsContent };
        });
      });
      setSelectedSectionId(null);
      setSelectedWidgetInfo(null);
    }
  }, [sections, selectedSectionId, selectedWidgetInfo]);

  // פונקציה ליצירת סקשן ריק לפי סוג
  const createEmptySection = (sectionType) => {
    const id = `section-${Date.now()}`;
    const defaultTypeSections = {
      hero: {
        id,
        type: 'hero',
        title: 'כותרת ראשית',
        subtitle: 'כותרת משנה',
        buttonText: 'קנה עכשיו',
        buttonLink: '/collections/all',
        backgroundImage: '/builder/build/images/placeholders/hero-bg.jpg'
      },
      cta: {
        id,
        type: 'cta',
        title: 'כותרת CTA',
        content: 'תוכן כאן יעודד את המשתמשים לפעולה',
        buttonText: 'לחץ כאן',
        buttonLink: '#',
        image: '/builder/build/images/placeholders/cta-bg.jpg',
        overlayType: 'bottom',
        overlayOpacity: 0.5,
      },
      icon: {
        id,
        type: 'icon',
        iconName: 'FiStar',
        iconSize: 40,
        iconColor: '#5271ff',
        iconStrokeWidth: 2,
        iconAlignment: 'center',
        title: 'כותרת אייקון',
        content: 'תוכן טקסט שמתאר את האייקון',
      },
      products: {
        id,
        type: 'products',
        title: 'מוצרים מובחרים',
        products: [],
        count: 4
      },
      banner: {
        id,
        type: 'banner',
        title: 'מבצע מיוחד',
        subtitle: 'הנחה של 20% על כל החנות',
        buttonText: 'למבצע',
        buttonLink: '/collections/sale',
        backgroundImage: '/builder/build/images/placeholders/banner-bg.jpg'
      },
      'text-image': {
        id,
        type: 'text-image',
        title: 'על החנות שלנו',
        content: 'כאן מופיע תוכן טקסטואלי על החנות',
        image: '/builder/build/images/placeholders/about-img.jpg',
        imagePosition: 'right'
      },
      testimonials: {
        id,
        type: 'testimonials',
        title: 'לקוחות ממליצים',
        testimonials: [
          { id: 1, author: 'ישראל ישראלי', content: 'שירות מעולה ומוצרים איכותיים!' },
          { id: 2, author: 'חנה כהן', content: 'המשלוח הגיע מהר והמוצר היה מושלם.' }
        ]
      },
      collections: {
        id,
        type: 'collections',
        title: 'קטגוריות פופולריות',
        collections: [],
        count: 3
      },
      newsletter: {
        id,
        type: 'newsletter',
        title: 'הצטרפו לניוזלטר שלנו',
        subtitle: 'קבלו עדכונים ומבצעים ישירות למייל',
        buttonText: 'הרשמה',
        backgroundImage: null,
        backgroundColor: '#f7f7f7'
      },
      row: {
        id,
        type: 'row',
        columns: 2,
        columnsContent: [
          { widgets: [] },
          { widgets: [] }
        ],
        columnGap: 20,
        columnWidths: [50, 50],
        columnsResponsive: true,
        columnBackgroundColor: 'rgba(248, 249, 251, 0.7)'
      },
      button: {
        id,
        type: 'button',
        title: '',
        buttonText: 'לחץ כאן',
        buttonLink: '#',
        alignment: 'center',
        buttonSize: 'medium',
        buttonStyle: 'filled',
        buttonColor: '#5271ff',
        buttonTextColor: '#ffffff'
      },
      image: {
        id,
        type: 'image',
        title: '',
        image: '/builder/build/images/placeholders/image-placeholder.jpg',
        altText: 'תמונה',
        alignment: 'center'
      },
      text: {
        id,
        type: 'text',
        title: 'כותרת',
        content: 'הזן כאן את הטקסט שלך',
        alignment: 'right',
        contentColor: '#444444'
      },
      video: {
        id,
        type: 'video',
        title: '',
        videoUrl: '',
        videoType: 'youtube',
        aspectRatio: '16:9',
        alignment: 'center'
      }
    };
    return defaultTypeSections[sectionType] || defaultTypeSections['text-image'];
  };

  // פונקציה להוספת סקשן חדש
  const addSection = useCallback((sectionType, position = sections.length) => {
    console.log(`Adding section of type ${sectionType} at position ${position}`);
    const newSection = createEmptySection(sectionType);
    const newSections = [...sections];
    newSections.splice(position, 0, newSection);
    setSections(newSections);
    setSelectedSectionId(newSection.id);
    showToast(`נוסף רכיב ${getSectionName(sectionType)}`, 'success');
    return newSection.id;
  }, [sections, showToast]);

  // פונקציה לעדכון סקשן קיים
  const updateSection = useCallback((sectionId, data) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId ? { ...section, ...data } : section
      )
    );
  }, []);

  // פונקציה למחיקת סקשן
  const deleteSection = useCallback((sectionId) => {
    setSections(prevSections => prevSections.filter(section => section.id !== sectionId));
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
    }
  }, [selectedSectionId]);

  // פונקציה לשינוי סדר הסקשנים
  const reorderSections = useCallback((sourceIndex, destinationIndex) => {
    console.log(`Reordering section from index ${sourceIndex} to index ${destinationIndex}`);
    if (sourceIndex < 0 || destinationIndex < 0 ||
        sourceIndex >= sections.length || destinationIndex >= sections.length) {
      console.warn('Invalid indices for reordering:', sourceIndex, destinationIndex);
      return;
    }
    if (sourceIndex === destinationIndex) {
      console.log('Source and destination indices are the same, no reordering needed');
      return;
    }
    const result = Array.from(sections);
    const [removed] = result.splice(sourceIndex, 1);
    result.splice(destinationIndex, 0, removed);
    setSections(result);
    console.log('Sections reordered successfully');
    setSelectedSectionId(removed.id);
  }, [sections, setSelectedSectionId]);

  // פונקציה לניקוי אלמנטי גרירה מה-DOM
  const cleanupDragElements = useCallback(() => {
    if (dragImageElement) {
      try {
        if (dragImageElement.parentNode) {
          dragImageElement.parentNode.removeChild(dragImageElement);
        }
      } catch (error) {
        console.warn('שגיאה בהסרת אלמנט גרירה ראשי:', error);
      }
      setDragImageElement(null);
    }
    try {
      document.querySelectorAll('.drag-ghost, .section-drag-ghost, .drag-image').forEach(element => {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    } catch (error) {
      console.warn('שגיאה בהסרת אלמנטי גרירה נוספים:', error);
    }
  }, [dragImageElement]);

  // עדכון מיקום אלמנט הגרירה
  const updateDragImagePosition = useCallback((e) => {
    if (dragImageElement) {
      dragImageElement.style.left = `${e.clientX}px`;
      dragImageElement.style.top = `${e.clientY}px`;
    }
  }, [dragImageElement]);

  // סיום גרירה
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggedItem(null);
    setDropIndicatorIndex(null);
    cleanupDragElements();
    document.removeEventListener('dragover', updateDragImagePosition);
    dragInfo.current = {
      startX: 0,
      startY: 0,
      initialIndex: null,
      currentIndex: null,
      isDraggingSection: false
    };
    window.localStorage.removeItem('dragData');
  }, [cleanupDragElements, updateDragImagePosition]);

  // טיפול בגרירת רכיב חדש מהסיידבר
  const handleSidebarDragStart = useCallback((item) => {
    console.log('התחלת גרירת רכיב חדש:', item);
    setDraggedItem(item);
    setIsDragging(true);
    window.localStorage.setItem('dragData', JSON.stringify({
      type: item.type,
      name: item.name,
      isNew: true
    }));
    const dragImage = document.createElement('div');
    dragImage.className = 'drag-ghost';
    dragImage.innerHTML = `
      <div class="drag-ghost-inner">
        <span>${getSectionName(item.type)}</span>
      </div>
    `;
    dragImage.style.position = 'fixed';
    dragImage.style.top = '0';
    dragImage.style.left = '0';
    dragImage.style.transform = 'translate(-50%, -50%)';
    dragImage.style.pointerEvents = 'none';
    dragImage.style.zIndex = '9999';
    document.body.appendChild(dragImage);
    setDragImageElement(dragImage);
    document.addEventListener('dragover', updateDragImagePosition);
    return dragImage;
  }, [updateDragImagePosition]);

  // טיפול בשחרור רכיב מהסיידבר
  const handleSidebarDrop = useCallback((dropIndex) => {
    console.log('שחרור רכיב במיקום:', dropIndex);
    const dragDataStr = window.localStorage.getItem('dragData');
    if (dragDataStr) {
      try {
        const dragData = JSON.parse(dragDataStr);
        if (dragData.isNew) {
          console.log('מוסיף רכיב חדש מסוג', dragData.type, 'במיקום', dropIndex);
          addSection(dragData.type, dropIndex);
          showToast && showToast(`נוסף רכיב חדש מסוג ${dragData.name || dragData.type}`, "success");
        }
      } catch (error) {
        console.error('שגיאה בעיבוד נתוני גרירה מלוקל סטורג\':', error);
      }
    } else if (draggedItem) {
      addSection(draggedItem.type, dropIndex);
    }
    handleDragEnd();
  }, [draggedItem, addSection, handleDragEnd, showToast]);

  // טיפול בהתחלת גרירת סקשן קיים
  const handleSectionDragStart = useCallback((e, sectionId, index) => {
    console.log('התחלת גרירת סקשן קיים:', sectionId, 'ממיקום', index);
    dragInfo.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialIndex: index,
      currentIndex: index,
      isDraggingSection: true
    };
    window.localStorage.setItem('dragData', JSON.stringify({
      id: sectionId,
      index: index,
      type: 'SECTION',
      isNew: false
    }));
    setIsDragging(true);
    const section = sections[index];
    const dragImage = document.createElement('div');
    dragImage.className = 'section-drag-ghost';
    dragImage.innerHTML = `
      <div class="section-drag-ghost-inner">
        <span>${getSectionName(section.type)}</span>
      </div>
    `;
    dragImage.style.position = 'fixed';
    dragImage.style.top = '0';
    dragImage.style.left = '0';
    dragImage.style.transform = 'translate(-50%, -50%)';
    dragImage.style.pointerEvents = 'none';
    dragImage.style.zIndex = '9999';
    document.body.appendChild(dragImage);
    setDragImageElement(dragImage);
    setSelectedSectionId(sectionId);
    document.addEventListener('dragover', updateDragImagePosition);
  }, [sections, updateDragImagePosition]);

  // טיפול בשחרור סקשן לאחר גרירה
  const handleSectionDrop = useCallback((dropIndex) => {
    console.log('שחרור סקשן במיקום:', dropIndex);
    const dragDataStr = window.localStorage.getItem('dragData');
    if (dragDataStr) {
      try {
        const dragData = JSON.parse(dragDataStr);
        if (dragData.type === 'SECTION' && !dragData.isNew) {
          const sourceIndex = dragData.index;
          if (sourceIndex !== dropIndex && sourceIndex !== undefined) {
            console.log('מסדר מחדש מ-', sourceIndex, 'ל-', dropIndex);
            reorderSections(sourceIndex, dropIndex);
          }
        }
      } catch (error) {
        console.error('שגיאה בעיבוד נתוני גרירה מלוקל סטורג\':', error);
      }
    } else if (dragInfo.current.isDraggingSection && dragInfo.current.initialIndex !== dropIndex) {
      reorderSections(dragInfo.current.initialIndex, dropIndex);
    }
    handleDragEnd();
  }, [reorderSections, handleDragEnd]);

  // סימון מיקום השחרור הפוטנציאלי בעת גרירה
  const updateDropIndicator = useCallback((clientY) => {
    const dropZones = document.querySelectorAll('.drop-zone');
    if (dropZones.length > 0) {
      let closestZoneIndex = null;
      let minDistance = Infinity;
      dropZones.forEach((zone, index) => {
        const rect = zone.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const distance = Math.abs(clientY - centerY);
        if (distance < minDistance) {
          minDistance = distance;
          closestZoneIndex = index;
        }
      });
      setDropIndicatorIndex(closestZoneIndex);
    }
  }, []);

  // תיקון: שימוש ב-setDropIndicatorIndex (למעקב אחרי האזור) בעת סיום גרירה
  useEffect(() => {
    const handleGlobalDragEnd = () => {
      console.log('אירוע dragend גלובלי - ניקוי מצב גרירה');
      setIsDragging(false);
      setDropIndicatorIndex(null);
      localStorage.removeItem('dragData');
    };
    document.addEventListener('dragend', handleGlobalDragEnd);
    return () => {
      document.removeEventListener('dragend', handleGlobalDragEnd);
    };
  }, [setIsDragging]);

  const undo = useCallback(() => {
    console.log('undo operation');
  }, []);
  
  const redo = useCallback(() => {
    console.log('redo operation');
  }, []);

  const saveLayout = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await builderService.saveData(window.SERVER_DATA.storeId, sections);
      showToast('נשמר בהצלחה');
      return result;
    } catch (error) {
      console.error('Save error:', error);
      showToast(`שגיאה בשמירה: ${error.message}`, 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [sections, showToast]);
  
  const publishLayout = useCallback(async () => {
    try {
      setIsLoading(true);
      if (!storeData.storeId) {
        throw new Error('מזהה חנות לא נמצא');
      }
      const result = await builderService.publishData(storeData.storeId, sections);
      showToast('פורסם בהצלחה', 'success');
      return result;
    } catch (error) {
      console.error('Publish error:', error);
      showToast(`שגיאה בפרסום: ${error.message}`, 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [sections, storeData, showToast]);

  const loadLayout = useCallback(async () => {
    try {
      setIsLoading(true);
      if (!window.SERVER_DATA?.storeId) {
        console.error('No store ID provided');
        setIsLoading(false);
        return;
      }
      const data = await builderService.loadData(window.SERVER_DATA.storeId);
      if (data && Array.isArray(data)) {
        setSections(data);
      } else {
        setSections([]);
      }
    } catch (error) {
      console.error('Load error:', error);
      showToast(`שגיאה בטעינה: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  function getSectionName(type) {
    const sectionNames = {
      hero: 'כותרת ראשית',
      banner: 'באנר',
      'text-image': 'טקסט ותמונה',
      products: 'מוצרים',
      testimonials: 'המלצות',
      collections: 'קטגוריות',
      newsletter: 'ניוזלטר',
      row: 'שורת עמודות',
      button: 'כפתור',
      image: 'תמונה',
      text: 'טקסט',
      video: 'וידאו'
    };
    return sectionNames[type] || type;
  }

  const value = {
    sections,
    selectedSection,
    selectedSectionId,
    isDragging,
    viewMode,
    isLoading,
    draggedItem,
    dropIndicatorIndex,
    selectedWidgetInfo,
    setSections,
    setSelectedSectionId,
    setIsDragging,
    setViewMode,
    setDraggedItem,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    saveLayout,
    publishLayout,
    loadLayout,
    undo,
    redo,
    handleSidebarDragStart,
    handleSidebarDrop,
    handleSectionDragStart,
    handleSectionDrop,
    updateDropIndicator,
    showToast,
    getSectionName,
    cleanupDragElements,
    findSelectedWidget,
    updateWidgetInColumn,
    deleteWidgetFromColumn
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}

export default EditorContext;
