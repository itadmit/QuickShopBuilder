// src/components/editor/panels/ContentPanels/HeroContentPanel.jsx
import React from 'react';
import ImagePicker from '../../controls/ImagePicker';

const HeroContentPanel = ({ data, onChange }) => {
  // פונקציה להחלפת מאפיין
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  return (
    <>
      <div className="property-group">
        <label className="property-label">כותרת ראשית</label>
        <input
          type="text"
          className="text-input"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="הזן כותרת ראשית"
        />
      </div>
      <div className="property-group">
        <label className="property-label">כותרת משנה</label>
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
          placeholder="לדוגמה: קרא עוד"
        />
      </div>
      <div className="property-group">
        <label className="property-label">קישור כפתור</label>
        <input
          type="text"
          className="text-input"
          value={data.buttonLink || ''}
          onChange={(e) => handleChange('buttonLink', e.target.value)}
          placeholder="הזן URL"
        />
      </div>
      <div className="property-group">
        <label className="property-label">תמונת רקע</label>
        <ImagePicker
          value={data.backgroundImage || ''}
          onChange={(value) => handleChange('backgroundImage', value)}
        />
      </div>
    </>
  );
};

export default HeroContentPanel;