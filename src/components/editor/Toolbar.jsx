import React, { useState } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { 
  FiMonitor, 
  FiSmartphone, 
  FiTablet, 
  FiSave, 
  FiEye, 
  FiRotateCcw, 
  FiRotateCw 
} from 'react-icons/fi';
import { HiOutlineDesktopComputer, HiOutlineDeviceMobile } from 'react-icons/hi';
import { IoSparklesOutline } from 'react-icons/io5';

const Toolbar = () => {
  const { saveLayout, sections } = useEditor();
  const [viewMode, setViewMode] = useState('desktop'); // desktop, tablet, mobile
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // פונקציה לשמירת הלייאאוט
  const handleSave = async () => {
    try {
      await saveLayout();
      
      // הצגת הודעת הצלחה זמנית
      const notification = document.createElement('div');
      notification.className = 'save-notification';
      notification.innerHTML = '<div class="notification-content"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>נשמר בהצלחה</span></div>';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('show');
        
        setTimeout(() => {
          notification.classList.remove('show');
          setTimeout(() => {
            document.body.removeChild(notification);
          }, 300);
        }, 2000);
      }, 10);
      
    } catch (error) {
      console.error('שגיאה בשמירה:', error);
      alert('שגיאה בשמירת דף הבית');
    }
  };

  // פונקציה לפתיחת תצוגה מקדימה
  const handlePreviewToggle = () => {
    setIsPreviewMode(!isPreviewMode);
    
    // בפרויקט אמיתי כאן אפשר לעבור למצב תצוגה מקדימה
    if (!isPreviewMode) {
      // פתיחת חלון תצוגה מקדימה
      const previewWindow = window.open('', '_blank');
      
      // יצירת HTML בסיסי לתצוגה מקדימה (לדוגמה פשוטה)
      const previewHtml = `
        <!DOCTYPE html>
        <html dir="rtl" lang="he">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>תצוגה מקדימה</title>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Hebrew:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
            body { 
              font-family: 'Noto Sans Hebrew', sans-serif; 
              margin: 0; 
              padding: 0; 
              direction: rtl;
            }
            .section { 
              margin-bottom: 0;
              position: relative;
            }
          </style>
        </head>
        <body>
          <div class="preview-content">
            ${sections.map(section => `
              <div class="section ${section.type}">
                <h2>${section.title || ''}</h2>
                <p>${section.subtitle || ''}</p>
                <!-- כאן ניתן להוסיף רינדור מותאם לפי סוג הסקשן -->
              </div>
            `).join('')}
          </div>
        </body>
        </html>
      `;
      
      previewWindow.document.write(previewHtml);
      previewWindow.document.close();
    }
  };

  // החלפת מצבי תצוגה (דסקטופ, טאבלט, מובייל)
  const changeViewMode = (mode) => {
    setViewMode(mode);
    // בפרויקט אמיתי, כאן אפשר לשנות את התצוגה בהתאם לרוחב המסך
  };

  return (
    <div className="editor-toolbar">
      <div className="editor-logo">
        <IoSparklesOutline />
        בילדר דף הבית
      </div>
      
      <div className="view-modes">
        <button 
          className={`button-icon ${viewMode === 'desktop' ? 'active' : ''}`}
          onClick={() => changeViewMode('desktop')}
          title="תצוגת מחשב"
        >
          <HiOutlineDesktopComputer />
        </button>
        <button 
          className={`button-icon ${viewMode === 'tablet' ? 'active' : ''}`}
          onClick={() => changeViewMode('tablet')}
          title="תצוגת טאבלט"
        >
          <FiTablet />
        </button>
        <button 
          className={`button-icon ${viewMode === 'mobile' ? 'active' : ''}`}
          onClick={() => changeViewMode('mobile')}
          title="תצוגת מובייל"
        >
          <HiOutlineDeviceMobile />
        </button>
      </div>
      
      <div className="editor-actions">
        <button 
          className="button-icon"
          onClick={() => console.log('ביטול פעולה אחרונה')}
          title="בטל"
        >
          <FiRotateCcw />
        </button>
        <button 
          className="button-icon"
          onClick={() => console.log('חזרה על פעולה אחרונה')}
          title="בצע שוב"
        >
          <FiRotateCw />
        </button>
        <button 
          className="button-secondary"
          onClick={handlePreviewToggle}
        >
          <FiEye /> תצוגה מקדימה
        </button>
        <button 
          className="button-primary"
          onClick={handleSave}
        >
          <FiSave /> שמור
        </button>
      </div>
    </div>
  );
};

export default Toolbar;