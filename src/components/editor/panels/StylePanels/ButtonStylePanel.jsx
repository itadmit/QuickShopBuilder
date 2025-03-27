// src/components/editor/panels/StylePanels/ButtonStylePanel.jsx
import React from 'react';
import RangeSlider from '../../controls/RangeSlider';
import ColorPicker from '../../controls/ColorPicker';
import SelectControl from '../../controls/SelectControl';
import SwitchControl from '../../controls/SwitchControl';
import TypographyControl from '../../controls/TypographyControl';

const ButtonStylePanel = ({ data, onChange }) => {
  // פונקציה להחלפת מאפיין
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  // פונקציה להחלפת מאפייני טיפוגרפיה
  const handleTypographyChange = (prefix, newValues) => {
    const updates = {};
    Object.entries(newValues).forEach(([key, value]) => {
      updates[`${prefix}${key.charAt(0).toUpperCase() + key.slice(1)}`] = value;
    });
    onChange(updates);
  };

  return (
    <>
      <div className="property-group-title">עיצוב הכפתור</div>
      <div className="property-group">
        <div className="collapsible-panel">
          <div 
            className="collapsible-header"
            onClick={(e) => {
              e.currentTarget.closest('.collapsible-panel').classList.toggle('open');
            }}
          >
            <span>הגדרות טקסט</span>
            <div className="toggle-button">⮟</div>
          </div>
          <div className="collapsible-content">
            <TypographyControl
              values={{
                fontFamily: data.buttonFontFamily || "'Noto Sans Hebrew', sans-serif",
                fontSize: data.buttonFontSize || 14,
                fontWeight: data.buttonFontWeight || "500",
                lineHeight: data.buttonLineHeight || 1.2
              }}
              onChange={(newValues) => handleTypographyChange('button', newValues)}
              title="טקסט כפתור"
              showAllOptions={false}
            />
          </div>
        </div>
      </div>
      
      <div className="property-group">
        <label className="property-label">צבע רקע</label>
        <ColorPicker
          value={data.buttonColor || '#5271ff'}
          onChange={(value) => handleChange('buttonColor', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">צבע טקסט</label>
        <ColorPicker
          value={data.buttonTextColor || '#ffffff'}
          onChange={(value) => handleChange('buttonTextColor', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">צבע רקע (מעבר עכבר)</label>
        <ColorPicker
          value={data.buttonHoverColor || '#3d5bf0'}
          onChange={(value) => handleChange('buttonHoverColor', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">צבע טקסט (מעבר עכבר)</label>
        <ColorPicker
          value={data.buttonHoverTextColor || '#ffffff'}
          onChange={(value) => handleChange('buttonHoverTextColor', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">עיגול פינות</label>
        <RangeSlider
          min={0}
          max={50}
          value={data.buttonBorderRadius || 4}
          onChange={(value) => handleChange('buttonBorderRadius', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">ריפוד אנכי</label>
        <RangeSlider
          min={4}
          max={32}
          value={data.buttonPaddingVertical || 12}
          onChange={(value) => handleChange('buttonPaddingVertical', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">ריפוד אופקי</label>
        <RangeSlider
          min={8}
          max={60}
          value={data.buttonPaddingHorizontal || 24}
          onChange={(value) => handleChange('buttonPaddingHorizontal', value)}
        />
      </div>
      
      <div className="property-group-title">מסגרת</div>
      <div className="property-group">
        <label className="property-label">עובי מסגרת</label>
        <RangeSlider
          min={0}
          max={5}
          value={data.buttonBorderWidth || 0}
          onChange={(value) => handleChange('buttonBorderWidth', value)}
        />
      </div>
      
      {data.buttonBorderWidth > 0 && (
        <div className="property-group">
          <label className="property-label">צבע מסגרת</label>
          <ColorPicker
            value={data.buttonBorderColor || 'transparent'}
            onChange={(value) => handleChange('buttonBorderColor', value)}
          />
        </div>
      )}
      
      <div className="property-group-title">אפקטים</div>
      <div className="property-group">
        <label className="property-label">הצג צל</label>
        <SwitchControl
          checked={data.showShadow || false}
          onChange={(checked) => handleChange('showShadow', checked)}
        />
      </div>
      
      {data.showShadow && (
        <>
          <div className="property-group">
            <label className="property-label">גודל הצל</label>
            <SelectControl
              options={[
                { value: 'small', label: 'קטן' },
                { value: 'medium', label: 'בינוני' },
                { value: 'large', label: 'גדול' }
              ]}
              value={data.shadowSize || 'medium'}
              onChange={(value) => handleChange('shadowSize', value)}
            />
          </div>
          
          <div className="property-group">
            <label className="property-label">צבע צל</label>
            <ColorPicker
              value={data.shadowColor || 'rgba(0,0,0,0.2)'}
              onChange={(value) => handleChange('shadowColor', value)}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ButtonStylePanel;