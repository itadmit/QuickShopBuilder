// src/components/editor/panels/WidgetPanels/WidgetStylePanel.jsx
import React from 'react';
import CTAStylePanel from '../StylePanels/CTAStylePanel';
import IconStylePanel from '../StylePanels/IconStylePanel';
import ButtonStylePanel from '../StylePanels/ButtonStylePanel';
import ImageStylePanel from '../StylePanels/ImageStylePanel';
import TextStylePanel from '../StylePanels/TextStylePanel';
import VideoStylePanel from '../StylePanels/VideoStylePanel';

const WidgetStylePanel = ({ widget, onChange }) => {
  if (!widget) {
    return <div>לא נבחר ווידג'ט</div>;
  }

  // הצגת פאנל העיצוב המתאים לסוג הווידג'ט
  switch (widget.type) {
    case 'cta':
      return <CTAStylePanel data={widget} onChange={onChange} />;
    case 'icon':
      return <IconStylePanel data={widget} onChange={onChange} />;
    case 'button':
      return <ButtonStylePanel data={widget} onChange={onChange} />;
    case 'image':
      return <ImageStylePanel data={widget} onChange={onChange} />;
    case 'text':
      return <TextStylePanel data={widget} onChange={onChange} />;
    case 'video':
      return <VideoStylePanel data={widget} onChange={onChange} />;
    default:
      return <div>סוג ווידג'ט לא תומך: {widget.type}</div>;
  }
};

export default WidgetStylePanel;