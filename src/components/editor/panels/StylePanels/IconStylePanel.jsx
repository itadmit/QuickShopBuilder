// src/components/editor/panels/StylePanels/IconStylePanel.jsx
import React from 'react';
import RangeSlider from '../../controls/RangeSlider';
import ColorPicker from '../../controls/ColorPicker';
import SelectControl from '../../controls/SelectControl';
import SwitchControl from '../../controls/SwitchControl';
import TypographyControl from '../../controls/TypographyControl';

const IconStylePanel = ({ data, onChange }) => {
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
      <div className="property-group-title">סגנון אייקון</div>
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

      {/* טיפוגרפיה */}
      {(data.title || data.content) && (
        <>
          <div className="property-group-title">טיפוגרפיה</div>
          
          {/* כותרת */}
          {data.title && (
            <div className="property-group">
              <div className="collapsible-panel">
                <div 
                  className="collapsible-header"
                  onClick={(e) => {
                    e.currentTarget.closest('.collapsible-panel').classList.toggle('open');
                  }}
                >
                  <span>הגדרות כותרת</span>
                  <div className="toggle-button">⮟</div>
                </div>
                <div className="collapsible-content">
                  <TypographyControl
                    values={{
                      fontFamily: data.titleFontFamily || "'Noto Sans Hebrew', sans-serif",
                      fontSize: data.titleFontSize || 18,
                      fontWeight: data.titleFontWeight || "bold",
                      fontStyle: data.titleFontStyle || "normal",
                      textDecoration: data.titleTextDecoration || "none",
                      textTransform: data.titleTextTransform || "none",
                      lineHeight: data.titleLineHeight || 1.2,
                      letterSpacing: data.titleLetterSpacing || 0
                    }}
                    onChange={(newValues) => handleTypographyChange('title', newValues)}
                    title="כותרת"
                  />
                  
                  <div className="property-group">
                    <label className="property-label">צבע כותרת</label>
                    <ColorPicker
                      value={data.titleColor || '#333'}
                      onChange={(value) => handleChange('titleColor', value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* תוכן */}
          {data.content && (
            <div className="property-group">
              <div className="collapsible-panel">
                <div 
                  className="collapsible-header"
                  onClick={(e) => {
                    e.currentTarget.closest('.collapsible-panel').classList.toggle('open');
                  }}
                >
                  <span>הגדרות תוכן</span>
                  <div className="toggle-button">⮟</div>
                </div>
                <div className="collapsible-content">
                  <TypographyControl
                    values={{
                      fontFamily: data.textFontFamily || "'Noto Sans Hebrew', sans-serif",
                      fontSize: data.textFontSize || 16,
                      fontWeight: data.textFontWeight || "normal",
                      fontStyle: data.textFontStyle || "normal",
                      textDecoration: data.textTextDecoration || "none",
                      textTransform: data.textTextTransform || "none",
                      lineHeight: data.textLineHeight || 1.5,
                      letterSpacing: data.textLetterSpacing || 0
                    }}
                    onChange={(newValues) => handleTypographyChange('text', newValues)}
                    title="תוכן"
                  />
                  
                  <div className="property-group">
                    <label className="property-label">צבע תוכן</label>
                    <ColorPicker
                      value={data.textColor || '#666'}
                      onChange={(value) => handleChange('textColor', value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* רקע */}
      <div className="property-group-title">רקע אייקון</div>
      <div className="property-group">
        <label className="property-label">צבע רקע</label>
        <ColorPicker
          value={data.backgroundColor || ''}
          onChange={(value) => handleChange('backgroundColor', value)}
        />
      </div>
      <div className="property-group">
        <label className="property-label">שקיפות רקע</label>
        <RangeSlider
          min={0}
          max={100}
          value={(data.backgroundOpacity || 1) * 100}
          onChange={(value) => handleChange('backgroundOpacity', value / 100)}
        />
      </div>
      <div className="property-group">
        <label className="property-label">עיגול פינות</label>
        <RangeSlider
          min={0}
          max={50}
          value={data.borderRadius || 0}
          onChange={(value) => handleChange('borderRadius', value)}
        />
      </div>
      <div className="property-group">
        <label className="property-label">הצג מסגרת</label>
        <SwitchControl
          checked={data.showBorder || false}
          onChange={(checked) => handleChange('showBorder', checked)}
        />
      </div>
      {data.showBorder && (
        <>
          <div className="property-group">
            <label className="property-label">צבע מסגרת</label>
            <ColorPicker
              value={data.borderColor || '#e0e0e0'}
              onChange={(value) => handleChange('borderColor', value)}
            />
          </div>
          <div className="property-group">
            <label className="property-label">עובי מסגרת</label>
            <RangeSlider
              min={1}
              max={10}
              value={data.borderWidth || 1}
              onChange={(value) => handleChange('borderWidth', value)}
            />
          </div>
        </>
      )}
    </>
  );
};

export default IconStylePanel;