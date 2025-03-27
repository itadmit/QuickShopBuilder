// src/components/editor/controls/SwitchControl.jsx
import React from 'react';

const SwitchControl = ({ label, checked, onChange, disabled = false }) => {
  return (
    <label className="switch-container">
      <span className="switch-label">{label}</span>
      <div className="switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <span className="switch-slider"></span>
      </div>
    </label>
  );
};

export default SwitchControl;