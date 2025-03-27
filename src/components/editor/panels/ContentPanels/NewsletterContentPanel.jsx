// src/components/editor/panels/ContentPanels/NewsletterContentPanel.jsx
import React from 'react';
import ImagePicker from '../../controls/ImagePicker';
import ColorPicker from '../../controls/ColorPicker';

const NewsletterContentPanel = ({ data, onChange }) => {
  // פונקציה להחלפת מאפיין
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  return (
    <>
      <div className="property-group">
        <label className="property-label">כותרת</label>
        <input
          type="text"
          className="text-input"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="הזן כותרת"
        />
      </div>
      <div className="property-group">
        <label className="property-label">תיאור</label>
        <textarea
          className="textarea-input"
          value={data.subtitle || ''}
          onChange={(e) => handleChange('subtitle', e.target.value)}
          placeholder="הזן תיאור קצר"
          rows={3}
        />
      </div>
      <div className="property-group">
        <label className="property-label">טקסט כפתור</label>
        <input
          type="text"
          className="text-input"
          value={data.buttonText || ''}
          onChange={(e) => handleChange('buttonText', e.target.value)}
          placeholder="לדוגמה: הרשמה"
        />
      </div>
      <div className="property-group">
        <label className="property-label">כתובת אימייל לשליחת הטופס</label>
        <input
          type="email"
          className="text-input"
          value={data.formEmail || ''}
          onChange={(e) => handleChange('formEmail', e.target.value)}
          placeholder="mail@example.com"
        />
      </div>
      <div className="property-group">
        <label className="property-label">תמונת רקע (אופציונלי)</label>
        <ImagePicker
          value={data.backgroundImage || ''}
          onChange={(value) => handleChange('backgroundImage', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">צבע רקע</label>
        <ColorPicker
          value={data.backgroundColor || '#f7f7f7'}
          onChange={(value) => handleChange('backgroundColor', value)}
        />
      </div>
    </>
  );
};

export default NewsletterContentPanel;