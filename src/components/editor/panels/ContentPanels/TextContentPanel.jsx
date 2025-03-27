// src/components/editor/panels/ContentPanels/TextContentPanel.jsx
import React from 'react';
import SelectControl from '../../controls/SelectControl';

const TextContentPanel = ({ data, onChange }) => {
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
          rows={8}
        />
      </div>

      <div className="property-group">
        <label className="property-label">יישור טקסט</label>
        <SelectControl
          options={[
            { value: 'right', label: 'ימין' },
            { value: 'center', label: 'מרכז' },
            { value: 'left', label: 'שמאל' },
            { value: 'justify', label: 'מיושר לשני הצדדים' }
          ]}
          value={data.alignment || 'right'}
          onChange={(value) => handleChange('alignment', value)}
        />
      </div>

      <div className="property-group">
        <label className="property-label">גודל כותרת</label>
        <SelectControl
          options={[
            { value: 'h1', label: 'גדול מאוד (H1)' },
            { value: 'h2', label: 'גדול (H2)' },
            { value: 'h3', label: 'בינוני (H3)' },
            { value: 'h4', label: 'קטן (H4)' },
            { value: 'h5', label: 'קטן מאוד (H5)' },
            { value: 'h6', label: 'מינימלי (H6)' }
          ]}
          value={data.headingLevel || 'h2'}
          onChange={(value) => handleChange('headingLevel', value)}
        />
      </div>

      <div className="property-group">
        <label className="property-label">תצוגת תוכן</label>
        <SelectControl
          options={[
            { value: 'normal', label: 'רגיל' },
            { value: 'small', label: 'טקסט קטן' },
            { value: 'large', label: 'טקסט גדול' }
          ]}
          value={data.contentSize || 'normal'}
          onChange={(value) => handleChange('contentSize', value)}
        />
      </div>
    </>
  );
};

export default TextContentPanel;