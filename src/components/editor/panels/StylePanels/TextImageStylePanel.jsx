// src/components/editor/panels/StylePanels/TextImageStylePanel.jsx
import React from 'react';
import RangeSlider from '../../controls/RangeSlider';
import ColorPicker from '../../controls/ColorPicker';
import TypographyControl from '../../controls/TypographyControl';

const TextImageStylePanel = ({ data, onChange }) => {
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
      {/* טיפוגרפיה */}
      <div className="property-group-title">טיפוגרפיה</div>
      
      {/* כותרת */}
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
                fontSize: data.titleFontSize || 28,
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
                value={data.titleColor || '#202123'}
                onChange={(value) => handleChange('titleColor', value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* טקסט */}
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
                fontFamily: data.textFontFamily || "'Noto Sans Hebrew', sans-serif",
                fontSize: data.textFontSize || 16,
                fontWeight: data.textFontWeight || "normal",
                fontStyle: data.textFontStyle || "normal",
                textDecoration: data.textTextDecoration || "none",
                textTransform: data.textTextTransform || "none",
                lineHeight: data.textLineHeight || 1.6,
                letterSpacing: data.textLetterSpacing || 0
              }}
              onChange={(newValues) => handleTypographyChange('text', newValues)}
              title="טקסט"
            />
            
            <div className="property-group">
              <label className="property-label">צבע טקסט</label>
              <ColorPicker
                value={data.textColor || '#65676b'}
                onChange={(value) => handleChange('textColor', value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* תמונה */}
      <div className="property-group-title">תמונה</div>
      <div className="property-group">
        <label className="property-label">גודל תמונה</label>
        <RangeSlider
          min={20}
          max={80}
          value={data.imageWidth || 50}
          onChange={(value) => handleChange('imageWidth', value)}
        />
      </div>
      <div className="property-group">
        <label className="property-label">עיגול פינות</label>
        <RangeSlider
          min={0}
          max={30}
          value={data.imageBorderRadius || 8}
          onChange={(value) => handleChange('imageBorderRadius', value)}
        />
      </div>
      <div className="property-group">
        <label className="property-label">צל תמונה</label>
        <RangeSlider
          min={0}
          max={40}
          value={data.imageShadow || 0}
          onChange={(value) => handleChange('imageShadow', value)}
        />
      </div>
    </>
  );
};

export default TextImageStylePanel;