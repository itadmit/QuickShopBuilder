// src/components/editor/panels/StylePanels/ProductsStylePanel.jsx
import React from 'react';
import RangeSlider from '../../controls/RangeSlider';
import ColorPicker from '../../controls/ColorPicker';
import SelectControl from '../../controls/SelectControl';
import SwitchControl from '../../controls/SwitchControl';
import TypographyControl from '../../controls/TypographyControl';

const ProductsStylePanel = ({ data, onChange }) => {
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
      
      {/* כותרת מדור */}
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

      {/* שם המוצר */}
      <div className="property-group">
        <div className="collapsible-panel">
          <div 
            className="collapsible-header"
            onClick={(e) => {
              e.currentTarget.closest('.collapsible-panel').classList.toggle('open');
            }}
          >
            <span>הגדרות שם מוצר</span>
            <div className="toggle-button">⮟</div>
          </div>
          <div className="collapsible-content">
            <TypographyControl
              values={{
                fontFamily: data.productNameFontFamily || "'Noto Sans Hebrew', sans-serif",
                fontSize: data.productNameFontSize || 16,
                fontWeight: data.productNameFontWeight || "500",
                fontStyle: data.productNameFontStyle || "normal",
                textDecoration: data.productNameTextDecoration || "none",
                textTransform: data.productNameTextTransform || "none",
                lineHeight: data.productNameLineHeight || 1.4,
                letterSpacing: data.productNameLetterSpacing || 0
              }}
              onChange={(newValues) => handleTypographyChange('productName', newValues)}
              title="שם מוצר"
              showAllOptions={false}
            />
            
            <div className="property-group">
              <label className="property-label">צבע שם מוצר</label>
              <ColorPicker
                value={data.productNameColor || '#333333'}
                onChange={(value) => handleChange('productNameColor', value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* מחיר מוצר */}
      <div className="property-group">
        <div className="collapsible-panel">
          <div 
            className="collapsible-header"
            onClick={(e) => {
              e.currentTarget.closest('.collapsible-panel').classList.toggle('open');
            }}
          >
            <span>הגדרות מחיר</span>
            <div className="toggle-button">⮟</div>
          </div>
          <div className="collapsible-content">
            <TypographyControl
              values={{
                fontFamily: data.priceFontFamily || "'Noto Sans Hebrew', sans-serif",
                fontSize: data.priceFontSize || 14,
                fontWeight: data.priceFontWeight || "bold",
                fontStyle: data.priceFontStyle || "normal",
                textDecoration: data.priceTextDecoration || "none",
                lineHeight: data.priceLineHeight || 1.2
              }}
              onChange={(newValues) => handleTypographyChange('price', newValues)}
              title="מחיר"
              showAllOptions={false}
            />
            
            <div className="property-group">
              <label className="property-label">צבע מחיר רגיל</label>
              <ColorPicker
                value={data.priceColor || '#333333'}
                onChange={(value) => handleChange('priceColor', value)}
              />
            </div>
            
            <div className="property-group">
              <label className="property-label">צבע מחיר מבצע</label>
              <ColorPicker
                value={data.salePriceColor || '#e74c3c'}
                onChange={(value) => handleChange('salePriceColor', value)}
              />
            </div>
            
            <div className="property-group">
              <label className="property-label">צבע מחיר מקורי (במבצע)</label>
              <ColorPicker
                value={data.originalPriceColor || '#999999'}
                onChange={(value) => handleChange('originalPriceColor', value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* עיצוב כרטיסים */}
      <div className="property-group-title">עיצוב כרטיסי מוצר</div>
      
      <div className="property-group">
        <label className="property-label">צבע רקע כרטיס</label>
        <ColorPicker
          value={data.cardBackgroundColor || '#ffffff'}
          onChange={(value) => handleChange('cardBackgroundColor', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">מרווח בין פריטים</label>
        <RangeSlider
          min={4}
          max={40}
          value={data.itemGap || 24}
          onChange={(value) => handleChange('itemGap', value)}
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
              value={data.borderColor || '#e4e6eb'}
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
          max={16}
          value={data.borderRadius || 4}
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
            value={data.shadowIntensity || 5}
            onChange={(value) => handleChange('shadowIntensity', value)}
          />
        </div>
      )}
      
      <div className="property-group">
        <label className="property-label">יחס תמונת מוצר</label>
        <SelectControl
          options={[
            { value: '1:1', label: 'ריבוע (1:1)' },
            { value: '4:3', label: 'סטנדרטי (4:3)' },
            { value: '3:4', label: 'פורטרט (3:4)' },
            { value: '16:9', label: 'רחב (16:9)' }
          ]}
          value={data.productImageRatio || '1:1'}
          onChange={(value) => handleChange('productImageRatio', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">אפקט מעבר עכבר</label>
        <SelectControl
          options={[
            { value: 'none', label: 'ללא' },
            { value: 'zoom', label: 'הגדלה' },
            { value: 'fade', label: 'הבהרה' },
            { value: 'shadow', label: 'הגדלת צל' }
          ]}
          value={data.hoverEffect || 'none'}
          onChange={(value) => handleChange('hoverEffect', value)}
        />
      </div>
    </>
  );
};

export default ProductsStylePanel;