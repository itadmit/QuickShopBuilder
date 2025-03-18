// בקובץ EditorContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import mockData from '../mock-data/homepage-data.json';

// יצירת קונטקסט
const EditorContext = createContext();

// Hook לשימוש בקונטקסט
export function useEditor() {
  return useContext(EditorContext);
}

// הגדרת סקשנים ברירת מחדל
const defaultSections = [
  {
    id: 'section-1',
    type: 'hero',
    title: 'ברוכים הבאים לחנות שלנו',
    subtitle: 'מוצרים באיכות גבוהה במחירים תחרותיים',
    buttonText: 'לקנייה',
    buttonLink: '/collections/all',
    backgroundImage: '/images/placeholders/hero-bg.jpg'
  },
  {
    id: 'section-2',
    type: 'products',
    title: 'מוצרים מובחרים',
    products: [],
    count: 4
  },
  {
    id: 'section-3',
    type: 'text-image',
    title: 'על החנות שלנו',
    content: 'אנחנו חנות מקוונת המציעה מגוון רחב של מוצרים באיכות גבוהה. המטרה שלנו היא לספק ללקוחותינו את המוצרים הטובים ביותר במחירים הוגנים ועם שירות לקוחות מצוין.',
    image: '/images/placeholders/about-img.jpg',
    imagePosition: 'right'
  }
];

// ספק הקונטקסט
export function EditorProvider({ children }) {
  // מצב הסקשנים בדף הבית
  const [sections, setSections] = useState([]);
  
  // מזהה הסקשן הנבחר
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  
  // האם מתבצעת כרגע גרירה
  const [isDragging, setIsDragging] = useState(false);
  
  // מצב תצוגה (דסקטופ, טאבלט, מובייל)
  const [viewMode, setViewMode] = useState('desktop');
  
  // מצב טעינה
  const [isLoading, setIsLoading] = useState(false);
  
  // נתוני הגרירה הנוכחית
  const [draggedItem, setDraggedItem] = useState(null);

  // היסטוריית שינויים
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isUndoRedo, setIsUndoRedo] = useState(false);

  // הסקשן הנבחר הנוכחי
  const selectedSection = selectedSectionId 
    ? sections.find(section => section.id === selectedSectionId) 
    : null;

  // כאשר יש שינוי בסקשנים, עדכון ההיסטוריה
  useEffect(() => {
    // אם השינוי נובע מפעולת undo/redo, לא נוסיף להיסטוריה
    if (isUndoRedo) {
      setIsUndoRedo(false);
      return;
    }
    
    // אם אין סקשנים, לא נוסיף להיסטוריה
    if (sections.length === 0) return;
    
    // שמירת המצב הנוכחי בהיסטוריה
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.stringify(sections));
    
    // הגבלת גודל ההיסטוריה ל-50 פעולות
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [sections]);

  // פונקציה להוספת סקשן חדש
  const addSection = useCallback((sectionType, position = sections.length) => {
    // יצירת סקשן חדש עם מזהה ייחודי
    const newSection = createEmptySection(sectionType);
    
    // העתקת מערך הסקשנים הקיים והוספת הסקשן החדש במיקום הספציפי
    const newSections = [...sections];
    newSections.splice(position, 0, newSection);
    
    // עדכון מצב הסקשנים
    setSections(newSections);
    
    // בחירת הסקשן החדש
    setSelectedSectionId(newSection.id);
    
    return newSection.id;
  }, [sections]);

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
        backgroundImage: '/images/placeholders/hero-bg.jpg',
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
        backgroundImage: '/images/placeholders/banner-bg.jpg',
      },
      'text-image': {
        id,
        type: 'text-image',
        title: 'על החנות שלנו',
        content: 'כאן מופיע תוכן טקסטואלי על החנות',
        image: '/images/placeholders/about-img.jpg',
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
    const result = Array.from(sections);
    const [removed] = result.splice(sourceIndex, 1);
    result.splice(destinationIndex, 0, removed);
    setSections(result);
  }, [sections]);

  // פונקציה לטיפול בגרירת רכיב חדש מהסיידבר
  const handleSidebarDragStart = useCallback((item) => {
    setDraggedItem(item);
    setIsDragging(true);
  }, []);

  // פונקציה לטיפול בשחרור רכיב מהסיידבר
  const handleSidebarDrop = useCallback((dropIndex) => {
    if (draggedItem) {
      addSection(draggedItem.type, dropIndex);
      setDraggedItem(null);
    }
  }, [draggedItem, addSection]);

  // פונקציית Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setIsUndoRedo(true);
      setHistoryIndex(historyIndex - 1);
      setSections(JSON.parse(history[historyIndex - 1]));
    }
  }, [history, historyIndex]);
  
  // פונקציית Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setIsUndoRedo(true);
      setHistoryIndex(historyIndex + 1);
      setSections(JSON.parse(history[historyIndex + 1]));
    }
  }, [history, historyIndex]);

  // שמירת המבנה הנוכחי (לוקאלי או לשרת בעתיד)
  const saveLayout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // ארגון המידע בפורמט JSON לשמירה בטבלה
      const layoutData = {
        store_id: window.STORE_ID,
        structure: sections.map(section => ({
          id: section.id,
          type: section.type,
          data: { ...section }
        }))
      };
      
      // שליחת המידע לשרת
      const response = await fetch('/editor/save.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(layoutData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'שגיאה בשמירת המבנה');
      }
      
      // שמירה גם ב-localStorage כגיבוי
      localStorage.setItem('quickshop-homepage-layout', JSON.stringify(sections));
      
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Error saving layout:', error);
      setIsLoading(false);
      throw error;
    }
  }, [sections]);


  const loadLayout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // קודם מנסים לטעון מהשרת
      const response = await fetch(`/editor/load.php?store_id=${window.STORE_ID}`);
      
      let data;
      // בדיקה שהתשובה היא JSON תקין
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        
        if (data.success && data.structure && data.structure.length > 0) {
          const parsedSections = data.structure.map(item => ({
            ...item.data,
            id: item.id || `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: item.type
          }));
          
          setSections(parsedSections);
          setIsLoading(false);
          return;
        }
      } else {
        console.warn("Server did not return JSON. Falling back to local storage.");
      }
      
      // אם לא הצלחנו לטעון מהשרת, ננסה מ-localStorage
      const savedLayout = localStorage.getItem('quickshop-homepage-layout');
      
      if (savedLayout) {
        setSections(JSON.parse(savedLayout));
      } else {
        // אם אין מבנה שמור, נשתמש במבנה ברירת מחדל
        setSections(mockData.sections || defaultSections);
      }
    } catch (error) {
      console.error('Error loading layout:', error);
      // במקרה של שגיאה בטעינה, משתמשים במבנה ברירת מחדל
      setSections(mockData.sections || defaultSections);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // עדכון האם יש אפשרות undo/redo
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // הערכים שיהיו זמינים לקומפוננטות שמשתמשות בקונטקסט
  const value = {
    sections,
    selectedSection,
    selectedSectionId,
    isDragging,
    viewMode,
    isLoading,
    draggedItem,
    canUndo,
    canRedo,
    setSelectedSectionId,
    setIsDragging,
    setViewMode,
    setDraggedItem,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    saveLayout,
    loadLayout,
    undo,
    redo,
    handleSidebarDragStart,
    handleSidebarDrop
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}