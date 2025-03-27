// src/components/editor/panels/StylePanels/NewsletterStylePanel.jsx
import React from 'react';
import RangeSlider from '../../controls/RangeSlider';
import ColorPicker from '../../controls/ColorPicker';
import ImagePicker from '../../controls/ImagePicker';
import SelectControl from '../../controls/SelectControl';
import SwitchControl from '../../controls/SwitchControl';
import TypographyControl from '../../controls/TypographyControl';

const NewsletterStylePanel = ({ data, onChange }) => {
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

      {/* תיאור */}
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

      {/* רקע */}
      <div className="property-group-title">רקע</div>
      
      <div className="property-group">
        <label className="property-label">סוג רקע</label>
        <SelectControl
          options={[
            { value: 'color', label: 'צבע רקע' },
            { value: 'image', label: 'תמונת רקע' }
          ]}
          value={data.backgroundType || 'color'}
          onChange={(value) => handleChange('backgroundType', value)}
        />
      </div>
      
      {data.backgroundType === 'color' ? (
        <div className="property-group">
          <label className="property-label">צבע רקע</label>
          <ColorPicker
            value={data.backgroundColor || '#f7f7f7'}
            onChange={(value) => handleChange('backgroundColor', value)}
          />
        </div>
      ) : (
        <>
          <div className="property-group">
            <label className="property-label">תמונת רקע</label>
            <ImagePicker
              value={data.backgroundImage || ''}
              onChange={(value) => handleChange('backgroundImage', value)}
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
          
          <div className="property-group">
            <label className="property-label">צבע שכבת עמעום</label>
            <ColorPicker
              value={data.overlayColor || 'rgba(0, 0, 0, 0.5)'}
              onChange={(value) => handleChange('overlayColor', value)}
            />
          </div>
        </>
      )}
      
      <div className="property-group">
        <label className="property-label">עיגול פינות</label>
        <RangeSlider
          min={0}
          max={30}
          value={data.borderRadius || 8}
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
      
      {/* שדות טופס */}
      <div className="property-group-title">שדות טופס</div>
      
      <div className="property-group">
        <label className="property-label">צבע רקע שדות</label>
        <ColorPicker
          value={data.inputBackgroundColor || '#ffffff'}
          onChange={(value) => handleChange('inputBackgroundColor', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">צבע טקסט שדות</label>
        <ColorPicker
          value={data.inputTextColor || '#333333'}
          onChange={(value) => handleChange('inputTextColor', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">צבע גבול שדות</label>
        <ColorPicker
          value={data.inputBorderColor || '#dddddd'}
          onChange={(value) => handleChange('inputBorderColor', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">עובי גבול שדות</label>
        <RangeSlider
          min={0}
          max={3}
          value={data.inputBorderWidth || 1}
          onChange={(value) => handleChange('inputBorderWidth', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">עיגול פינות שדות</label>
        <RangeSlider
          min={0}
          max={20}
          value={data.inputBorderRadius || 4}
          onChange={(value) => handleChange('inputBorderRadius', value)}
        />
      </div>
      
      {/* כפתור הרשמה */}
      <div className="property-group-title">כפתור הרשמה</div>
      
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
            
            <div className="property-group">
              <label className="property-label">צבע כפתור (מעבר עכבר)</label>
              <ColorPicker
                value={data.buttonHoverColor || '#3d5bf0'}
                onChange={(value) => handleChange('buttonHoverColor', value)}
              />
            </div>
            
            <div className="property-group">
              <label className="property-label">עיגול פינות כפתור</label>
              <RangeSlider
                min={0}
                max={30}
                value={data.buttonBorderRadius || 4}
                onChange={(value) => handleChange('buttonBorderRadius', value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="property-group">
        <label className="property-label">סגנון פריסה</label>
        <SelectControl
          options={[
            { value: 'inline', label: 'שדה וכפתור באותה שורה' },
            { value: 'block', label: 'שדה וכפתור בשורות נפרדות' }
          ]}
          value={data.formLayout || 'inline'}
          onChange={(value) => handleChange('formLayout', value)}
        />
      </div>
    </>
  );
};

export default NewsletterStylePanel;