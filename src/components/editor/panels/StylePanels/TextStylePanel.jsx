// src/components/editor/panels/StylePanels/TextStylePanel.jsx
import React from 'react';
import RangeSlider from '../../controls/RangeSlider';
import ColorPicker from '../../controls/ColorPicker';
import SelectControl from '../../controls/SelectControl';
import SwitchControl from '../../controls/SwitchControl';
import TypographyControl from '../../controls/TypographyControl';

const TextStylePanel = ({ data, onChange }) => {
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
                  value={data.titleColor || '#333333'}
                  onChange={(value) => handleChange('titleColor', value)}
                />
              </div>
              
              <div className="property-group">
                <label className="property-label">מרווח תחתון</label>
                <RangeSlider
                  min={0}
                  max={50}
                  value={data.titleMarginBottom || 15}
                  onChange={(value) => handleChange('titleMarginBottom', value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* טקסט תוכן */}
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
                fontFamily: data.contentFontFamily || "'Noto Sans Hebrew', sans-serif",
                fontSize: data.contentFontSize || 16,
                fontWeight: data.contentFontWeight || "normal",
                fontStyle: data.contentFontStyle || "normal",
                textDecoration: data.contentTextDecoration || "none",
                textTransform: data.contentTextTransform || "none",
                lineHeight: data.contentLineHeight || 1.6,
                letterSpacing: data.contentLetterSpacing || 0
              }}
              onChange={(newValues) => handleTypographyChange('content', newValues)}
              title="טקסט"
            />
            
            <div className="property-group">
              <label className="property-label">צבע טקסט</label>
              <ColorPicker
                value={data.contentColor || '#444444'}
                onChange={(value) => handleChange('contentColor', value)}
              />
            </div>
            
            <div className="property-group">
              <label className="property-label">צבע קישורים</label>
              <ColorPicker
                value={data.linkColor || '#5271ff'}
                onChange={(value) => handleChange('linkColor', value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* עיצוב מכל טקסט */}
      <div className="property-group-title">עיצוב כללי</div>
      
      <div className="property-group">
        <label className="property-label">יישור טקסט</label>
        <SelectControl
          options={[
            { value: 'right', label: 'ימין' },
            { value: 'center', label: 'מרכז' },
            { value: 'left', label: 'שמאל' },
            { value: 'justify', label: 'מיושר לשני הצדדים' }
          ]}
          value={data.alignment || 'right'}
          onChange={(value) => handleChange('alignment', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">צבע רקע</label>
        <ColorPicker
          value={data.backgroundColor || 'transparent'}
          onChange={(value) => handleChange('backgroundColor', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">ריפוד פנימי</label>
        <RangeSlider
          min={0}
          max={50}
          value={data.padding || 0}
          onChange={(value) => handleChange('padding', value)}
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
              max={5}
              value={data.borderWidth || 1}
              onChange={(value) => handleChange('borderWidth', value)}
            />
          </div>
          
          <div className="property-group">
            <label className="property-label">עיגול פינות</label>
            <RangeSlider
              min={0}
              max={20}
              value={data.borderRadius || 0}
              onChange={(value) => handleChange('borderRadius', value)}
            />
          </div>
        </>
      )}
      
      <div className="property-group">
        <label className="property-label">אפקט טקסט מיוחד</label>
        <SelectControl
          options={[
            { value: 'none', label: 'ללא' },
            { value: 'drop-cap', label: 'אות פתיחה גדולה' },
            { value: 'highlight', label: 'הדגשת מילים בסוגריים' },
            { value: 'columns', label: 'מספר עמודות' }
          ]}
          value={data.textEffect || 'none'}
          onChange={(value) => handleChange('textEffect', value)}
        />
      </div>
      
      {data.textEffect === 'drop-cap' && (
        <div className="property-group">
          <label className="property-label">צבע אות פתיחה</label>
          <ColorPicker
            value={data.dropCapColor || '#5271ff'}
            onChange={(value) => handleChange('dropCapColor', value)}
          />
        </div>
      )}
      
      {data.textEffect === 'highlight' && (
        <div className="property-group">
          <label className="property-label">צבע הדגשה</label>
          <ColorPicker
            value={data.highlightColor || '#ffeb3b'}
            onChange={(value) => handleChange('highlightColor', value)}
          />
        </div>
      )}
      
      {data.textEffect === 'columns' && (
        <div className="property-group">
          <label className="property-label">מספר עמודות</label>
          <RangeSlider
            min={2}
            max={4}
            value={data.columnsCount || 2}
            onChange={(value) => handleChange('columnsCount', value)}
          />
        </div>
      )}
    </>
  );
};

export default TextStylePanel;