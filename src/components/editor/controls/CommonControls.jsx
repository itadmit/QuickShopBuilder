import React from 'react';
import RangeSlider from './RangeSlider';
import ColorPicker from './ColorPicker';
import SwitchControl from './SwitchControl';
import Checkbox from './Checkbox';  // הוספת ייבוא של קומפוננט הצ'קבוקס
import { FiMonitor, FiTablet, FiSmartphone } from 'react-icons/fi';  // ייבוא של אייקונים

// Component for spacing control (margin/padding)
export const SpacingControl = ({ type, values, onChange }) => {
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

  const handleChange = (position, value) => {
    const newValues = { ...values };
    newValues[position] = addUnitIfNeeded(value);
    onChange(newValues);
  };

  return (
    <div className="spacing-control">
      <div className="spacing-label">{type === 'margin' ? 'מרג\'ין' : 'פדינג'}</div>
      <div className="spacing-inputs">
        <div className="spacing-row">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="spacing-input"
            value={removeUnit(values.top || '')}
            onChange={(e) => handleChange('top', e.target.value)}
            placeholder="0"
          />
          <span className="spacing-label">למעלה</span>
        </div>
        <div className="spacing-row">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="spacing-input"
            value={removeUnit(values.right || '')}
            onChange={(e) => handleChange('right', e.target.value)}
            placeholder="0"
          />
          <span className="spacing-label">ימין</span>
        </div>
        <div className="spacing-row">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="spacing-input"
            value={removeUnit(values.bottom || '')}
            onChange={(e) => handleChange('bottom', e.target.value)}
            placeholder="0"
          />
          <span className="spacing-label">למטה</span>
        </div>
        <div className="spacing-row">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="spacing-input"
            value={removeUnit(values.left || '')}
            onChange={(e) => handleChange('left', e.target.value)}
            placeholder="0"
          />
          <span className="spacing-label">שמאל</span>
        </div>
      </div>
    </div>
  );
};


// Component for device visibility settings
export const DeviceVisibilityControl = ({ values, onChange }) => {
  return (
    <div className="device-visibility">
      <Checkbox
        label={
          <>
            <FiMonitor size={16} style={{ marginLeft: '5px' }} />
            הצג במחשב
          </>
        }
        checked={values.showOnDesktop !== false}
        onChange={(checked) => onChange({...values, showOnDesktop: checked})}
      />
      <Checkbox
        label={
          <>
            <FiTablet size={16} style={{ marginLeft: '5px' }} />
            הצג בטאבלט
          </>
        }
        checked={values.showOnTablet !== false}
        onChange={(checked) => onChange({...values, showOnTablet: checked})}
      />
      <Checkbox
        label={
          <>
            <FiSmartphone size={16} style={{ marginLeft: '5px' }} />
            הצג במובייל
          </>
        }
        checked={values.showOnMobile !== false}
        onChange={(checked) => onChange({...values, showOnMobile: checked})}
      />
    </div>
  );
};

// Component for custom ID and class settings
export const CustomIdentifiers = ({ customId, customClass, onChange }) => {
  return (
    <div className="custom-identifiers">
      <div className="property-group">
        <label className="property-label">מזהה CSS מותאם אישית (ID)</label>
        <input
          type="text"
          className="text-input"
          value={customId || ''}
          onChange={(e) => onChange('customId', e.target.value)}
          placeholder="section-1"
        />
      </div>
      <div className="property-group">
        <label className="property-label">מחלקת CSS מותאמת אישית (Class)</label>
        <input
          type="text"
          className="text-input"
          value={customClass || ''}
          onChange={(e) => onChange('customClass', e.target.value)}
          placeholder="my-custom-class"
        />
      </div>
    </div>
  );
};

