import React, { useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useEditor } from '../../contexts/EditorContext';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import PropertyPanel from './PropertyPanel';
import Toolbar from './Toolbar';
import '../../styles/modern-editor.css';

const Editor = () => {
  const { 
    reorderSections, 
    setIsDragging, 
    loadLayout, 
    setDraggedItem 
  } = useEditor();

  // טעינת הלייאאוט בטעינה הראשונית
  useEffect(() => {
    // ניסיון לטעון לייאאוט שמור
    loadLayout();
  }, [loadLayout]);

  // טיפול בסיום גרירה
  const handleDragEnd = (result) => {
    setIsDragging(false);
    
    // איפוס פריט הגרירה מהסיידבר (אם יש)
    setDraggedItem(null);
    
    // אם אין יעד, לא עושים כלום
    if (!result.destination) {
      return;
    }
    
    // גרירה של סקשנים קיימים
    if (result.type === 'SECTIONS') {
      reorderSections(result.source.index, result.destination.index);
    }
  };

  // טיפול בתחילת גרירה
  const handleDragStart = () => {
    setIsDragging(true);
  };

  return (
    <div className="editor-container">
      {/* סרגל כלים עליון */}
      <Toolbar />
      
      {/* אזור העבודה הראשי */}
      <div className="editor-workspace">
        <DragDropContext
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          {/* תפריט צד */}
          <Sidebar />
          
          {/* אזור העריכה המרכזי */}
          <Canvas />
          
          {/* פאנל תכונות */}
          <PropertyPanel />
        </DragDropContext>
      </div>
    </div>
  );
};

export default Editor;