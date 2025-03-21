// src/components/editor/controls/CommonControls.jsx
import React from 'react';
import RangeSlider from './RangeSlider';
import ColorPicker from './ColorPicker';
import SwitchControl from './SwitchControl';

// קומפוננטה לבקרת מרווחים (מרג'ין/פדינג)
export const SpacingControl = ({ type, values, onChange }) => {
  const handleChange = (position, value) => {
    const newValues = { ...values };
    newValues[position] = value;
    onChange(newValues);
  };

  return (
    <div className="spacing-control">
      <div className="spacing-label">{type === 'margin' ? 'מרג\'ין' : 'פדינג'}</div>
      <div className="spacing-inputs">
        <div className="spacing-row">
          <input
            type="text"
            className="spacing-input"
            value={values.top || ''}
            onChange={(e) => handleChange('top', e.target.value)}
          />
          <span className="spacing-label">למעלה</span>
        </div>
        <div className="spacing-row">
          <input
            type="text" 
            className="spacing-input"
            value={values.right || ''}
            onChange={(e) => handleChange('right', e.target.value)}
          />
          <span className="spacing-label">ימין</span>
        </div>
        <div className="spacing-row">
          <input
            type="text"
            className="spacing-input"
            value={values.bottom || ''}
            onChange={(e) => handleChange('bottom', e.target.value)}
          />
          <span className="spacing-label">למטה</span>
        </div>
        <div className="spacing-row">
          <input
            type="text"
            className="spacing-input"
            value={values.left || ''}
            onChange={(e) => handleChange('left', e.target.value)}
          />
          <span className="spacing-label">שמאל</span>
        </div>
      </div>
    </div>
  );
};

// קומפוננטה להגדרות ניראות במכשירים
export const DeviceVisibilityControl = ({ values, onChange }) => {
  return (
    <div className="device-visibility">
      <SwitchControl
        label="הצג במחשב"
        checked={values.showOnDesktop !== false}
        onChange={(checked) => onChange({...values, showOnDesktop: checked})}
      />
      <SwitchControl
        label="הצג בטאבלט"
        checked={values.showOnTablet !== false}
        onChange={(checked) => onChange({...values, showOnTablet: checked})}
      />
      <SwitchControl
        label="הצג במובייל"
        checked={values.showOnMobile !== false}
        onChange={(checked) => onChange({...values, showOnMobile: checked})}
      />
    </div>
  );
};

// קומפוננטה להגדרות זיהוי מותאם אישית
export const CustomIdentifiers = ({ customId, customClass, onChange }) => {
  return (
    <div className="custom-identifiers">
      <div className="property-group">
        <label className="property-label">מזהה CSS מותאם אישית (ID)</label>
        <input
          type="text"
          className="text-input"
          value={customId || ''}
          onChange={(e) => onChange('customId', e.target.value)}
          placeholder="section-1"
        />
      </div>
      <div className="property-group">
        <label className="property-label">מחלקת CSS מותאמת אישית (Class)</label>
        <input
          type="text"
          className="text-input"
          value={customClass || ''}
          onChange={(e) => onChange('customClass', e.target.value)}
          placeholder="my-custom-class"
        />
      </div>
    </div>
  );
};

// קומפוננטה להגדרות אנימציה
export const AnimationControl = ({ animation, duration, delay, onChange }) => {
  return (
    <div className="animation-control">
      <div className="property-group">
        <label className="property-label">אנימציה</label>
        <select
          className="select-input"
          value={animation || 'none'}
          onChange={(e) => onChange('animation', e.target.value)}
        >
          <option value="none">ללא</option>
          <option value="fade">Fade In</option>
          <option value="slideUp">Slide Up</option>
          <option value="slideDown">Slide Down</option>
          <option value="zoomIn">Zoom In</option>
        </select>
      </div>
      
      {animation && animation !== 'none' && (
        <>
          <div className="property-group">
            <label className="property-label">משך (שניות)</label>
            <RangeSlider
              min={0.1}
              max={3}
              step={0.1}
              value={duration || 0.5}
              onChange={(value) => onChange('animationDuration', value)}
            />
          </div>
          <div className="property-group">
            <label className="property-label">השהייה (שניות)</label>
            <RangeSlider
              min={0}
              max={2}
              step={0.1}
              value={delay || 0}
              onChange={(value) => onChange('animationDelay', value)}
            />
          </div>
        </>
      )}
    </div>
  );
};