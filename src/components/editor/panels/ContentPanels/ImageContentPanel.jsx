// src/components/editor/panels/ContentPanels/ImageContentPanel.jsx
import React from 'react';
import ImagePicker from '../../controls/ImagePicker';
import SelectControl from '../../controls/SelectControl';

const ImageContentPanel = ({ data, onChange }) => {
  // פונקציה להחלפת מאפיין
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  return (
    <>
      <div className="property-group">
        <label className="property-label">תמונה</label>
        <ImagePicker
          value={data.image || ''}
          onChange={(value) => handleChange('image', value)}
        />
      </div>

      <div className="property-group">
        <label className="property-label">טקסט אלטרנטיבי (עבור נגישות)</label>
        <input
          type="text"
          className="text-input"
          value={data.altText || ''}
          onChange={(e) => handleChange('altText', e.target.value)}
          placeholder="תיאור התמונה לקוראי מסך"
        />
      </div>

      <div className="property-group">
        <label className="property-label">כותרת (אופציונלי)</label>
        <input
          type="text"
          className="text-input"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="כותרת התמונה"
        />
      </div>

      <div className="property-group">
        <label className="property-label">קישור (אופציונלי)</label>
        <input
          type="text"
          className="text-input"
          value={data.imageLink || ''}
          onChange={(e) => handleChange('imageLink', e.target.value)}
          placeholder="הוסף קישור לתמונה"
        />
      </div>

      {data.imageLink && (
        <div className="property-group">
          <label className="property-label">יעד הקישור</label>
          <SelectControl
            options={[
              { value: '_self', label: 'באותו חלון' },
              { value: '_blank', label: 'בחלון חדש' }
            ]}
            value={data.imageLinkTarget || '_self'}
            onChange={(value) => handleChange('imageLinkTarget', value)}
          />
        </div>
      )}

      <div className="property-group">
        <label className="property-label">יישור תמונה</label>
        <SelectControl
          options={[
            { value: 'left', label: 'שמאל' },
            { value: 'center', label: 'מרכז' },
            { value: 'right', label: 'ימין' }
          ]}
          value={data.alignment || 'center'}
          onChange={(value) => handleChange('alignment', value)}
        />
      </div>

      <div className="property-group">
        <label className="property-label">גודל תצוגה</label>
        <SelectControl
          options={[
            { value: 'auto', label: 'אוטומטי' },
            { value: 'cover', label: 'מילוי מלא' },
            { value: 'contain', label: 'התאמה לקונטיינר' },
            { value: 'custom', label: 'מותאם אישית' }
          ]}
          value={data.sizeMode || 'auto'}
          onChange={(value) => handleChange('sizeMode', value)}
        />
      </div>

      {data.sizeMode === 'custom' && (
        <div className="property-group">
          <label className="property-label">רוחב מותאם אישית (%)</label>
          <input
            type="range"
            min="10"
            max="100"
            value={data.customWidth || 100}
            onChange={(e) => handleChange('customWidth', parseInt(e.target.value))}
          />
          <span>{data.customWidth || 100}%</span>
        </div>
      )}
    </>
  );
};

export default ImageContentPanel;