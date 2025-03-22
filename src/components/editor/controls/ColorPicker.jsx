import React, { useState, useRef, useEffect } from 'react';
import { FiCheck, FiChevronDown } from 'react-icons/fi';

const ColorPicker = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '#ffffff');
  const colorPickerRef = useRef(null);

  // צבעים מוגדרים מראש לבחירה מהירה
  const presetColors = [
    '#5271ff', '#47c479', '#ff6b6b', '#ffbe0b', '#fd7e14',
    '#ffffff', '#000000', '#343a40', '#6c757d', '#f8f9fa',
    '#6c63ff', '#00c9a7', '#f53b57', '#3c40c6', '#0fbcf9',
    '#00d1b2', '#ff9f43', '#ee5253', '#0abde3', '#10ac84'
  ];

  // וידוא שהערך הוא צבע hex תקין
  const isValidHex = (color) => {
    return /^#([0-9A-F]{3}){1,2}$/i.test(color);
  };

  // המרת צבע לפורמט hex
  const normalizeColor = (color) => {
    // אם הצבע כבר בפורמט hex
    if (isValidHex(color)) {
      return color;
    }
    
    // אם הצבע בפורמט hex ללא סולמית
    if (/^([0-9A-F]{3}){1,2}$/i.test(color)) {
      return `#${color}`;
    }
    
    // אחרת, מחזירים ברירת מחדל
    return '#ffffff';
  };

  // עדכון ערכי הצבע בשינוי מהמשתמש
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (newValue.length <= 7) {
      setInputValue(newValue);
    }
  };

  // עדכון הצבע בגמר השינוי והודעה לקומפוננטה האב
  const handleInputBlur = () => {
    let newColor = inputValue;
    
    // הוספת סולמית אם חסרה
    if (newColor && !newColor.startsWith('#')) {
      newColor = `#${newColor}`;
    }
    
    // וידוא שהערך תקין (הקסדצימלי)
    if (isValidHex(newColor)) {
      setInputValue(newColor);
      onChange(newColor);
    } else {
      // אם הערך לא תקין, חזרה לערך הקודם
      setInputValue(value);
    }
  };

  // בחירת צבע מוגדר מראש
  const selectPresetColor = (color) => {
    setInputValue(color);
    onChange(color);
  };

  // טיפול במצב שלוחצים מחוץ לבורר הצבעים
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // עדכון ערך הקלט כשהערך משתנה מבחוץ
  useEffect(() => {
    setInputValue(normalizeColor(value || '#ffffff'));
  }, [value]);

  return (
    <div className="property-group">
      {label && <label className="property-label">{label}</label>}
      <div className="color-picker" ref={colorPickerRef}>
        <div className="color-picker-preview-container">
          <div 
            className="color-preview"
            style={{ backgroundColor: inputValue }}
            onClick={() => setIsOpen(!isOpen)}
          ></div>
          
          <input 
            type="text" 
            className="text-input color-text-input"
            value={inputValue} 
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            maxLength={7}
          />
          
          <button 
            className="color-picker-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="פתח בורר צבעים"
          >
            <FiChevronDown className={`toggle-icon ${isOpen ? 'open' : ''}`} />
          </button>
        </div>
        
        {isOpen && (
          <div className="color-popup">
            <div className="color-input-container">
              <input 
                type="color" 
                value={isValidHex(inputValue) ? inputValue : '#ffffff'} 
                onChange={(e) => {
                  const newColor = e.target.value;
                  setInputValue(newColor);
                  onChange(newColor);
                }} 
                className="color-input"
              />
            </div>
            
            <div className="color-presets-container">
              <div className="color-presets-title">צבעים מהירים</div>
              <div className="color-presets">
                {presetColors.map(color => (
                  <div 
                    key={color} 
                    className={`color-preset ${color === inputValue ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => selectPresetColor(color)}
                    title={color}
                  >
                    {color === inputValue && (
                      <FiCheck className="check-icon" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;