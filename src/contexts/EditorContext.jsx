import React, { createContext, useContext, useState, useCallback } from 'react';
import mockData from '../mock-data/homepage-data.json';

// יצירת קונטקסט
const EditorContext = createContext();

// Hook לשימוש בקונטקסט
export function useEditor() {
  return useContext(EditorContext);
}

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

  // הסקשן הנבחר הנוכחי
  const selectedSection = selectedSectionId 
    ? sections.find(section => section.id === selectedSectionId) 
    : null;

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
    const defaultSections = {
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

    return defaultSections[sectionType] || defaultSections['text-image'];
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

  // שמירת המבנה הנוכחי (לוקאלי או לשרת בעתיד)
  const saveLayout = useCallback(() => {
    setIsLoading(true);
    
    // כאן בעתיד תהיה שמירה לשרת
    // כרגע שומר ב-localStorage כדמה
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem('quickshop-homepage-layout', JSON.stringify(sections));
        
        setTimeout(() => {
          setIsLoading(false);
          resolve(sections);
        }, 800);
      } catch (error) {
        setIsLoading(false);
        reject(error);
      }
    });
  }, [sections]);

  // טעינת מבנה שמור
  const loadLayout = useCallback(() => {
    setIsLoading(true);
    
    try {
      // ניסיון לטעון מ-localStorage
      const savedLayout = localStorage.getItem('quickshop-homepage-layout');
      
      if (savedLayout) {
        const parsedLayout = JSON.parse(savedLayout);
        setSections(parsedLayout);
      } else {
        // אם אין מבנה שמור, השתמש בנתוני דמה
        setSections(mockData.sections || []);
      }
    } catch (error) {
      console.error('Error loading layout', error);
      // במקרה של שגיאה, השתמש בנתוני דמה
      setSections(mockData.sections || []);
    }
    
    setIsLoading(false);
  }, []);

  // שכפול סקשן קיים
  const duplicateSection = useCallback((sectionId) => {
    const sectionToDuplicate = sections.find(section => section.id === sectionId);
    
    if (!sectionToDuplicate) return;
    
    // יצירת עותק עם מזהה חדש
    const duplicatedSection = {
      ...sectionToDuplicate,
      id: `section-${Date.now()}`
    };
    
    // מציאת המיקום של הסקשן המקורי
    const originalIndex = sections.findIndex(section => section.id === sectionId);
    
    // הוספת העותק אחרי המקור
    const newSections = [...sections];
    newSections.splice(originalIndex + 1, 0, duplicatedSection);
    
    setSections(newSections);
    
    // בחירת הסקשן החדש
    setSelectedSectionId(duplicatedSection.id);
    
    return duplicatedSection.id;
  }, [sections]);

  // הערכים שיהיו זמינים לקומפוננטות שמשתמשות בקונטקסט
  const value = {
    sections,
    selectedSection,
    selectedSectionId,
    isDragging,
    viewMode,
    isLoading,
    draggedItem,
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
    duplicateSection,
    handleSidebarDragStart,
    handleSidebarDrop
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}