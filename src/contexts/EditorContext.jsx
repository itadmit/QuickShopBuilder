// EditorContext.jsx - תיקון בעיית reference לפונקציית showToast
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
  // בחלק העליון של הקומפוננטה, עם שאר משתני ה-state
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

  // פונקציה להצגת הודעות טוסט - חייבת להיות מוגדרת לפני שמשתמשים בה
  const showToast = useCallback((message, type = 'info') => {
    // יצירת אלמנט חדש להודעה
    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;
    toast.innerHTML = message;
    document.body.appendChild(toast);
    
    // הצגת ההודעה עם אנימציה
    setTimeout(() => {
      toast.classList.add('visible');
      
      // הסרת ההודעה אחרי 3 שניות
      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
    }, 10);
  }, []);
  
  // פונקציה ליצירת סקשן ריק לפי סוג
  const createEmptySection = (sectionType) => {
    const id = `section-${Date.now()}`;
    
    // תבניות ברירת מחדל לפי סוג הסקשן
    const defaultTypeSections = {
      hero: {
        id,
        type: 'hero',
        title: 'כותרת ראשית',
        subtitle: 'כותרת משנה',
        buttonText: 'קנה עכשיו',
        buttonLink: '/collections/all',
        backgroundImage: '/builder/build/images/placeholders/hero-bg.jpg',
      },
      products: {
        id,
        type: 'products',
        title: 'מוצרים מובחרים',
        products: [],
        count: 4,
      },
      banner: {
        id,
        type: 'banner',
        title: 'מבצע מיוחד',
        subtitle: 'הנחה של 20% על כל החנות',
        buttonText: 'למבצע',
        buttonLink: '/collections/sale',
        backgroundImage: '/builder/build/images/placeholders/banner-bg.jpg',
      },
      'text-image': {
        id,
        type: 'text-image',
        title: 'על החנות שלנו',
        content: 'כאן מופיע תוכן טקסטואלי על החנות',
        image: '/builder/build/images/placeholders/about-img.jpg',
        imagePosition: 'right',
      },
      testimonials: {
        id,
        type: 'testimonials',
        title: 'לקוחות ממליצים',
        testimonials: [
          { id: 1, author: 'ישראל ישראלי', content: 'שירות מעולה ומוצרים איכותיים!' },
          { id: 2, author: 'חנה כהן', content: 'המשלוח הגיע מהר והמוצר היה מושלם.' },
        ],
      },
      collections: {
        id,
        type: 'collections',
        title: 'קטגוריות פופולריות',
        collections: [],
        count: 3,
      },
      newsletter: {
        id,
        type: 'newsletter',
        title: 'הצטרפו לניוזלטר שלנו',
        subtitle: 'קבלו עדכונים ומבצעים ישירות למייל',
        buttonText: 'הרשמה',
        backgroundImage: null,
        backgroundColor: '#f7f7f7',
      },
    };

    return defaultTypeSections[sectionType] || defaultTypeSections['text-image'];
  };

  // פונקציה להוספת סקשן חדש
  const addSection = useCallback((sectionType, position = sections.length) => {
    console.log(`Adding section of type ${sectionType} at position ${position}`);
    
    // יצירת סקשן חדש עם מזהה ייחודי
    const newSection = createEmptySection(sectionType);
    
    // העתקת מערך הסקשנים הקיים והוספת הסקשן החדש במיקום הספציפי
    const newSections = [...sections];
    newSections.splice(position, 0, newSection);
    
    // עדכון מצב הסקשנים
    setSections(newSections);
    
    // בחירת הסקשן החדש
    setSelectedSectionId(newSection.id);
    
    // מציג הודעה זמנית של הוספת רכיב
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
    
    // אם הסקשן שנמחק הוא הסקשן הנבחר, אפס את הבחירה
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
    }
  }, [selectedSectionId]);

  // פונקציה לשינוי סדר הסקשנים
  const reorderSections = useCallback((sourceIndex, destinationIndex) => {
    console.log(`Reordering section from index ${sourceIndex} to index ${destinationIndex}`);
    
    // וידוא שהאינדקסים תקינים
    if (sourceIndex < 0 || destinationIndex < 0 || 
        sourceIndex >= sections.length || destinationIndex >= sections.length) {
      console.warn('Invalid indices for reordering:', sourceIndex, destinationIndex);
      return;
    }
    
    // אם המקור והיעד זהים, אין צורך לעשות כלום
    if (sourceIndex === destinationIndex) {
      console.log('Source and destination indices are the same, no reordering needed');
      return;
    }
    
    // העתקת המערך הנוכחי
    const result = Array.from(sections);
    
    // הסרת האלמנט מהמקור והוספתו ליעד
    const [removed] = result.splice(sourceIndex, 1);
    result.splice(destinationIndex, 0, removed);
    
    // עדכון הסקשנים
    setSections(result);
    
    // לוג לבדיקה
    console.log('Sections reordered successfully');
    
    // בחירת הסקשן שהועבר
    setSelectedSectionId(removed.id);
  }, [sections, setSelectedSectionId]);

  // פונקציה לניקוי כל אלמנטי הגרירה מה-DOM
  const cleanupDragElements = useCallback(() => {
    // הסרת אלמנט הגרירה הראשי
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
    
    // הסרת כל אלמנט גרירה נוסף
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

  // פונקציה לעדכון מיקום אלמנט הגרירה
  const updateDragImagePosition = useCallback((e) => {
    if (dragImageElement) {
      dragImageElement.style.left = `${e.clientX}px`;
      dragImageElement.style.top = `${e.clientY}px`;
    }
  }, [dragImageElement]);

  // פונקציה לסיום גרירה
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggedItem(null);
    setDropIndicatorIndex(null);
    
    // ניקוי אלמנטי גרירה
    cleanupDragElements();
    
    // הסרת האזנה לאירועי גרירה
    document.removeEventListener('dragover', updateDragImagePosition);
    
    // איפוס מידע הגרירה
    dragInfo.current = {
      startX: 0,
      startY: 0,
      initialIndex: null,
      currentIndex: null,
      isDraggingSection: false
    };
    
    // ניקוי נתוני גרירה מקומיים
    window.localStorage.removeItem('dragData');
  }, [cleanupDragElements, updateDragImagePosition]);

  // פונקציה לטיפול בגרירת רכיב חדש מהסיידבר
  const handleSidebarDragStart = useCallback((item) => {
    console.log('התחלת גרירת רכיב חדש:', item);
    
    setDraggedItem(item);
    setIsDragging(true);
    
    // שמירת המידע גם בלוקל סטורג'
    window.localStorage.setItem('dragData', JSON.stringify({
      type: item.type,
      name: item.name,
      isNew: true
    }));
    
    // יצירת אלמנט ויזואלי לגרירה
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
    
    // עדכון מיקום האלמנט בעת הגרירה
    document.addEventListener('dragover', updateDragImagePosition);
    
    return dragImage;
  }, [updateDragImagePosition]);

  // פונקציה לטיפול בשחרור רכיב מהסיידבר
  const handleSidebarDrop = useCallback((dropIndex) => {
    console.log('שחרור רכיב במיקום:', dropIndex);
    
    // בדיקה אם יש נתוני גרירה בלוקל סטורג'
    const dragDataStr = window.localStorage.getItem('dragData');
    if (dragDataStr) {
      try {
        const dragData = JSON.parse(dragDataStr);
        
        if (dragData.isNew) {
          // זה רכיב חדש מהסיידבר
          console.log('מוסיף רכיב חדש מסוג', dragData.type, 'במיקום', dropIndex);
          addSection(dragData.type, dropIndex);
        }
      } catch (error) {
        console.error('שגיאה בעיבוד נתוני גרירה מלוקל סטורג\':', error);
      }
    } else if (draggedItem) {
      // גיבוי במקרה שהלוקל סטורג' לא עבד
      addSection(draggedItem.type, dropIndex);
    }
    
    // ניקוי מצב הגרירה
    handleDragEnd();
  }, [draggedItem, addSection, handleDragEnd]);

  // פונקציה לטיפול בהתחלת גרירת סקשן קיים
  const handleSectionDragStart = useCallback((e, sectionId, index) => {
    console.log('התחלת גרירת סקשן קיים:', sectionId, 'ממיקום', index);
    
    // שמירת מידע ההתחלתי של הגרירה
    dragInfo.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialIndex: index,
      currentIndex: index,
      isDraggingSection: true
    };
    
    // שמירת מידע הגרירה גם בלוקל סטורג'
    window.localStorage.setItem('dragData', JSON.stringify({
      id: sectionId,
      index: index,
      type: 'SECTION',
      isNew: false
    }));
    
    setIsDragging(true);
    
    // יצירת אלמנט ויזואלי לגרירה
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
    
    // מציין את הסקשן הנגרר
    setSelectedSectionId(sectionId);
    
    // עדכון מיקום האלמנט בעת הגרירה
    document.addEventListener('dragover', updateDragImagePosition);
  }, [sections, updateDragImagePosition]);

  // פונקציה לטיפול בשחרור סקשן לאחר גרירה
  const handleSectionDrop = useCallback((dropIndex) => {
    console.log('שחרור סקשן במיקום:', dropIndex);
    
    // בדיקה אם יש נתוני גרירה בלוקל סטורג'
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
      // גיבוי במקרה שהלוקל סטורג' לא עבד
      reorderSections(dragInfo.current.initialIndex, dropIndex);
    }
    
    // ניקוי מצב הגרירה
    handleDragEnd();
  }, [reorderSections, handleDragEnd]);

  // פונקציה לסימון מיקום השחרור הפוטנציאלי בעת גרירה
  const updateDropIndicator = useCallback((clientY) => {
    // מציאת כל אזורי השחרור
    const dropZones = document.querySelectorAll('.drop-zone');
    
    if (dropZones.length > 0) {
      // בדיקה איזה אזור הוא הקרוב ביותר למיקום הנוכחי
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
      
      // עדכון אינדקס אזור השחרור
      setDropIndicatorIndex(closestZoneIndex);
    }
  }, []);

  // הוספת מאזין גלובלי לסיום גרירה
  useEffect(() => {
    const handleGlobalDragEnd = () => {
      console.log('אירוע dragend גלובלי - ניקוי מצב גרירה');
      handleDragEnd();
    };
    
    document.addEventListener('dragend', handleGlobalDragEnd);
    
    return () => {
      document.removeEventListener('dragend', handleGlobalDragEnd);
    };
  }, [handleDragEnd]);

  // פונקציית Undo
  const undo = useCallback(() => {
    // יש להשלים את הלוגיקה
    console.log('undo operation');
  }, []);
  
  // פונקציית Redo
  const redo = useCallback(() => {
    // יש להשלים את הלוגיקה
    console.log('redo operation');
  }, []);

  // שמירת המבנה הנוכחי
  const saveLayout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // השתמש בשירות API החדש
      const result = await builderService.saveData(window.SERVER_DATA.storeId, sections);
      
      // הצגת הודעת הצלחה
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
  
  // עדכון פונקציית הפרסום (חדשה)
  const publishLayout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (!storeData.storeId) {
        throw new Error('מזהה חנות לא נמצא');
      }
      
      // קריאה לפונקציית פרסום בשירות
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
  

  // פונקציה עזר - קבלת שם מותאם של הסקשן
  function getSectionName(type) {
    const sectionNames = {
      'hero': 'כותרת ראשית',
      'banner': 'באנר',
      'text-image': 'טקסט ותמונה',
      'products': 'מוצרים',
      'testimonials': 'המלצות',
      'collections': 'קטגוריות',
      'newsletter': 'ניוזלטר'
    };
    
    return sectionNames[type] || type;
  }


  const loadLayout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // בדיקה שיש מזהה חנות
      if (!window.SERVER_DATA?.storeId) {
        console.error('No store ID provided');
        setIsLoading(false);
        return;
      }
      
      // השתמש בשירות API החדש
      const data = await builderService.loadData(window.SERVER_DATA.storeId);
      
      if (data && Array.isArray(data)) {
        setSections(data);
      } else {
        setSections([]); // מבנה ריק אם אין נתונים
      }
      
    } catch (error) {
      console.error('Load error:', error);
      showToast(`שגיאה בטעינה: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const uploadImage = useCallback(async (file) => {
    try {
      if (!window.SERVER_DATA?.storeId) {
        throw new Error('No store ID provided');
      }
      
      const result = await builderService.uploadImage(window.SERVER_DATA.storeId, file);
      return result.url;
    } catch (error) {
      console.error('Upload error:', error);
      showToast(`שגיאה בהעלאת תמונה: ${error.message}`, 'error');
      throw error;
    }
  }, [showToast]);
  
  // מחיקת תמונה
  const deleteImage = useCallback(async (imageUrl) => {
    try {
      if (!window.SERVER_DATA?.storeId) {
        throw new Error('No store ID provided');
      }
      
      await builderService.deleteImage(window.SERVER_DATA.storeId, imageUrl);
      return true;
    } catch (error) {
      console.error('Delete image error:', error);
      showToast(`שגיאה במחיקת תמונה: ${error.message}`, 'error');
      throw error;
    }
  }, [showToast]);
  
  // ערכים שיהיו זמינים לקומפוננטות
  const value = {
    sections,
    selectedSection,
    selectedSectionId,
    isDragging,
    viewMode,
    isLoading,
    draggedItem,
    dropIndicatorIndex,
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
    cleanupDragElements
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}