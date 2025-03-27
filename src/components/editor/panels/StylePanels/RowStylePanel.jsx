// src/components/editor/panels/StylePanels/RowStylePanel.jsx
import React from 'react';
import RangeSlider from '../../controls/RangeSlider';
import ColorPicker from '../../controls/ColorPicker';
import ImagePicker from '../../controls/ImagePicker';
import SwitchControl from '../../controls/SwitchControl';

const RowStylePanel = ({ data, onChange }) => {
  // פונקציה להחלפת מאפיין
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  return (
    <>
      <div className="property-group-title">מראה כללי</div>
      
      <div className="property-group">
        <label className="property-label">צבע רקע</label>
        <ColorPicker
          value={data.backgroundColor || 'transparent'}
          onChange={(value) => handleChange('backgroundColor', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">תמונת רקע</label>
        <ImagePicker
          value={data.backgroundImage || ''}
          onChange={(value) => handleChange('backgroundImage', value)}
        />
      </div>
      
      {data.backgroundImage && (
        <>
          <div className="property-group">
            <label className="property-label">אפקט כיסוי</label>
            <SwitchControl
              checked={data.backgroundCover || true}
              onChange={(checked) => handleChange('backgroundCover', checked)}
            />
            <span className="hint-text">{data.backgroundCover ? 'תמונה מכסה את כל האזור' : 'תמונה מוצגת כפי שהיא'}</span>
          </div>
          
          <div className="property-group">
            <label className="property-label">שקיפות אוברליי</label>
            <RangeSlider
              min={0}
              max={100}
              value={(data.overlayOpacity || 0.1) * 100}
              onChange={(value) => handleChange('overlayOpacity', value / 100)}
            />
          </div>
        </>
      )}
      
      <div className="property-group">
        <label className="property-label">עיגול פינות</label>
        <RangeSlider
          min={0}
          max={30}
          value={data.borderRadius || 0}
          onChange={(value) => handleChange('borderRadius', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">צל</label>
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
            max={40}
            value={data.shadowSize || 10}
            onChange={(value) => handleChange('shadowSize', value)}
          />
        </div>
      )}
      
      <div className="property-group-title">עיצוב עמודות</div>
      
      <div className="property-group">
        <label className="property-label">צבע רקע עמודות</label>
        <ColorPicker
          value={data.columnBackgroundColor || 'rgba(248, 249, 251, 0.7)'}
          onChange={(value) => handleChange('columnBackgroundColor', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">שקיפות רקע עמודות</label>
        <RangeSlider
          min={0}
          max={100}
          value={(parseFloat(data.columnBackgroundColor?.split(',')[3]) || 0.7) * 100}
          onChange={(value) => {
            const opacity = value / 100;
            const color = data.columnBackgroundColor || 'rgba(248, 249, 251, 0.7)';
            const rgbPart = color.substring(0, color.lastIndexOf(','));
            handleChange('columnBackgroundColor', `${rgbPart}, ${opacity})`);
          }}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">עיגול פינות עמודות</label>
        <RangeSlider
          min={0}
          max={20}
          value={data.columnBorderRadius || 4}
          onChange={(value) => handleChange('columnBorderRadius', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">צל עמודות</label>
        <SwitchControl
          checked={data.columnShadow || false}
          onChange={(checked) => handleChange('columnShadow', checked)}
        />
      </div>
      
      {data.columnShadow && (
        <div className="property-group">
          <label className="property-label">עוצמת צל עמודות</label>
          <RangeSlider
            min={1}
            max={20}
            value={data.columnShadowSize || 5}
            onChange={(value) => handleChange('columnShadowSize', value)}
          />
        </div>
      )}
      
      <div className="property-group">
        <label className="property-label">מסגרת עמודות</label>
        <RangeSlider
          min={0}
          max={5}
          value={data.columnBorderWidth || 0}
          onChange={(value) => handleChange('columnBorderWidth', value)}
        />
      </div>
      
      {data.columnBorderWidth > 0 && (
        <div className="property-group">
          <label className="property-label">צבע מסגרת עמודות</label>
          <ColorPicker
            value={data.columnBorderColor || '#cccccc'}
            onChange={(value) => handleChange('columnBorderColor', value)}
          />
        </div>
      )}
    </>
  );
};

export default RowStylePanel;