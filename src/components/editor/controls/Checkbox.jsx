// src/components/editor/controls/Checkbox.jsx
import React from 'react';

/**
 * רכיב צ'קבוקס מותאם עם תמיכה מלאה ב-RTL
 */
const Checkbox = ({ label, checked, onChange, disabled = false }) => {
  return (
    <label className="checkbox-container">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="checkmark"></span>
      <span className="checkbox-label">{label}</span>
    </label>
  );
};

export default Checkbox;