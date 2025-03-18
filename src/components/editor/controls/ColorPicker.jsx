import React, { useState, useRef, useEffect } from 'react';
import { FiCheckCircle } from 'react-icons/fi';

const ColorPicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '#ffffff');
  const colorPickerRef = useRef(null);

  // צבעים מוגדרים מראש לבחירה מהירה
  const presetColors = [
    '#5271ff', '#47c479', '#ff6b6b', '#ffbe0b', '#fd7e14',
    '#ffffff', '#000000', '#343a40', '#6c757d', '#f8f9fa'
  ];

  // עדכון ערכי הצבע בשינוי מהמשתמש
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // עדכון הצבע בגמר השינוי והודעה לקומפוננטה האב
  const handleInputBlur = () => {
    // וידוא שהערך תקין (הקסדצימלי)
    if (/^#([0-9A-F]{3}){1,2}$/i.test(inputValue)) {
      onChange(inputValue);
    } else {
      // אם הערך לא תקין, חזרה לערך הקודם
      setInputValue(value);
    }
  };

  // בחירת צבע מוגדר מראש
  const selectPresetColor = (color) => {
    setInputValue(color);
    onChange(color);
    setIsOpen(false);
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
    setInputValue(value);
  }, [value]);

  return (
    <div className="color-picker" ref={colorPickerRef}>
      <div 
        className="color-preview"
        style={{ backgroundColor: inputValue }}
        onClick={() => setIsOpen(!isOpen)}
      ></div>
      
      <input 
        type="text" 
        className="text-input"
        value={inputValue} 
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        maxLength={7}
      />
      
      {isOpen && (
        <div className="color-popup">
          <input 
            type="color" 
            value={inputValue} 
            onChange={(e) => {
              setInputValue(e.target.value);
              onChange(e.target.value);
            }} 
            className="color-input"
          />
          
          <div className="color-presets">
            {presetColors.map(color => (
              <div 
                key={color} 
                className={`color-preset ${color === inputValue ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => selectPresetColor(color)}
              >
                {color === inputValue && (
                  <FiCheckCircle className="check-icon" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;