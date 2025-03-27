// src/components/editor/controls/TypographyControl.jsx
import React from 'react';
import SelectControl from './SelectControl';
import RangeSlider from './RangeSlider';

const TypographyControl = ({ values, onChange, title, showAllOptions = true }) => {
  const handleChange = (key, value) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <div className="typography-control">
      {title && <h4 className="typography-title">{title}</h4>}
      
      <div className="typography-field">
        <label className="property-label">גופן</label>
        <SelectControl
          options={[
            { value: "'Noto Sans Hebrew', sans-serif", label: 'Noto Sans Hebrew' },
            { value: "'Open Sans Hebrew', sans-serif", label: 'Open Sans Hebrew' },
            { value: "'Heebo', sans-serif", label: 'Heebo' },
            { value: "'Rubik', sans-serif", label: 'Rubik' },
            { value: "'Assistant', sans-serif", label: 'Assistant' },
            { value: "'Varela Round', sans-serif", label: 'Varela Round' },
            { value: "'Arial', sans-serif", label: 'Arial' }
          ]}
          value={values.fontFamily || "'Noto Sans Hebrew', sans-serif"}
          onChange={(value) => handleChange('fontFamily', value)}
        />
      </div>
      
      <div className="typography-field">
        <label className="property-label">גודל גופן</label>
        <RangeSlider
          min={10}
          max={80}
          value={values.fontSize || 16}
          onChange={(value) => handleChange('fontSize', value)}
        />
      </div>
      
      <div className="typography-field">
        <label className="property-label">משקל גופן</label>
        <SelectControl
          options={[
            { value: '300', label: 'דק' },
            { value: 'normal', label: 'רגיל' },
            { value: '500', label: 'בינוני' },
            { value: 'bold', label: 'מודגש' },
            { value: '800', label: 'שמן' }
          ]}
          value={values.fontWeight || 'normal'}
          onChange={(value) => handleChange('fontWeight', value)}
        />
      </div>
      
      <div className="typography-field">
        <label className="property-label">גובה שורה</label>
        <RangeSlider
          min={1}
          max={2.5}
          step={0.1}
          value={values.lineHeight || 1.5}
          onChange={(value) => handleChange('lineHeight', value)}
        />
      </div>
      
      {showAllOptions && (
        <>
          <div className="typography-field">
            <label className="property-label">סגנון גופן</label>
            <SelectControl
              options={[
                { value: 'normal', label: 'רגיל' },
                { value: 'italic', label: 'נטוי' }
              ]}
              value={values.fontStyle || 'normal'}
              onChange={(value) => handleChange('fontStyle', value)}
            />
          </div>
          
          <div className="typography-field">
            <label className="property-label">קישוט טקסט</label>
            <SelectControl
              options={[
                { value: 'none', label: 'ללא' },
                { value: 'underline', label: 'קו תחתון' },
                { value: 'line-through', label: 'קו חוצה' }
              ]}
              value={values.textDecoration || 'none'}
              onChange={(value) => handleChange('textDecoration', value)}
            />
          </div>
          
          <div className="typography-field">
            <label className="property-label">המרת אותיות</label>
            <SelectControl
              options={[
                { value: 'none', label: 'ללא' },
                { value: 'uppercase', label: 'אותיות גדולות' },
                { value: 'lowercase', label: 'אותיות קטנות' },
                { value: 'capitalize', label: 'אות ראשונה גדולה' }
              ]}
              value={values.textTransform || 'none'}
              onChange={(value) => handleChange('textTransform', value)}
            />
          </div>
          
          <div className="typography-field">
            <label className="property-label">ריווח אותיות</label>
            <RangeSlider
              min={-2}
              max={5}
              step={0.1}
              value={values.letterSpacing || 0}
              onChange={(value) => handleChange('letterSpacing', value)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TypographyControl;