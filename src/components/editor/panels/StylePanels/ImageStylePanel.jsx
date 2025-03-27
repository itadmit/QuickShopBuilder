// src/components/editor/panels/StylePanels/ImageStylePanel.jsx
import React from 'react';
import RangeSlider from '../../controls/RangeSlider';
import ColorPicker from '../../controls/ColorPicker';
import SelectControl from '../../controls/SelectControl';
import SwitchControl from '../../controls/SwitchControl';
import TypographyControl from '../../controls/TypographyControl';

const ImageStylePanel = ({ data, onChange }) => {
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
      <div className="property-group-title">עיצוב תמונה</div>
      
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
          
          <div className="property-group">
            <label className="property-label">סגנון מסגרת</label>
            <SelectControl
              options={[
                { value: 'solid', label: 'רציף' },
                { value: 'dashed', label: 'מקווקו' },
                { value: 'dotted', label: 'נקודות' },
                { value: 'double', label: 'כפול' }
              ]}
              value={data.borderStyle || 'solid'}
              onChange={(value) => handleChange('borderStyle', value)}
            />
          </div>
        </>
      )}
      
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
            <label className="property-label">עוצמת צל</label>
            <RangeSlider
              min={1}
              max={50}
              value={data.shadowSize || 10}
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
      
      <div className="property-group">
        <label className="property-label">סוג התאמת גודל</label>
        <SelectControl
          options={[
            { value: 'auto', label: 'אוטומטי' },
            { value: 'cover', label: 'מילוי מלא' },
            { value: 'contain', label: 'התאמה למסגרת' },
            { value: 'custom', label: 'מותאם אישית' }
          ]}
          value={data.sizeMode || 'auto'}
          onChange={(value) => handleChange('sizeMode', value)}
        />
      </div>
      
      {data.sizeMode === 'custom' && (
        <>
          <div className="property-group">
            <label className="property-label">רוחב מותאם אישית (%)</label>
            <RangeSlider
              min={10}
              max={100}
              value={data.customWidth || 100}
              onChange={(value) => handleChange('customWidth', value)}
            />
          </div>
          
          <div className="property-group">
            <label className="property-label">גובה מותאם אישית (px)</label>
            <RangeSlider
              min={0}
              max={1000}
              value={data.customHeight || 0}
              onChange={(value) => handleChange('customHeight', value)}
            />
            <div className="hint-text">0 = אוטומטי לפי יחס התמונה</div>
          </div>
        </>
      )}
      
      <div className="property-group">
        <label className="property-label">אפקט מעבר עכבר</label>
        <SelectControl
          options={[
            { value: 'none', label: 'ללא' },
            { value: 'zoom', label: 'הגדלה' },
            { value: 'brightness', label: 'הבהרה' },
            { value: 'grayscale', label: 'גווני אפור <-> צבע' },
            { value: 'blur', label: 'טשטוש <-> חדות' }
          ]}
          value={data.hoverEffect || 'none'}
          onChange={(value) => handleChange('hoverEffect', value)}
        />
      </div>
      
      {/* כותרת תמונה (אם קיימת) */}
      {data.title && (
        <>
          <div className="property-group-title">כותרת תמונה</div>
          
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
                    fontSize: data.titleFontSize || 16,
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
                    value={data.titleColor || '#333333'}
                    onChange={(value) => handleChange('titleColor', value)}
                  />
                </div>
                
                <div className="property-group">
                  <label className="property-label">מיקום כותרת</label>
                  <SelectControl
                    options={[
                      { value: 'below', label: 'מתחת לתמונה' },
                      { value: 'above', label: 'מעל התמונה' },
                      { value: 'over', label: 'על גבי התמונה' }
                    ]}
                    value={data.titlePosition || 'below'}
                    onChange={(value) => handleChange('titlePosition', value)}
                  />
                </div>
                
                {data.titlePosition === 'over' && (
                  <>
                    <div className="property-group">
                      <label className="property-label">עמעום רקע לכותרת</label>
                      <RangeSlider
                        min={0}
                        max={100}
                        value={(data.titleOverlayOpacity || 0.7) * 100}
                        onChange={(value) => handleChange('titleOverlayOpacity', value / 100)}
                      />
                    </div>
                    
                    <div className="property-group">
                      <label className="property-label">מיקום אנכי</label>
                      <SelectControl
                        options={[
                          { value: 'top', label: 'למעלה' },
                          { value: 'center', label: 'באמצע' },
                          { value: 'bottom', label: 'למטה' }
                        ]}
                        value={data.titleVerticalPosition || 'bottom'}
                        onChange={(value) => handleChange('titleVerticalPosition', value)}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ImageStylePanel;