// Component for animation settings
export const AnimationControl = ({ animation, duration, delay, onChange }) => {
  return (
    <div className="animation-control">
      <div className="property-group">
        <label className="property-label">אנימציה</label>
        <select
          className="select-input"
          value={animation || 'none'}
          onChange={(e) => onChange('animation', e.target.value)}
        >
          <option value="none">ללא</option>
          <option value="fade">Fade In</option>
          <option value="slideUp">Slide Up</option>
          <option value="slideDown">Slide Down</option>
          <option value="zoomIn">Zoom In</option>
        </select>
      </div>
      
      {animation && animation !== 'none' && (
        <>
          <div className="property-group">
            <label className="property-label">משך (שניות)</label>
            <RangeSlider
              min={0.1}
              max={3}
              step={0.1}
              value={duration || 0.5}
              onChange={(value) => onChange('animationDuration', value)}
            />
          </div>
          <div className="property-group">
            <label className="property-label">השהייה (שניות)</label>
            <RangeSlider
              min={0}
              max={2}
              step={0.1}
              value={delay || 0}
              onChange={(value) => onChange('animationDelay', value)}
            />
          </div>
        </>
      )}
    </div>
  );
};

// Component for typography settings
// Component for typography settings
export const TypographyControl = ({ values = {}, onChange, title = "טיפוגרפיה", showAllOptions = true }) => {
  const {
    fontFamily = "'Noto Sans Hebrew', sans-serif",
    fontSize = 16,
    fontWeight = "normal",
    fontStyle = "normal",
    textDecoration = "none",
    textTransform = "none",
    lineHeight = 1.5,
    letterSpacing = 0
  } = values;

  // Hebrew font options (10 fonts)
  const hebrewFonts = [
    { value: "'Noto Sans Hebrew', sans-serif", label: "נוטו סאנס" },
    { value: "'Open Sans Hebrew', sans-serif", label: "אופן סאנס" },
    { value: "'Heebo', sans-serif", label: "היבו" },
    { value: "'Rubik', sans-serif", label: "רוביק" },
    { value: "'Alef', sans-serif", label: "אלף" },
    { value: "'Assistant', sans-serif", label: "אסיסטנט" },
    { value: "'Varela Round', sans-serif", label: "ורלה ראונד" },
    { value: "'Secular One', sans-serif", label: "סקולר וואן" },
    { value: "'David Libre', serif", label: "דוד" },
    { value: "'Frank Ruhl Libre', serif", label: "פרנק רול" }
  ];
  
  // English font options (5 fonts)
  const englishFonts = [
    { value: "'Roboto', sans-serif", label: "Roboto" },
    { value: "'Montserrat', sans-serif", label: "Montserrat" },
    { value: "'Lato', sans-serif", label: "Lato" },
    { value: "'Poppins', sans-serif", label: "Poppins" },
    { value: "'Playfair Display', serif", label: "Playfair Display" }
  ];

  // Combine all font options with categories
  const fontOptions = [
    { label: "פונטים בעברית", options: hebrewFonts },
    { label: "פונטים באנגלית", options: englishFonts }
  ];

  // Font weight options
  const weightOptions = [
    { value: "100", label: "100 דק מאוד" },
    { value: "200", label: "200 דק" },
    { value: "300", label: "300 רזה" },
    { value: "normal", label: "400 רגיל" },
    { value: "500", label: "500 בינוני" },
    { value: "600", label: "600 עבה" },
    { value: "bold", label: "700 מודגש" },
    { value: "800", label: "800 שמן" },
    { value: "900", label: "900 שמן מאוד" }
  ];

  // Capitalization options (for latin support)
  const textTransformOptions = [
    { value: "none", label: "רגיל" },
    { value: "capitalize", label: "אות גדולה בתחילת מילה" },
    { value: "uppercase", label: "אותיות גדולות" },
    { value: "lowercase", label: "אותיות קטנות" }
  ];

  // Font style options
  const fontStyleOptions = [
    { value: "normal", label: "רגיל" },
    { value: "italic", label: "נטוי" }
  ];

  // Text decoration options
  const textDecorationOptions = [
    { value: "none", label: "ללא" },
    { value: "underline", label: "קו תחתון" },
    { value: "line-through", label: "קו חוצה" },
    { value: "overline", label: "קו עליון" }
  ];

  const handleChange = (property, value) => {
    onChange({ ...values, [property]: value });
  };

  // Find font category and name
  const getFontCategoryAndName = (fontFamily) => {
    for (const category of fontOptions) {
      for (const font of category.options) {
        if (font.value === fontFamily) {
          return { category: category.label, name: font.label };
        }
      }
    }
    // Default if not found
    return { category: "פונטים בעברית", name: "פונט" };
  };

  const { category, name } = getFontCategoryAndName(fontFamily);

  return (
    <div className="typography-control">
      {title && <div className="property-group-title">{title}</div>}
      
      <div className="property-group">
        <label className="property-label">פונט</label>
        <select
          className="select-input font-select"
          value={fontFamily}
          onChange={(e) => handleChange('fontFamily', e.target.value)}
          style={{ fontFamily }}
        >
          {fontOptions.map((category) => (
            <optgroup key={category.label} label={category.label}>
              {category.options.map((font) => (
                <option 
                  key={font.value} 
                  value={font.value}
                  style={{ fontFamily: font.value }}
                >
                  {font.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="typography-row">
        <div className="property-group half">
          <label className="property-label">גודל פונט</label>
          <div className="input-with-unit">
            <input
              type="number"
              className="text-input"
              value={fontSize}
              onChange={(e) => handleChange('fontSize', parseFloat(e.target.value) || fontSize)}
              min={8}
              max={100}
            />
            <span className="unit">px</span>
          </div>
        </div>
        
        <div className="property-group half">
          <label className="property-label">עובי פונט</label>
          <select
            className="select-input"
            value={fontWeight}
            onChange={(e) => handleChange('fontWeight', e.target.value)}
          >
            {weightOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showAllOptions && (
        <>
          <div className="typography-row">
            <div className="property-group half">
              <label className="property-label">סגנון</label>
              <select
                className="select-input"
                value={fontStyle}
                onChange={(e) => handleChange('fontStyle', e.target.value)}
              >
                {fontStyleOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="property-group half">
              <label className="property-label">קישוט</label>
              <select
                className="select-input"
                value={textDecoration}
                onChange={(e) => handleChange('textDecoration', e.target.value)}
              >
                {textDecorationOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="typography-row">
            <div className="property-group half">
              <label className="property-label">גובה שורה</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  className="text-input"
                  value={lineHeight}
                  onChange={(e) => handleChange('lineHeight', parseFloat(e.target.value) || lineHeight)}
                  min={1}
                  max={3}
                  step={0.1}
                />
                <span className="unit">em</span>
              </div>
            </div>
            
            <div className="property-group half">
              <label className="property-label">ריווח אותיות</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  className="text-input"
                  value={letterSpacing}
                  onChange={(e) => handleChange('letterSpacing', parseFloat(e.target.value) || letterSpacing)}
                  min={-5}
                  max={10}
                  step={0.1}
                />
                <span className="unit">px</span>
              </div>
            </div>
          </div>

          <div className="property-group">
            <label className="property-label">רישיות (לטינית)</label>
            <select
              className="select-input"
              value={textTransform}
              onChange={(e) => handleChange('textTransform', e.target.value)}
            >
              {textTransformOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <div className="typography-preview" style={{
        fontFamily,
        fontSize: `${fontSize}px`,
        fontWeight,
        fontStyle,
        textDecoration,
        textTransform,
        lineHeight,
        letterSpacing: `${letterSpacing}px`,
      }}>
        <div className="preview-text-hebrew">אבגדהוזחטיכלמנסעפצקרשת</div>
        <div className="preview-text-english">ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
      </div>
    </div>
  );
};