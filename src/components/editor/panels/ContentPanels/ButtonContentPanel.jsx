// src/components/editor/panels/ContentPanels/ButtonContentPanel.jsx
import React from 'react';
import IconPicker from '../../controls/IconPicker';
import SelectControl from '../../controls/SelectControl';

const ButtonContentPanel = ({ data, onChange }) => {
  // פונקציה להחלפת מאפיין
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  return (
    <>
      <div className="property-group">
        <label className="property-label">טקסט הכפתור</label>
        <input
          type="text"
          className="text-input"
          value={data.buttonText || ''}
          onChange={(e) => handleChange('buttonText', e.target.value)}
          placeholder="הזן טקסט לכפתור"
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">קישור</label>
        <input
          type="text"
          className="text-input"
          value={data.buttonLink || ''}
          onChange={(e) => handleChange('buttonLink', e.target.value)}
          placeholder="הזן כתובת קישור"
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">יעד הקישור</label>
        <SelectControl
          options={[
            { value: '_self', label: 'באותו חלון' },
            { value: '_blank', label: 'בחלון חדש' }
          ]}
          value={data.buttonLinkTarget || '_self'}
          onChange={(value) => handleChange('buttonLinkTarget', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">גודל הכפתור</label>
        <SelectControl
          options={[
            { value: 'small', label: 'קטן' },
            { value: 'medium', label: 'בינוני' },
            { value: 'large', label: 'גדול' }
          ]}
          value={data.buttonSize || 'medium'}
          onChange={(value) => handleChange('buttonSize', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">רוחב הכפתור</label>
        <SelectControl
          options={[
            { value: 'auto', label: 'אוטומטי' },
            { value: 'full', label: 'מלא' },
            { value: '50%', label: '50%' },
            { value: '75%', label: '75%' }
          ]}
          value={data.buttonWidth || 'auto'}
          onChange={(value) => handleChange('buttonWidth', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">יישור</label>
        <SelectControl
          options={[
            { value: 'left', label: 'שמאל' },
            { value: 'center', label: 'מרכז' },
            { value: 'right', label: 'ימין' }
          ]}
          value={data.buttonAlignment || 'center'}
          onChange={(value) => handleChange('buttonAlignment', value)}
        />
      </div>
      
      <div className="property-group-title">אייקון (אופציונלי)</div>
      <div className="property-group">
        <label className="property-label">אייקון</label>
        <IconPicker
          value={data.buttonIcon || ''}
          onChange={(value) => handleChange('buttonIcon', value)}
        />
      </div>
      
      {data.buttonIcon && (
        <>
          <div className="property-group">
            <label className="property-label">מיקום האייקון</label>
            <SelectControl
              options={[
                { value: 'left', label: 'שמאל לטקסט' },
                { value: 'right', label: 'ימין לטקסט' }
              ]}
              value={data.buttonIconPosition || 'right'}
              onChange={(value) => handleChange('buttonIconPosition', value)}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ButtonContentPanel;