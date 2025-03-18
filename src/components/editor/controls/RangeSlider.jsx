import React, { useState, useEffect } from 'react';

const RangeSlider = ({ 
  label, 
  min = 0, 
  max = 100, 
  value, 
  onChange, 
  step = 1,
  unit = ''
}) => {
  const [sliderValue, setSliderValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);
  
  // עדכון ערך הסליידר כאשר הערך החיצוני משתנה
  useEffect(() => {
    setSliderValue(value);
  }, [value]);

  // חישוב אחוז מילוי הסליידר
  const calculateFillPercentage = () => {
    return ((sliderValue - min) / (max - min)) * 100;
  };

  // חישוב מיקום הסמן
  const calculateThumbPosition = () => {
    return `${calculateFillPercentage()}%`;
  };

  // טיפול בלחיצה על הסליידר
  const handleTrackClick = (e) => {
    const trackRect = e.currentTarget.getBoundingClientRect();
    const clickPosition = e.clientX - trackRect.left;
    const trackWidth = trackRect.width;
    const percentage = clickPosition / trackWidth;
    const newValue = Math.round(min + percentage * (max - min));
    
    setSliderValue(newValue);
    onChange(newValue);
  };

  // טיפול בהגדלת הערך
  const handleIncrement = () => {
    if (sliderValue < max) {
      const newValue = Math.min(sliderValue + step, max);
      setSliderValue(newValue);
      onChange(newValue);
    }
  };

  // טיפול בהקטנת הערך
  const handleDecrement = () => {
    if (sliderValue > min) {
      const newValue = Math.max(sliderValue - step, min);
      setSliderValue(newValue);
      onChange(newValue);
    }
  };

  // טיפול בשינוי ערך בשדה הטקסט
  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value, 10) || min;
    const clampedValue = Math.max(min, Math.min(max, newValue));
    
    setSliderValue(clampedValue);
    onChange(clampedValue);
  };

  return (
    <div className="margin-control">
      <div className="margin-label">{label}</div>
      
      <div className="slider-container">
        {/* כפתור הפחתה */}
        <button 
          className="minus-button" 
          onClick={handleDecrement}
          disabled={sliderValue <= min}
        >
          −
        </button>
        
        {/* הסליידר עצמו */}
        <div 
          className="slider-track-container"
          onClick={handleTrackClick}
        >
          <div className="slider-track"></div>
          <div 
            className="slider-fill" 
            style={{ width: calculateFillPercentage() + '%' }}
          ></div>
          <div 
            className="slider-thumb"
            style={{ left: calculateThumbPosition() }}
          ></div>
        </div>
        
        {/* כפתור הגדלה */}
        <button 
          className="plus-button" 
          onClick={handleIncrement}
          disabled={sliderValue >= max}
        >
          +
        </button>
      </div>
      
      {/* שדה הזנת ערך */}
      <div className="slider-control-row">
        <input
          type="text"
          className="value-input"
          value={sliderValue}
          onChange={handleInputChange}
          onBlur={() => {
            // וידוא שהערך בטווח המותר בעת עזיבת השדה
            const clampedValue = Math.max(min, Math.min(max, sliderValue));
            setSliderValue(clampedValue);
            onChange(clampedValue);
          }}
        />
      </div>
    </div>
  );
};

export default RangeSlider;