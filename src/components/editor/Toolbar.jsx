import React from 'react';
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
import Swal from 'sweetalert2';

const Toolbar = () => {
  const { 
    saveLayout, 
    sections, 
    viewMode, 
    setViewMode,
    undo,
    redo,
    canUndo,
    canRedo
  } = useEditor();

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
      Swal.fire({
        title: 'שגיאה בשמירה',
        text: error.message || 'אירעה שגיאה בשמירת דף הבית',
        icon: 'error'
      });
    }
  };

  // פונקציה לפתיחת תצוגה מקדימה
  const handlePreviewToggle = () => {
    if (!sections || sections.length === 0) {
      Swal.fire({
        title: 'אין תוכן לתצוגה מקדימה',
        text: 'הוסף רכיבים לפני הצגת תצוגה מקדימה',
        icon: 'info'
      });
      return;
    }
    
    // פתיחת חלון חדש לתצוגה מקדימה
    const previewWindow = window.open('', '_blank');
    
    // בניית HTML מתוך מידע הסקשנים מהקונטקסט
    let previewHTML = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>תצוגה מקדימה - ${window.STORE_SLUG || 'Quickshop'}</title>
        
        <!-- סגנונות הקיים באתר -->
        <link rel="stylesheet" href="/site/css/styles.css">
        <link rel="stylesheet" href="/site/css/theme.css">
        
        <!-- סגנונות נוספים -->
        <style>
          body { margin: 0; padding: 0; font-family: Assistant, sans-serif; }
          /* שאר הסגנונות... */
        </style>
      </head>
      <body>
        <div class="preview-header">
          <div>תצוגה מקדימה של דף הבית</div>
          <div class="preview-actions">
            <button class="device-button active" data-device="desktop">
              <i class="fas fa-desktop"></i> מחשב
            </button>
            <button class="device-button" data-device="tablet">
              <i class="fas fa-tablet-alt"></i> טאבלט
            </button>
            <button class="device-button" data-device="mobile">
              <i class="fas fa-mobile-alt"></i> נייד
            </button>
          </div>
        </div>
        
        <div class="preview-body preview-desktop">
    `;
    
    // הוספת תוכן הסקשנים מהסטייט, לא מה-DOM
    sections.forEach(section => {
      previewHTML += `<div class="section section-${section.type}">${renderSectionForPreview(section)}</div>`;
    });
    
    // סגירת ה-HTML
    previewHTML += `
        </div>
        
        <script>
          // סקריפט למעבר בין תצוגות מכשירים
          document.querySelectorAll('.device-button').forEach(button => {
            button.addEventListener('click', () => {
              // הסרת active מכולם
              document.querySelectorAll('.device-button').forEach(b => b.classList.remove('active'));
              button.classList.add('active');
              
              // החלפת מחלקת התצוגה
              const device = button.getAttribute('data-device');
              const previewBody = document.querySelector('.preview-body');
              previewBody.className = \`preview-body preview-\${device}\`;
            });
          });
        </script>
      </body>
      </html>
    `;
    
    // כתיבת ה-HTML לחלון החדש
    previewWindow.document.write(previewHTML);
    previewWindow.document.close();
  };

  // פונקציה שתחזיר את ה-HTML של הסקשן לתצוגה מקדימה
  const renderSectionForPreview = (section) => {
    // כאן צריך לוגיקה מותאמת להחזרת HTML לפי סוג הסקשן
    // לדוגמה פשוטה:
    switch(section.type) {
      case 'hero':
        return `
          <div class="hero-section" style="background-image: url(${section.backgroundImage})">
            <div class="hero-overlay"></div>
            <div class="hero-content">
              <h1>${section.title}</h1>
              <p>${section.subtitle}</p>
              <a href="${section.buttonLink}" class="hero-button">${section.buttonText}</a>
            </div>
          </div>
        `;
      // לוגיקה לסוגי סקשנים נוספים...
      default:
        return `<div>סקשן מסוג ${section.type}</div>`;
    }
  };

  // פונקציה להחלפת מצב תצוגה
  const handleViewModeChange = (mode) => {
    // עדכון הערך בקונטקסט, לא רק בסטייט מקומי
    setViewMode(mode);
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
          onClick={() => handleViewModeChange('desktop')}
          title="תצוגת מחשב"
        >
          <HiOutlineDesktopComputer />
        </button>
        <button 
          className={`button-icon ${viewMode === 'tablet' ? 'active' : ''}`}
          onClick={() => handleViewModeChange('tablet')}
          title="תצוגת טאבלט"
        >
          <FiTablet />
        </button>
        <button 
          className={`button-icon ${viewMode === 'mobile' ? 'active' : ''}`}
          onClick={() => handleViewModeChange('mobile')}
          title="תצוגת מובייל"
        >
          <HiOutlineDeviceMobile />
        </button>
      </div>
      
      <div className="editor-actions">
        <button 
          className="button-icon"
          onClick={undo}
          disabled={!canUndo}
          title="בטל"
        >
          <FiRotateCcw />
        </button>
        <button 
          className="button-icon"
          onClick={redo}
          disabled={!canRedo}
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