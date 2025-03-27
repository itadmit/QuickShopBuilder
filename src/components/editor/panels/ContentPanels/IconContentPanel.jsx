// src/components/editor/panels/ContentPanels/IconContentPanel.jsx
import React from 'react';
import IconPicker from '../../controls/IconPicker';
import RangeSlider from '../../controls/RangeSlider';
import ColorPicker from '../../controls/ColorPicker';
import SelectControl from '../../controls/SelectControl';

const IconContentPanel = ({ data, onChange }) => {
  // פונקציה להחלפת מאפיין
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  return (
    <>
      <div className="property-group">
        <label className="property-label">סוג אייקון</label>
        <IconPicker
          value={data.iconName || 'FiStar'}
          onChange={(value) => handleChange('iconName', value)}
        />
      </div>
      <div className="property-group">
        <label className="property-label">גודל אייקון</label>
        <RangeSlider
          min={16}
          max={128}
          value={data.iconSize || 40}
          onChange={(value) => handleChange('iconSize', value)}
        />
      </div>
      <div className="property-group">
        <label className="property-label">צבע אייקון</label>
        <ColorPicker
          value={data.iconColor || '#5271ff'}
          onChange={(value) => handleChange('iconColor', value)}
        />
      </div>
      <div className="property-group">
        <label className="property-label">עובי קו</label>
        <RangeSlider
          min={1}
          max={5}
          step={0.5}
          value={data.iconStrokeWidth || 2}
          onChange={(value) => handleChange('iconStrokeWidth', value)}
        />
      </div>
      <div className="property-group">
        <label className="property-label">יישור אייקון</label>
        <SelectControl
          options={[
            { value: 'right', label: 'ימין' },
            { value: 'center', label: 'מרכז' },
            { value: 'left', label: 'שמאל' }
          ]}
          value={data.iconAlignment || 'center'}
          onChange={(value) => handleChange('iconAlignment', value)}
        />
      </div>
      <div className="property-group">
        <label className="property-label">כותרת (אופציונלי)</label>
        <input
          type="text"
          className="text-input"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="הזן כותרת"
        />
      </div>
      <div className="property-group">
        <label className="property-label">תוכן (אופציונלי)</label>
        <textarea
          className="textarea-input"
          value={data.content || ''}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder="הזן תוכן טקסטואלי"
          rows={3}
        />
      </div>
    </>
  );
};

export default IconContentPanel;