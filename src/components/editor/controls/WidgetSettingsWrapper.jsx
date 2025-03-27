// src/components/editor/controls/WidgetSettingsWrapper.jsx
import React from 'react';
import WidgetSettingsTab from './WidgetSettingsTab';

/**
 * רכיב מעטפת להגדרות עבור ווידג'טים שונים
 * מאפשר להתאים את ההגדרות לפי סוג הווידג'ט
 */
const WidgetSettingsWrapper = ({ widgetType, widgetData, onUpdate, onDelete }) => {
  // הגדרת האפשרויות הנתמכות לפי סוג הווידג'ט
  const getSupportedOptions = () => {
    const commonOptions = {
      showIdentifiers: true,
      showDeviceVisibility: true,
      showSpacing: true,
      showAnimation: true,
      showActions: true
    };

    // התאמת האפשרויות לפי סוג הווידג'ט
    switch (widgetType) {
      case 'button':
        return {
          ...commonOptions,
          // אפשר להוסיף או להסיר אפשרויות לפי הצורך
        };
      
      case 'image':
        return {
          ...commonOptions,
          // אפשר להוסיף או להסיר אפשרויות לפי הצורך
        };
      
      case 'text':
        return {
          ...commonOptions,
          // אפשר להוסיף או להסיר אפשרויות לפי הצורך
        };
      
      case 'video':
        return {
          ...commonOptions,
          // אפשר להוסיף או להסיר אפשרויות לפי הצורך
        };
      
      case 'hero':
      case 'banner':
      case 'products':
      case 'testimonials':
      case 'collections':
      case 'newsletter':
      case 'text-image':
        return commonOptions;
        
      default:
        return commonOptions;
    }
  };

  return (
    <WidgetSettingsTab
      widgetData={widgetData}
      onUpdate={onUpdate}
      onDelete={onDelete} // העברת פונקציית המחיקה
      supportedOptions={getSupportedOptions()}
    />
  );
};

export default WidgetSettingsWrapper;