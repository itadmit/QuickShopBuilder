import React from 'react';
import { EditorProvider } from './contexts/EditorContext';
import Editor from './components/editor/Editor';
import './styles/modern-editor.css';

function App() {
  return (
    <EditorProvider>
      <Editor />
    </EditorProvider>
  );
}

export default App;