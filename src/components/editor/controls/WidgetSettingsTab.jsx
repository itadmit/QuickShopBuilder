// src/components/editor/controls/WidgetSettingsTab.jsx
import React from 'react';
import { FiMonitor, FiTablet, FiSmartphone } from 'react-icons/fi';
import Checkbox from './Checkbox';

// קומפוננט להגדרות אחידות לכל סוגי הווידג'טים
const WidgetSettingsTab = ({ widgetData, onUpdate, onDelete, supportedOptions = {} }) => {
  // הגדרות ברירת מחדל של האפשרויות הנתמכות
  const options = {
    showIdentifiers: true,  // האם להציג שדות זיהוי
    showDeviceVisibility: true,  // האם להציג הגדרות מכשירים
    showSpacing: true,  // האם להציג הגדרות מרווחים
    showAnimation: true,  // האם להציג הגדרות אנימציה
    showActions: true,  // האם להציג כפתורי פעולות
    ...supportedOptions
  };

  // פונקציה לעדכון שדה בודד
  const handleChange = (field, value) => {
    onUpdate({
      ...widgetData,
      [field]: value
    });
  };

  // פונקציה לעדכון שדות מרובים בבת אחת
  const handleMultipleChanges = (updates) => {
    onUpdate({
      ...widgetData,
      ...updates
    });
  };

  // פונקציה להסרת יחידת מידה מערך להצגה בקלט
  const removeUnit = (value) => {
    if (!value) return '';
    if (typeof value === 'number') return value.toString();
    return String(value).replace(/px|%|em|rem|vh|vw/g, '');
  };
  
  // פונקציה להוספת יחידת מידה בעת עדכון
  const addUnitIfNeeded = (value) => {
    if (!value) return '';
    if (typeof value === 'number') return `${value}px`;
    if (String(value).match(/^[0-9]+$/)) return `${value}px`;
    
    // אם יש כבר יחידת מידה, לא מוסיפים
    if (String(value).match(/px|%|em|rem|vh|vw/)) return value;
    
    return `${value}px`;
  };

  // רנדור חלק הזיהוי
  const renderIdentifiers = () => {
    if (!options.showIdentifiers) return null;
    
    return (
      <>
        <div className="property-group-title">זיהוי</div>
        <div className="property-group">
          <label className="property-label">מזהה CSS מותאם אישית (ID)</label>
          <input
            type="text"
            className="text-input"
            value={widgetData.customId || ''}
            onChange={(e) => handleChange('customId', e.target.value)}
            placeholder="section-1"
          />
        </div>
        
        <div className="property-group">
          <label className="property-label">מחלקת CSS מותאמת אישית (Class)</label>
          <input
            type="text"
            className="text-input"
            value={widgetData.customClass || ''}
            onChange={(e) => handleChange('customClass', e.target.value)}
            placeholder="my-custom-class"
          />
        </div>
      </>
    );
  };

  // רנדור חלק נראות במכשירים
  const renderDeviceVisibility = () => {
    if (!options.showDeviceVisibility) return null;
    
    return (
      <>
        <div className="property-group-title">נראות במכשירים</div>
        <div className="device-visibility-controls">
          <div className="device-option">
            <Checkbox
              label={
                <>
                  <FiMonitor size={16} style={{ marginLeft: '5px' }} />
                  הצג במחשב
                </>
              }
              checked={widgetData.showOnDesktop !== false}
              onChange={(checked) => handleChange('showOnDesktop', checked)}
            />
          </div>
          
          <div className="device-option">
            <Checkbox
              label={
                <>
                  <FiTablet size={16} style={{ marginLeft: '5px' }} />
                  הצג בטאבלט
                </>
              }
              checked={widgetData.showOnTablet !== false}
              onChange={(checked) => handleChange('showOnTablet', checked)}
            />
          </div>
          
          <div className="device-option">
            <Checkbox
              label={
                <>
                  <FiSmartphone size={16} style={{ marginLeft: '5px' }} />
                  הצג במובייל
                </>
              }
              checked={widgetData.showOnMobile !== false}
              onChange={(checked) => handleChange('showOnMobile', checked)}
            />
          </div>
        </div>
      </>
    );
  };

  // רנדור חלק מרווחים
  const renderSpacing = () => {
    if (!options.showSpacing) return null;
    
    return (
      <>
        <div className="property-group-title">מרווחים</div>
        
        <div className="spacing-container">
          <h4>מרג'ין</h4>
          <div className="spacing-controls">
            <div className="spacing-row">
              <div className="spacing-field">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="spacing-input"
                  value={removeUnit(widgetData.marginTop || '')}
                  onChange={(e) => handleChange('marginTop', addUnitIfNeeded(e.target.value))}
                  placeholder="0"
                />
                <label>למעלה</label>
              </div>
              
              <div className="spacing-field">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="spacing-input"
                  value={removeUnit(widgetData.marginRight || '')}
                  onChange={(e) => handleChange('marginRight', addUnitIfNeeded(e.target.value))}
                  placeholder="0"
                />
                <label>ימין</label>
              </div>
              
              <div className="spacing-field">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="spacing-input"
                  value={removeUnit(widgetData.marginBottom || '')}
                  onChange={(e) => handleChange('marginBottom', addUnitIfNeeded(e.target.value))}
                  placeholder="0"
                />
                <label>למטה</label>
              </div>
              
              <div className="spacing-field">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="spacing-input"
                  value={removeUnit(widgetData.marginLeft || '')}
                  onChange={(e) => handleChange('marginLeft', addUnitIfNeeded(e.target.value))}
                  placeholder="0"
                />
                <label>שמאל</label>
              </div>
            </div>
          </div>
          
          <h4>פדינג</h4>
          <div className="spacing-controls">
            <div className="spacing-row">
              <div className="spacing-field">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="spacing-input"
                  value={removeUnit(widgetData.paddingTop || '')}
                  onChange={(e) => handleChange('paddingTop', addUnitIfNeeded(e.target.value))}
                  placeholder="0"
                />
                <label>למעלה</label>
              </div>
              
              <div className="spacing-field">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*" 
                  className="spacing-input"
                  value={removeUnit(widgetData.paddingRight || '')}
                  onChange={(e) => handleChange('paddingRight', addUnitIfNeeded(e.target.value))}
                  placeholder="0"
                />
                <label>ימין</label>
              </div>
              
              <div className="spacing-field">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="spacing-input"
                  value={removeUnit(widgetData.paddingBottom || '')}
                  onChange={(e) => handleChange('paddingBottom', addUnitIfNeeded(e.target.value))}
                  placeholder="0"
                />
                <label>למטה</label>
              </div>
              
              <div className="spacing-field">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="spacing-input"
                  value={removeUnit(widgetData.paddingLeft || '')}
                  onChange={(e) => handleChange('paddingLeft', addUnitIfNeeded(e.target.value))}
                  placeholder="0"
                />
                <label>שמאל</label>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // רנדור חלק אנימציה
  const renderAnimation = () => {
    if (!options.showAnimation) return null;
    
    const animationOptions = [
      { value: '', label: 'ללא' },
      { value: 'fadeIn', label: 'הופעה הדרגתית' },
      { value: 'slideInRight', label: 'כניסה מימין' },
      { value: 'slideInLeft', label: 'כניסה משמאל' },
      { value: 'slideInUp', label: 'כניסה מלמטה' },
      { value: 'slideInDown', label: 'כניסה מלמעלה' },
      { value: 'zoomIn', label: 'התקרבות' },
      { value: 'bounce', label: 'קפיצה' },
      { value: 'pulse', label: 'פעימה' }
    ];
    
    return (
      <>
        <div className="property-group-title">אנימציה</div>
        
        <div className="property-group">
          <label className="property-label">אנימציה</label>
          <select
            className="select-input"
            value={widgetData.animation || ''}
            onChange={(e) => handleChange('animation', e.target.value)}
          >
            {animationOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {widgetData.animation && (
          <>
            <div className="property-group">
              <label className="property-label">משך (שניות)</label>
              <input
                type="number"
                min="0.1"
                max="5"
                step="0.1"
                className="number-input"
                value={widgetData.animationDuration || 0.5}
                onChange={(e) => handleChange('animationDuration', parseFloat(e.target.value))}
              />
            </div>
            
            <div className="property-group">
              <label className="property-label">השהייה (שניות)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                className="number-input"
                value={widgetData.animationDelay || 0}
                onChange={(e) => handleChange('animationDelay', parseFloat(e.target.value))}
              />
            </div>
          </>
        )}
      </>
    );
  };

  // רנדור כפתורי פעולות
  const renderActions = () => {
    if (!options.showActions) return null;
    
    return (
      <div className="property-actions">
        <button 
          className="delete-button"
          onClick={() => {
            // שימוש ב-window.confirm במקום confirm הרגיל
            if (window.confirm('האם אתה בטוח שברצונך למחוק אלמנט זה?')) {
              // קריאה לפונקציית onDelete רק אם היא קיימת
              if (typeof onDelete === 'function') {
                onDelete(widgetData.id);
              }
            }
          }}
        >
          מחק וידג'ט
        </button>
      </div>
    );
  };

  return (
    <div className="widget-settings-tab">
      {renderIdentifiers()}
      {renderDeviceVisibility()}
      {renderSpacing()}
      {renderAnimation()}
      {renderActions()}
    </div>
  );
};

export default WidgetSettingsTab;