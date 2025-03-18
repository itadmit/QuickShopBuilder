import React from 'react';

const SwitchControl = ({ label, checked = false, onChange, disabled = false }) => {
  return (
    <div className="switch-control">
      <label className="switch-label">
        <div className="switch-container">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="switch-input"
          />
          <span className="switch-slider"></span>
        </div>
        <span className="switch-text">{label}</span>
      </label>
    </div>
  );
};

export default SwitchControl;