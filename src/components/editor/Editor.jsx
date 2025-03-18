// בקובץ Editor.jsx - עדכון סופי
import React, { useEffect } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import Toolbar from './Toolbar';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import PropertyPanel from './PropertyPanel';

const Editor = () => {
  const { loadLayout, setIsDragging } = useEditor();

  // טעינת הלייאאוט בטעינה הראשונית
  useEffect(() => {
    console.log("Editor mounted, loading layout");
    loadLayout();
    
    // ניקוי בטעינה של נתונים ישנים מגרירות קודמות
    localStorage.removeItem('dragData');
    
    // ניטור אירועי גרירה גלובליים לשיפור UX
    const handleGlobalDragEnd = () => {
      setIsDragging(false);
    };
    
    window.addEventListener('dragend', handleGlobalDragEnd);
    window.addEventListener('drop', handleGlobalDragEnd);
    
    return () => {
      window.removeEventListener('dragend', handleGlobalDragEnd);
      window.removeEventListener('drop', handleGlobalDragEnd);
    };
  }, [loadLayout, setIsDragging]);

  return (
    <div className="editor-container">
      {/* סרגל כלים עליון */}
      <Toolbar />
      
      <div className="editor-workspace">
        {/* סיידבר */}
        <Sidebar />
        
        {/* אזור הקנבס המרכזי */}
        <Canvas />
        
        {/* פאנל מאפיינים */}
        <PropertyPanel />
      </div>
    </div>
  );
};

export default Editor;