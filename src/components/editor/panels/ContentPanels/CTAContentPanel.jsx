// src/components/editor/panels/ContentPanels/CTAContentPanel.jsx
import React from 'react';
import ImagePicker from '../../controls/ImagePicker';
import SelectControl from '../../controls/SelectControl';
import RangeSlider from '../../controls/RangeSlider';

const CTAContentPanel = ({ data, onChange }) => {
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
          placeholder="לדוגמה: לחץ כאן"
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
        <label className="property-label">תמונה</label>
        <ImagePicker
          value={data.image || ''}
          onChange={(value) => handleChange('image', value)}
        />
      </div>
      <div className="property-group">
        <label className="property-label">סוג אוברליי</label>
        <SelectControl
          options={[
            { value: 'none', label: 'ללא אוברליי' },
            { value: 'bottom', label: 'אוברליי בתחתית' },
            { value: 'full', label: 'אוברליי מלא' }
          ]}
          value={data.overlayType || 'bottom'}
          onChange={(value) => handleChange('overlayType', value)}
        />
      </div>
      <div className="property-group">
        <label className="property-label">שקיפות אוברליי</label>
        <RangeSlider
          min={0}
          max={100}
          value={(data.overlayOpacity || 0.5) * 100}
          onChange={(value) => handleChange('overlayOpacity', value / 100)}
        />
      </div>
    </>
  );
};

export default CTAContentPanel;