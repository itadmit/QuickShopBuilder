// src/App.js

import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { EditorProvider } from './contexts/EditorContext';
import Editor from './components/editor/Editor';
import './styles/modern-editor.css';

function App() {
  // בדיקה שיש מידע שרת
  useEffect(() => {
    // בדיקה שהמידע הנדרש קיים בחלון
    if (!window.SERVER_DATA) {
      console.error('Missing SERVER_DATA object in window');
    } else if (!window.SERVER_DATA.storeId) {
      console.error('Missing storeId in SERVER_DATA');
    }

    if (!window.SERVER_DATA) {
      window.SERVER_DATA = {
        storeId: '1',  // ערך ברירת מחדל
        storeName: 'חנות לדוגמה',
        storeSlug: 'demo-store',
        userId: '1',
        apiBasePath: '/api'
      };
    }
    
    // הגדרת כותרת הדף לפי שם החנות
    if (window.SERVER_DATA?.storeName) {
      document.title = `בילדר דף הבית - ${window.SERVER_DATA.storeName}`;
    }
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <EditorProvider>
        <Editor />
      </EditorProvider>
    </DndProvider>
  );
}

export default App;