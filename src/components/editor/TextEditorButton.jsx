// src/components/editor/TextEditorButton.jsx
import React, { useState } from 'react';
import { FiEdit, FiType } from 'react-icons/fi';
import TextEditorModal from './TextEditorModal';

/**
 * כפתור פתיחת עורך טקסט לעריכת תוכן טקסטואלי
 * 
 * @param {Object} props - מאפייני הקומפוננטה
 * @param {Function} props.onEdit - פונקציה שתופעל כאשר נשמרים שינויים בעורך
 * @param {Object} props.content - התוכן הקיים שנערך (אובייקט עם שדות טקסט)
 * @param {string} props.fieldType - סוג השדה הנערך ('title', 'text', 'button', etc.)
 * @param {string} props.buttonSize - גודל הכפתור ('sm', 'md', 'lg')
 * @param {string} props.label - תווית לכפתור (אופציונלי)
 */
const TextEditorButton = ({ 
  onEdit, 
  content = {},
  fieldType = 'text',
  buttonSize = 'md',
  label = ''
}) => {
  // מצב לניהול פתיחת העורך
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  // פתיחת העורך
  const handleOpenEditor = () => {
    setIsEditorOpen(true);
  };
  
  // סגירת העורך
  const handleCloseEditor = () => {
    setIsEditorOpen(false);
  };
  
  // שמירת השינויים מהעורך
  const handleSaveChanges = (updatedContent) => {
    // העברת התוכן המעודכן לקומפוננטה האב
    if (onEdit && typeof onEdit === 'function') {
      onEdit(updatedContent);
    }
    
    // סגירת העורך
    setIsEditorOpen(false);
  };
  
  // קביעת גודל הכפתור
  const buttonSizeClass = {
    'sm': 'edit-button-sm',
    'md': 'edit-button-md',
    'lg': 'edit-button-lg'
  }[buttonSize] || 'edit-button-md';
  
  // קביעת אייקון בהתאם לסוג השדה
  const ButtonIcon = fieldType === 'title' ? FiType : FiEdit;

  return (
    <>
      <button 
        className={`text-editor-button ${buttonSizeClass}`}
        onClick={handleOpenEditor}
        title={`ערוך ${label || 'טקסט'}`}
      >
        <ButtonIcon />
        {label && <span className="button-label">{label}</span>}
      </button>
      
      {isEditorOpen && (
        <TextEditorModal 
          isOpen={isEditorOpen}
          onClose={handleCloseEditor}
          onSave={handleSaveChanges}
          initialContent={content}
          fieldType={fieldType}
        />
      )}
    </>
  );
};

export default TextEditorButton;