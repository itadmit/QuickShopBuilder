// src/components/editor/panels/StylePanels/TestimonialsStylePanel.jsx
import React from 'react';
import RangeSlider from '../../controls/RangeSlider';
import ColorPicker from '../../controls/ColorPicker';
import SelectControl from '../../controls/SelectControl';
import SwitchControl from '../../controls/SwitchControl';
import TypographyControl from '../../controls/TypographyControl';

const TestimonialsStylePanel = ({ data, onChange }) => {
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
      
      {/* כותרת ראשית */}
      <div className="property-group">
        <div className="collapsible-panel">
          <div 
            className="collapsible-header"
            onClick={(e) => {
              e.currentTarget.closest('.collapsible-panel').classList.toggle('open');
            }}
          >
            <span>הגדרות כותרת ראשית</span>
            <div className="toggle-button">⮟</div>
          </div>
          <div className="collapsible-content">
            <TypographyControl
              values={{
                fontFamily: data.titleFontFamily || "'Noto Sans Hebrew', sans-serif",
                fontSize: data.titleFontSize || 32,
                fontWeight: data.titleFontWeight || "bold",
                fontStyle: data.titleFontStyle || "normal",
                textDecoration: data.titleTextDecoration || "none",
                textTransform: data.titleTextTransform || "none",
                lineHeight: data.titleLineHeight || 1.2,
                letterSpacing: data.titleLetterSpacing || 0
              }}
              onChange={(newValues) => handleTypographyChange('title', newValues)}
              title="כותרת ראשית"
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

      {/* תוכן המלצה */}
      <div className="property-group">
        <div className="collapsible-panel">
          <div 
            className="collapsible-header"
            onClick={(e) => {
              e.currentTarget.closest('.collapsible-panel').classList.toggle('open');
            }}
          >
            <span>הגדרות תוכן המלצה</span>
            <div className="toggle-button">⮟</div>
          </div>
          <div className="collapsible-content">
            <TypographyControl
              values={{
                fontFamily: data.testimonialFontFamily || "'Noto Sans Hebrew', sans-serif",
                fontSize: data.testimonialFontSize || 18,
                fontWeight: data.testimonialFontWeight || "normal",
                fontStyle: data.testimonialFontStyle || "italic",
                textDecoration: data.testimonialTextDecoration || "none",
                textTransform: data.testimonialTextTransform || "none",
                lineHeight: data.testimonialLineHeight || 1.6,
                letterSpacing: data.testimonialLetterSpacing || 0
              }}
              onChange={(newValues) => handleTypographyChange('testimonial', newValues)}
              title="תוכן המלצה"
            />
            
            <div className="property-group">
              <label className="property-label">צבע תוכן</label>
              <ColorPicker
                value={data.testimonialColor || '#444444'}
                onChange={(value) => handleChange('testimonialColor', value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* שם ממליץ */}
      <div className="property-group">
        <div className="collapsible-panel">
          <div 
            className="collapsible-header"
            onClick={(e) => {
              e.currentTarget.closest('.collapsible-panel').classList.toggle('open');
            }}
          >
            <span>הגדרות שם ממליץ</span>
            <div className="toggle-button">⮟</div>
          </div>
          <div className="collapsible-content">
            <TypographyControl
              values={{
                fontFamily: data.authorFontFamily || "'Noto Sans Hebrew', sans-serif",
                fontSize: data.authorFontSize || 14,
                fontWeight: data.authorFontWeight || "bold",
                fontStyle: data.authorFontStyle || "normal",
                textDecoration: data.authorTextDecoration || "none",
                textTransform: data.authorTextTransform || "none",
                lineHeight: data.authorLineHeight || 1.2,
                letterSpacing: data.authorLetterSpacing || 0
              }}
              onChange={(newValues) => handleTypographyChange('author', newValues)}
              title="שם ממליץ"
              showAllOptions={false}
            />
            
            <div className="property-group">
              <label className="property-label">צבע שם ממליץ</label>
              <ColorPicker
                value={data.authorColor || '#666666'}
                onChange={(value) => handleChange('authorColor', value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* עיצוב כרטיסי המלצה */}
      <div className="property-group-title">עיצוב כרטיסי המלצה</div>
      
      <div className="property-group">
        <label className="property-label">סגנון תצוגה</label>
        <SelectControl
          options={[
            { value: 'grid', label: 'רשת' },
            { value: 'slider', label: 'סליידר' },
            { value: 'list', label: 'רשימה' }
          ]}
          value={data.displayStyle || 'grid'}
          onChange={(value) => handleChange('displayStyle', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">צבע רקע כרטיס</label>
        <ColorPicker
          value={data.cardBackgroundColor || '#ffffff'}
          onChange={(value) => handleChange('cardBackgroundColor', value)}
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
              max={3}
              value={data.borderWidth || 1}
              onChange={(value) => handleChange('borderWidth', value)}
            />
          </div>
        </>
      )}
      
      <div className="property-group">
        <label className="property-label">עיגול פינות</label>
        <RangeSlider
          min={0}
          max={20}
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
            value={data.shadowSize || 10}
            onChange={(value) => handleChange('shadowSize', value)}
          />
        </div>
      )}
      
      <div className="property-group">
        <label className="property-label">ריפוד פנימי</label>
        <RangeSlider
          min={10}
          max={50}
          value={data.padding || 24}
          onChange={(value) => handleChange('padding', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">מרווח בין המלצות</label>
        <RangeSlider
          min={10}
          max={60}
          value={data.gap || 20}
          onChange={(value) => handleChange('gap', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">הצג מירכאות</label>
        <SwitchControl
          checked={data.showQuotes || true}
          onChange={(checked) => handleChange('showQuotes', checked)}
        />
      </div>
      
      {data.showQuotes && (
        <>
          <div className="property-group">
            <label className="property-label">צבע מירכאות</label>
            <ColorPicker
              value={data.quotesColor || 'rgba(82, 113, 255, 0.2)'}
              onChange={(value) => handleChange('quotesColor', value)}
            />
          </div>
          
          <div className="property-group">
            <label className="property-label">גודל מירכאות</label>
            <RangeSlider
              min={30}
              max={120}
              value={data.quotesSize || 60}
              onChange={(value) => handleChange('quotesSize', value)}
            />
          </div>
        </>
      )}
    </>
  );
};

export default TestimonialsStylePanel;