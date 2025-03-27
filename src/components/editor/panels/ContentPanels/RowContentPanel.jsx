// src/components/editor/panels/ContentPanels/RowContentPanel.jsx
import React from 'react';
import SelectControl from '../../controls/SelectControl';
import RangeSlider from '../../controls/RangeSlider';
import SwitchControl from '../../controls/SwitchControl';

const RowContentPanel = ({ data, onChange }) => {
  // פונקציה להחלפת מאפיין
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  // עדכון של מערך עמודות
  const updateColumnWidths = (columnsCount) => {
    // יצירת מערך רוחבים שווים עבור מספר העמודות החדש
    const equalWidth = 100 / columnsCount;
    const newColumnWidths = Array(columnsCount).fill(equalWidth);
    
    // אם יש כבר מערך רוחבים, נשמור את הערכים הקיימים עד כמה שאפשר
    if (data.columnWidths && Array.isArray(data.columnWidths)) {
      for (let i = 0; i < Math.min(columnsCount, data.columnWidths.length); i++) {
        newColumnWidths[i] = data.columnWidths[i];
      }
    }
    
    // עדכון הרוחבים באובייקט הנתונים
    handleChange('columnWidths', newColumnWidths);
    
    // אם יש צורך, עדכון גם את התוכן של העמודות
    if (data.columnsContent) {
      let newColumnsContent = [...data.columnsContent];
      
      // נוודא שיש מספיק עמודות
      while (newColumnsContent.length < columnsCount) {
        newColumnsContent.push({ widgets: [] });
      }
      
      // אם יש יותר מדי עמודות, נקצר את המערך
      if (newColumnsContent.length > columnsCount) {
        newColumnsContent = newColumnsContent.slice(0, columnsCount);
      }
      
      handleChange('columnsContent', newColumnsContent);
    }
  };

  return (
    <>
      <div className="property-group-title">הגדרות כלליות</div>
      <div className="property-group">
        <label className="property-label">סוג רוחב שורה</label>
        <SelectControl
          options={[
            { value: 'full', label: 'מלא (100%)' },
            { value: 'container', label: 'מיכל (1000px)' },
            { value: 'custom', label: 'מותאם אישית' }
          ]}
          value={data.rowWidthType || 'full'}
          onChange={(value) => handleChange('rowWidthType', value)}
        />
      </div>
      
      {data.rowWidthType === 'custom' && (
        <div className="property-group">
          <label className="property-label">רוחב מותאם אישית (פיקסלים)</label>
          <RangeSlider
            min={500}
            max={1920}
            step={10}
            value={data.rowCustomWidth || 1000}
            onChange={(value) => handleChange('rowCustomWidth', value)}
          />
        </div>
      )}
      
      <div className="property-group-title">עמודות</div>
      <div className="property-group">
        <label className="property-label">מספר עמודות</label>
        <RangeSlider
          min={1}
          max={6}
          value={data.columns || 2}
          onChange={(value) => {
            handleChange('columns', value);
            updateColumnWidths(value);
          }}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">מרווח בין עמודות</label>
        <RangeSlider
          min={0}
          max={50}
          value={data.columnGap || 20}
          onChange={(value) => handleChange('columnGap', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">תצוגה רספונסיבית</label>
        <SwitchControl
          checked={data.columnsResponsive !== false}
          onChange={(checked) => handleChange('columnsResponsive', checked)}
        />
      </div>
      
      {data.columnsResponsive !== false && (
        <>
          <div className="property-group">
            <label className="property-label">עמודות בטאבלט</label>
            <RangeSlider
              min={1}
              max={Math.min(4, data.columns || 2)}
              value={data.tabletColumns || Math.min(2, data.columns || 2)}
              onChange={(value) => handleChange('tabletColumns', value)}
            />
          </div>
          <div className="property-group">
            <label className="property-label">עמודות בנייד</label>
            <RangeSlider
              min={1}
              max={2}
              value={data.mobileColumns || 1}
              onChange={(value) => handleChange('mobileColumns', value)}
            />
          </div>
        </>
      )}
      
      <div className="property-group-title">עיצוב עמודות</div>
      <div className="property-group">
        <label className="property-label">עיצוב רוחב עמודות</label>
        <SelectControl
          options={[
            { value: 'equal', label: 'רוחב שווה' },
            { value: 'custom', label: 'רוחבים מותאמים אישית' },
            { value: 'auto', label: 'אוטומטי (לפי תוכן)' }
          ]}
          value={data.columnsLayout || 'equal'}
          onChange={(value) => handleChange('columnsLayout', value)}
        />
      </div>
      
      {data.columnsLayout === 'custom' && data.columnWidths && Array.isArray(data.columnWidths) && (
        <div className="property-group">
          <label className="property-label">רוחבי עמודות (%)</label>
          {data.columnWidths.map((width, index) => (
            <div key={index} className="column-width-control">
              <label className="property-label">עמודה {index + 1}</label>
              <RangeSlider
                min={10}
                max={100}
                value={width}
                onChange={(value) => {
                  const newWidths = [...data.columnWidths];
                  newWidths[index] = value;
                  handleChange('columnWidths', newWidths);
                }}
              />
              <span className="width-value">{width}%</span>
            </div>
          ))}
          <p className="helper-text">שים לב: סכום הרוחבים צריך להיות 100%</p>
        </div>
      )}
      
      <div className="property-group">
        <label className="property-label">צבע רקע עמודות</label>
        <input
          type="color"
          className="color-input"
          value={data.columnBackgroundColor || 'rgba(248, 249, 251, 0.7)'}
          onChange={(e) => handleChange('columnBackgroundColor', e.target.value)}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={parseFloat(data.columnBackgroundColor?.split(',')[3] || '0.7') * 100}
          onChange={(e) => {
            const opacity = e.target.value / 100;
            const color = data.columnBackgroundColor || 'rgba(248, 249, 251, 0.7)';
            const rgbPart = color.substring(0, color.lastIndexOf(','));
            handleChange('columnBackgroundColor', `${rgbPart}, ${opacity})`);
          }}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">עובי מסגרת עמודות</label>
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
          <input
            type="color"
            className="color-input"
            value={data.columnBorderColor || '#cccccc'}
            onChange={(e) => handleChange('columnBorderColor', e.target.value)}
          />
        </div>
      )}
    </>
  );
};

export default RowContentPanel;