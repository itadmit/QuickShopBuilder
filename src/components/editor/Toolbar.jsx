// Toolbar.jsx מעודכן עם תצוגה מקדימה משופרת ופונקציית פרסום
import React, { useState } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { 
  FiMonitor, 
  FiSmartphone, 
  FiTablet, 
  FiSave, 
  FiEye, 
  FiRotateCcw, 
  FiRotateCw,
  FiGlobe
} from 'react-icons/fi';
import { HiOutlineDesktopComputer, HiOutlineDeviceMobile } from 'react-icons/hi';
import { IoSparklesOutline } from 'react-icons/io5';
import Swal from 'sweetalert2';
import Preview from './Preview'; // יש לוודא שהקובץ נמצא במיקום הנכון

const Toolbar = () => {
  const { 
    saveLayout, 
    publishLayout, // נוסיף את פונקציית הפרסום מהקונטקסט
    sections, 
    viewMode, 
    setViewMode,
    undo,
    redo,
    canUndo,
    canRedo
  } = useEditor();
  
  // מצבים של פעולות
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // מצב להצגת התצוגה המקדימה
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // פונקציה לשמירת הלייאאוט
  const handleSave = async () => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
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
    } finally {
      setIsSaving(false);
    }
  };

  // פונקציה *חדשה* לפרסום הלייאאוט
  const handlePublish = async () => {
    if (isPublishing || !sections || sections.length === 0) return;
    
    // הצגת דיאלוג אישור לפני פרסום
    const confirmResult = await Swal.fire({
      title: 'פרסום דף הבית',
      text: 'האם אתה בטוח שברצונך לפרסם את הדף? פעולה זו תגרום לשינויים להופיע באתר החי.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'כן, פרסם',
      cancelButtonText: 'ביטול',
      reverseButtons: true
    });
    
    if (!confirmResult.isConfirmed) return;
    
    try {
      setIsPublishing(true);
      
      // הצגת דיאלוג טעינה במהלך הפרסום
      Swal.fire({
        title: 'מפרסם...',
        html: `
          <div class="publish-modal-content">
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
              </div>
              <div class="progress-text">0%</div>
            </div>
            <div class="status-message">מכין את הדף לפרסום...</div>
          </div>
        `,
        didOpen: () => {
          Swal.showLoading();
          const progressFill = Swal.getPopup().querySelector('.progress-fill');
          const progressText = Swal.getPopup().querySelector('.progress-text');
          const statusMessage = Swal.getPopup().querySelector('.status-message');
          
          // אנימציית התקדמות מדומה
          let progress = 0;
          const statusMessages = [
            { at: 0, text: "מכין את הדף לפרסום..." },
            { at: 15, text: "מעבד תמונות ונכסים..." },
            { at: 40, text: "בונה את מבנה הדף..." },
            { at: 70, text: "מייצר דף אופטימלי למנועי חיפוש..." },
            { at: 85, text: "משפר את ביצועי הדף..." }
          ];
          
          const interval = setInterval(() => {
            // עדכון עמדת הסטטוס בטקסט מתאים
            statusMessages.forEach(msg => {
              if (progress >= msg.at && progress < msg.at + 15) {
                statusMessage.textContent = msg.text;
              }
            });
            
            progress += 0.5;
            progressFill.style.width = `${Math.min(progress, 95)}%`;
            progressText.textContent = `${Math.round(Math.min(progress, 95))}%`;
            
            if (progress >= 95) {
              clearInterval(interval);
            }
          }, 50);
          
          Swal.getPopup()._progressInterval = interval;
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false
      });
      
      // קריאה לפונקציית הפרסום
      const result = await publishLayout();
      
      // סגירת דיאלוג הטעינה ועדכון התקדמות ל-100%
      const popup = Swal.getPopup();
      if (popup && popup._progressInterval) {
        clearInterval(popup._progressInterval);
      }
      
      const progressFill = popup?.querySelector('.progress-fill');
      const progressText = popup?.querySelector('.progress-text');
      const statusMessage = popup?.querySelector('.status-message');
      
      if (progressFill && progressText && statusMessage) {
        progressFill.style.width = "100%";
        progressText.textContent = "100%";
        statusMessage.textContent = "הפרסום הושלם בהצלחה!";
      }
      
      // הצגת הודעת הצלחה
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: 'דף הבית פורסם בהצלחה!',
          text: `זמן רינדור: ${result?.renderTime ? (result.renderTime/1000).toFixed(1) + ' שניות' : 'מהיר'}`,
          confirmButtonText: 'אישור',
          showCancelButton: true,
          cancelButtonText: 'צפה באתר',
          reverseButtons: true
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.cancel) {
            // פתיחת האתר בחלון חדש לתצוגה
            window.open(`/${window.SERVER_DATA?.storeSlug || ''}`, '_blank');
          }
        });
      }, 1000);
      
    } catch (error) {
      console.error('שגיאה בפרסום:', error);
      Swal.fire({
        icon: 'error',
        title: 'שגיאה בפרסום',
        text: error.message || 'אירעה שגיאה בפרסום דף הבית',
        confirmButtonText: 'אישור'
      });
    } finally {
      setIsPublishing(false);
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
    
    // פתיחת התצוגה המקדימה כקומפוננטה
    setIsPreviewOpen(true);
  };

  // פונקציה להחלפת מצב תצוגה
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <>
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
            className={`button-secondary ${isSaving ? 'loading' : ''}`}
            onClick={handleSave}
            disabled={isSaving}
          >
            <FiSave /> {isSaving ? 'שומר...' : 'שמור'}
          </button>
          <button 
            className={`button-primary ${isPublishing ? 'loading' : ''}`}
            onClick={handlePublish}
            disabled={isPublishing || !sections || sections.length === 0}
          >
            <FiGlobe /> {isPublishing ? 'מפרסם...' : 'פרסם'}
          </button>
        </div>
      </div>
      
      {/* קומפוננטת התצוגה המקדימה */}
      <Preview 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        sections={sections}
      />
    </>
  );
};

export default Toolbar;