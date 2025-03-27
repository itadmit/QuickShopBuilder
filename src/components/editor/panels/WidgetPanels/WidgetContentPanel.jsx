// src/components/editor/panels/WidgetPanels/WidgetContentPanel.jsx
import React from 'react';
import CTAContentPanel from '../ContentPanels/CTAContentPanel';
import IconContentPanel from '../ContentPanels/IconContentPanel';
import ButtonContentPanel from '../ContentPanels/ButtonContentPanel';
import ImageContentPanel from '../ContentPanels/ImageContentPanel';
import TextContentPanel from '../ContentPanels/TextContentPanel';
import VideoContentPanel from '../ContentPanels/VideoContentPanel';

const WidgetContentPanel = ({ widget, onChange }) => {
  if (!widget) {
    return <div>לא נבחר ווידג'ט</div>;
  }

  // הצגת פאנל התוכן המתאים לסוג הווידג'ט
  switch (widget.type) {
    case 'cta':
      return <CTAContentPanel data={widget} onChange={onChange} />;
    case 'icon':
      return <IconContentPanel data={widget} onChange={onChange} />;
    case 'button':
      return <ButtonContentPanel data={widget} onChange={onChange} />;
    case 'image':
      return <ImageContentPanel data={widget} onChange={onChange} />;
    case 'text':
      return <TextContentPanel data={widget} onChange={onChange} />;
    case 'video':
      return <VideoContentPanel data={widget} onChange={onChange} />;
    default:
      return <div>סוג ווידג'ט לא תומך: {widget.type}</div>;
  }
};

export default WidgetContentPanel;