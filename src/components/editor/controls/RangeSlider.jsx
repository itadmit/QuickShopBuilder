// RangeSlider.jsx
import React, { useState, useEffect } from 'react';

const RangeSlider = ({ 
  label, 
  min = 0, 
  max = 100, 
  value, 
  onChange, 
  step = 1
}) => {
  const [sliderValue, setSliderValue] = useState(value);

  useEffect(() => {
    setSliderValue(value);
  }, [value]);

  const calculateFillPercentage = () => {
    return ((sliderValue - min) / (max - min)) * 100;
  };

  const calculateThumbPosition = () => {
    return `${calculateFillPercentage()}%`;
  };

  const handleTrackClick = (e) => {
    const trackRect = e.currentTarget.getBoundingClientRect();
    const clickPosition = e.clientX - trackRect.left;
    const trackWidth = trackRect.width;
    const percentage = clickPosition / trackWidth;
    const newValue = Math.round(min + percentage * (max - min));
    
    setSliderValue(newValue);
    onChange(newValue);
  };

  const handleIncrement = () => {
    if (sliderValue < max) {
      const newValue = Math.min(sliderValue + step, max);
      setSliderValue(newValue);
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    if (sliderValue > min) {
      const newValue = Math.max(sliderValue - step, min);
      setSliderValue(newValue);
      onChange(newValue);
    }
  };

  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value, 10) || min;
    const clampedValue = Math.max(min, Math.min(max, newValue));
    
    setSliderValue(clampedValue);
    onChange(clampedValue);
  };

  return (
    <div className="range-slider">
      {label && <div className="range-slider-label">{label}</div>}

      <div className="range-slider-wrapper">
        <button 
          className="range-slider-button range-slider-button-decrement" 
          onClick={handleDecrement}
          disabled={sliderValue <= min}
        >
          −
        </button>
        
        <div 
          className="range-slider-track-container"
          onClick={handleTrackClick}
        >
          <div className="range-slider-track"></div>
          <div 
            className="range-slider-fill" 
            style={{ width: calculateFillPercentage() + '%' }}
          ></div>
          <div 
            className="range-slider-thumb"
            style={{ left: calculateThumbPosition() }}
          ></div>
        </div>
        
        <button 
          className="range-slider-button range-slider-button-increment" 
          onClick={handleIncrement}
          disabled={sliderValue >= max}
        >
          +
        </button>
      </div>
      
      <div className="range-slider-input-row">
        <input
          type="text"
          className="range-slider-value-input"
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
