// src/components/editor/panels/CommonPanels/EmptyPanel.jsx
import React from 'react';
import { FiSettings } from 'react-icons/fi';

const EmptyPanel = () => {
  return (
    <div className="empty-panel">
      <div className="empty-icon">
        <FiSettings size={40} opacity={0.3} />
      </div>
      <p className="empty-message">בחר אלמנט כדי לערוך את המאפיינים שלו</p>
      <p className="empty-hint">גרור רכיבים מסרגל הכלים לאזור העריכה</p>
    </div>
  );
};

export default EmptyPanel;