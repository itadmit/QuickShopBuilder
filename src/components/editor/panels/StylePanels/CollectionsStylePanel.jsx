// src/components/editor/panels/StylePanels/CollectionsStylePanel.jsx
import React from 'react';
import RangeSlider from '../../controls/RangeSlider';
import ColorPicker from '../../controls/ColorPicker';
import SelectControl from '../../controls/SelectControl';
import SwitchControl from '../../controls/SwitchControl';
import TypographyControl from '../../controls/TypographyControl';

const CollectionsStylePanel = ({ data, onChange }) => {
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

      {/* שם קטגוריה */}
      <div className="property-group">
        <div className="collapsible-panel">
          <div 
            className="collapsible-header"
            onClick={(e) => {
              e.currentTarget.closest('.collapsible-panel').classList.toggle('open');
            }}
          >
            <span>הגדרות שם קטגוריה</span>
            <div className="toggle-button">⮟</div>
          </div>
          <div className="collapsible-content">
            <TypographyControl
              values={{
                fontFamily: data.categoryNameFontFamily || "'Noto Sans Hebrew', sans-serif",
                fontSize: data.categoryNameFontSize || 18,
                fontWeight: data.categoryNameFontWeight || "bold",
                fontStyle: data.categoryNameFontStyle || "normal",
                textDecoration: data.categoryNameTextDecoration || "none",
                textTransform: data.categoryNameTextTransform || "none",
                lineHeight: data.categoryNameLineHeight || 1.4,
                letterSpacing: data.categoryNameLetterSpacing || 0
              }}
              onChange={(newValues) => handleTypographyChange('categoryName', newValues)}
              title="שם קטגוריה"
            />
            
            <div className="property-group">
              <label className="property-label">צבע שם קטגוריה</label>
              <ColorPicker
                value={data.categoryNameColor || '#ffffff'}
                onChange={(value) => handleChange('categoryNameColor', value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* מספר מוצרים */}
      <div className="property-group">
        <div className="collapsible-panel">
          <div 
            className="collapsible-header"
            onClick={(e) => {
              e.currentTarget.closest('.collapsible-panel').classList.toggle('open');
            }}
          >
            <span>הגדרות מספר מוצרים</span>
            <div className="toggle-button">⮟</div>
          </div>
          <div className="collapsible-content">
            <TypographyControl
              values={{
                fontFamily: data.productsCountFontFamily || "'Noto Sans Hebrew', sans-serif",
                fontSize: data.productsCountFontSize || 14,
                fontWeight: data.productsCountFontWeight || "normal",
                fontStyle: data.productsCountFontStyle || "normal",
                textDecoration: data.productsCountTextDecoration || "none",
                lineHeight: data.productsCountLineHeight || 1.2
              }}
              onChange={(newValues) => handleTypographyChange('productsCount', newValues)}
              title="מספר מוצרים"
              showAllOptions={false}
            />
            
            <div className="property-group">
              <label className="property-label">צבע מספר מוצרים</label>
              <ColorPicker
                value={data.productsCountColor || 'rgba(255, 255, 255, 0.8)'}
                onChange={(value) => handleChange('productsCountColor', value)}
              />
            </div>
            
            <div className="property-group">
              <label className="property-label">הצג מספר מוצרים</label>
              <SwitchControl
                checked={data.showProductsCount !== false}
                onChange={(checked) => handleChange('showProductsCount', checked)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* עיצוב כרטיסי קטגוריות */}
      <div className="property-group-title">עיצוב כרטיסי קטגוריות</div>
      
      <div className="property-group">
        <label className="property-label">סגנון כרטיס</label>
        <SelectControl
          options={[
            { value: 'overlay', label: 'טקסט על תמונה' },
            { value: 'plain', label: 'טקסט מתחת לתמונה' },
            { value: 'minimal', label: 'מינימליסטי' }
          ]}
          value={data.cardStyle || 'overlay'}
          onChange={(value) => handleChange('cardStyle', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">יחס גובה-רוחב</label>
        <SelectControl
          options={[
            { value: '1:1', label: 'ריבוע (1:1)' },
            { value: '4:3', label: 'סטנדרטי (4:3)' },
            { value: '3:4', label: 'פורטרט (3:4)' },
            { value: '16:9', label: 'רחב (16:9)' }
          ]}
          value={data.cardRatio || '1:1'}
          onChange={(value) => handleChange('cardRatio', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">מרווח בין כרטיסים</label>
        <RangeSlider
          min={0}
          max={40}
          value={data.gap || 20}
          onChange={(value) => handleChange('gap', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">עוצמת הכהייה</label>
        <RangeSlider
          min={0}
          max={90}
          value={data.overlayOpacity || 40}
          onChange={(value) => handleChange('overlayOpacity', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">צבע שכבת הכהייה</label>
        <ColorPicker
          value={data.overlayColor || '#000000'}
          onChange={(value) => handleChange('overlayColor', value)}
        />
      </div>
      
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
        <label className="property-label">אפקט מעבר עכבר</label>
        <SelectControl
          options={[
            { value: 'none', label: 'ללא' },
            { value: 'zoom', label: 'הגדלה' },
            { value: 'lift', label: 'הרמה' },
            { value: 'darken', label: 'הכהייה' },
            { value: 'brighten', label: 'הבהרה' }
          ]}
          value={data.hoverEffect || 'none'}
          onChange={(value) => handleChange('hoverEffect', value)}
        />
      </div>
    </>
  );
};

export default CollectionsStylePanel;