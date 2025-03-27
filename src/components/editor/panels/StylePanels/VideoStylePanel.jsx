// src/components/editor/panels/StylePanels/VideoStylePanel.jsx
import React from 'react';
import RangeSlider from '../../controls/RangeSlider';
import ColorPicker from '../../controls/ColorPicker';
import SwitchControl from '../../controls/SwitchControl';
import TypographyControl from '../../controls/TypographyControl';

const VideoStylePanel = ({ data, onChange }) => {
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
      {/* טיפוגרפיה - רק אם יש כותרת או תיאור */}
      {(data.title || data.description) && (
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
                      value={data.titleColor || '#202123'}
                      onChange={(value) => handleChange('titleColor', value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* תיאור */}
          {data.description && (
            <div className="property-group">
              <div className="collapsible-panel">
                <div 
                  className="collapsible-header"
                  onClick={(e) => {
                    e.currentTarget.closest('.collapsible-panel').classList.toggle('open');
                  }}
                >
                  <span>הגדרות תיאור</span>
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
                    title="תיאור"
                  />
                  
                  <div className="property-group">
                    <label className="property-label">צבע תיאור</label>
                    <ColorPicker
                      value={data.textColor || '#65676b'}
                      onChange={(value) => handleChange('textColor', value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* עיצוב הווידאו */}
      <div className="property-group-title">עיצוב הווידאו</div>
      
      <div className="property-group">
        <label className="property-label">עיגול פינות</label>
        <RangeSlider
          min={0}
          max={24}
          value={data.borderRadius || 0}
          onChange={(value) => handleChange('borderRadius', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">הצג צל</label>
        <SwitchControl
          checked={data.showShadow || false}
          onChange={(checked) => handleChange('showShadow', checked)}
        />
      </div>
      
      {data.showShadow && (
        <div className="property-group">
          <label className="property-label">עוצמת צל</label>
          <RangeSlider
            min={1}
            max={30}
            value={data.shadowSize || 15}
            onChange={(value) => handleChange('shadowSize', value)}
          />
        </div>
      )}
      
      <div className="property-group">
        <label className="property-label">מסגרת</label>
        <SwitchControl
          checked={data.showBorder || false}
          onChange={(checked) => handleChange('showBorder', checked)}
        />
      </div>
      
      {data.showBorder && (
        <>
          <div className="property-group">
            <label className="property-label">עובי מסגרת</label>
            <RangeSlider
              min={1}
              max={10}
              value={data.borderWidth || 1}
              onChange={(value) => handleChange('borderWidth', value)}
            />
          </div>
          
          <div className="property-group">
            <label className="property-label">צבע מסגרת</label>
            <ColorPicker
              value={data.borderColor || '#e0e0e0'}
              onChange={(value) => handleChange('borderColor', value)}
            />
          </div>
        </>
      )}
      
      <div className="property-group">
        <label className="property-label">רקע נגן (לווידאו מקומי)</label>
        <ColorPicker
          value={data.playerBackgroundColor || '#000000'}
          onChange={(value) => handleChange('playerBackgroundColor', value)}
        />
      </div>
    </>
  );
};

export default VideoStylePanel;