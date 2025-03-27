// src/components/editor/panels/ContentPanels/TextImageContentPanel.jsx
import React from 'react';
import ImagePicker from '../../controls/ImagePicker';
import SelectControl from '../../controls/SelectControl';

const TextImageContentPanel = ({ data, onChange }) => {
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
        <label className="property-label">תוכן</label>
        <textarea
          className="textarea-input"
          value={data.content || ''}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder="הזן תוכן טקסטואלי"
          rows={5}
        />
      </div>
      <div className="property-group">
        <label className="property-label">מיקום התמונה</label>
        <SelectControl
          options={[
            { value: 'right', label: 'מימין לטקסט' },
            { value: 'left', label: 'משמאל לטקסט' }
          ]}
          value={data.imagePosition || 'right'}
          onChange={(value) => handleChange('imagePosition', value)}
        />
      </div>
      <div className="property-group">
        <label className="property-label">תמונה</label>
        <ImagePicker
          value={data.image || ''}
          onChange={(value) => handleChange('image', value)}
        />
      </div>
    </>
  );
};

export default TextImageContentPanel;