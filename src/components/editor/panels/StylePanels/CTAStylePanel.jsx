// src/components/editor/panels/StylePanels/CTAStylePanel.jsx
import React from 'react';
import ImagePicker from '../../controls/ImagePicker';
import SelectControl from '../../controls/SelectControl';
import RangeSlider from '../../controls/RangeSlider';
import ColorPicker from '../../controls/ColorPicker';
import TypographyControl from '../../controls/TypographyControl';

const CTAStylePanel = ({ data, onChange }) => {
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
      
      {/* כותרת ראשית */}
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
                fontSize: data.titleFontSize || 24,
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
                value={data.titleColor || 'white'}
                onChange={(value) => handleChange('titleColor', value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* טקסט רגיל */}
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
                lineHeight: data.textLineHeight || 1.5,
                letterSpacing: data.textLetterSpacing || 0
              }}
              onChange={(newValues) => handleTypographyChange('text', newValues)}
              title="טקסט"
            />
            
            <div className="property-group">
              <label className="property-label">צבע טקסט</label>
              <ColorPicker
                value={data.textColor || 'white'}
                onChange={(value) => handleChange('textColor', value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* רקע */}
      <div className="property-group-title">רקע</div>
      <div className="property-group">
        <label className="property-label">תמונת רקע</label>
        <ImagePicker
          value={data.image || ''}
          onChange={(value) => handleChange('image', value)}
        />
      </div>
      <div className="property-group">
        <label className="property-label">סוג אוברליי</label>
        <SelectControl
          options={[
            { value: 'none', label: 'ללא אוברליי' },
            { value: 'bottom', label: 'אוברליי בתחתית' },
            { value: 'full', label: 'אוברליי מלא' }
          ]}
          value={data.overlayType || 'bottom'}
          onChange={(value) => handleChange('overlayType', value)}
        />
      </div>
      <div className="property-group">
        <label className="property-label">עמעום רקע</label>
        <RangeSlider
          min={0}
          max={100}
          value={(data.overlayOpacity || 0.5) * 100}
          onChange={(value) => handleChange('overlayOpacity', value / 100)}
        />
      </div>

      {/* כפתור */}
      <div className="property-group-title">כפתור</div>
      <div className="property-group">
        <div className="collapsible-panel">
          <div 
            className="collapsible-header"
            onClick={(e) => {
              e.currentTarget.closest('.collapsible-panel').classList.toggle('open');
            }}
          >
            <span>הגדרות כפתור</span>
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
              title="כפתור"
              showAllOptions={false}
            />
            
            <div className="property-group">
              <label className="property-label">צבע כפתור</label>
              <ColorPicker
                value={data.buttonColor || '#5271ff'}
                onChange={(value) => handleChange('buttonColor', value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">צבע טקסט כפתור</label>
              <ColorPicker
                value={data.buttonTextColor || '#ffffff'}
                onChange={(value) => handleChange('buttonTextColor', value)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CTAStylePanel;