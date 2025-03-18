import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { EditorProvider } from './contexts/EditorContext';
import Editor from './components/editor/Editor';
import './styles/modern-editor.css';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <EditorProvider>
        <Editor />
      </EditorProvider>
    </DndProvider>
  );
}

export default App;