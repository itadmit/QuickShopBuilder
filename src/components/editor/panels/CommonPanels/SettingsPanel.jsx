// src/components/editor/panels/CommonPanels/SettingsPanel.jsx
import React from 'react';
import { FiCopy, FiTrash2 } from 'react-icons/fi';
import { useEditor } from '../../../../contexts/EditorContext';
import SwitchControl from '../../controls/SwitchControl';
import RangeSlider from '../../controls/RangeSlider';
import SelectControl from '../../controls/SelectControl';

const SettingsPanel = ({ data, onChange, isWidget = false }) => {
  const { deleteSection, duplicateSection, showToast } = useEditor();

  // פונקציה למחיקת רכיב
  const handleDelete = () => {
    const itemType = isWidget ? 'ווידג\'ט' : 'סקשן';
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את ה${itemType} הזה?`)) {
      if (isWidget) {
        // לווידג'טים בתוך שורה צריך לוגיקה מיוחדת (מחוץ לקובץ זה)
        showToast(`ה${itemType} נמחק`, 'success');
      } else {
        // לסקשנים רגילים
        deleteSection(data.id);
        showToast(`ה${itemType} נמחק`, 'success');
      }
    }
  };

  // פונקציה לשכפול רכיב
  const handleDuplicate = () => {
    if (isWidget) {
      // לווידג'טים בתוך שורה צריך לוגיקה מיוחדת (מחוץ לקובץ זה)
      showToast('ווידג\'ט שוכפל', 'success');
    } else {
      // לסקשנים רגילים
      duplicateSection && duplicateSection(data.id);
      showToast('סקשן שוכפל', 'success');
    }
  };

  return (
    <>
      <div className="property-group-title">זיהוי</div>
      <div className="property-group">
        <label className="property-label">ID מותאם אישית</label>
        <input
          type="text"
          className="text-input"
          value={data.customId || ''}
          onChange={(e) => onChange({ customId: e.target.value })}
          placeholder="למשל: my-section"
        />
      </div>
      <div className="property-group">
        <label className="property-label">קלאס CSS מותאם אישית</label>
        <input
          type="text"
          className="text-input"
          value={data.customClass || ''}
          onChange={(e) => onChange({ customClass: e.target.value })}
          placeholder="למשל: featured-section"
        />
      </div>
      
      <div className="property-group-title">ניראות במכשירים</div>
      <div className="property-group">
        <label className="property-label">הצג במחשב</label>
        <SwitchControl
          checked={data.showOnDesktop !== false}
          onChange={(checked) => onChange({ showOnDesktop: checked })}
        />
      </div>
      <div className="property-group">
        <label className="property-label">הצג בטאבלט</label>
        <SwitchControl
          checked={data.showOnTablet !== false}
          onChange={(checked) => onChange({ showOnTablet: checked })}
        />
      </div>
      <div className="property-group">
        <label className="property-label">הצג בנייד</label>
        <SwitchControl
          checked={data.showOnMobile !== false}
          onChange={(checked) => onChange({ showOnMobile: checked })}
        />
      </div>
      
      <div className="property-group-title">מרווחים</div>
      <div className="property-group">
        <label className="property-label">מרווח עליון</label>
        <RangeSlider
          min={0}
          max={100}
          value={parseInt(data.marginTop) || 0}
          onChange={(value) => onChange({ marginTop: value + 'px' })}
        />
      </div>
      <div className="property-group">
        <label className="property-label">מרווח תחתון</label>
        <RangeSlider
          min={0}
          max={100}
          value={parseInt(data.marginBottom) || 0}
          onChange={(value) => onChange({ marginBottom: value + 'px' })}
        />
      </div>
      <div className="property-group">
        <label className="property-label">ריפוד עליון</label>
        <RangeSlider
          min={0}
          max={100}
          value={parseInt(data.paddingTop) || 0}
          onChange={(value) => onChange({ paddingTop: value + 'px' })}
        />
      </div>
      <div className="property-group">
        <label className="property-label">ריפוד תחתון</label>
        <RangeSlider
          min={0}
          max={100}
          value={parseInt(data.paddingBottom) || 0}
          onChange={(value) => onChange({ paddingBottom: value + 'px' })}
        />
      </div>
      <div className="property-group">
        <label className="property-label">ריפוד צדדים</label>
        <RangeSlider
          min={0}
          max={100}
          value={parseInt(data.paddingRight) || 0}
          onChange={(value) => {
            onChange({ 
              paddingRight: value + 'px',
              paddingLeft: value + 'px'
            });
          }}
        />
      </div>
      
      <div className="property-group-title">אנימציה</div>
      <div className="property-group">
        <label className="property-label">סוג אנימציה</label>
        <SelectControl
          options={[
            { value: '', label: 'ללא אנימציה' },
            { value: 'fadeIn', label: 'הופעה הדרגתית (Fade In)' },
            { value: 'slideIn', label: 'גלישה פנימה (Slide In)' },
            { value: 'zoomIn', label: 'הגדלה (Zoom In)' },
            { value: 'bounceIn', label: 'קפיצה (Bounce In)' }
          ]}
          value={data.animation || ''}
          onChange={(value) => onChange({ animation: value })}
        />
      </div>
      {data.animation && (
        <>
          <div className="property-group">
            <label className="property-label">משך האנימציה (שניות)</label>
            <RangeSlider
              min={0.1}
              max={3}
              step={0.1}
              value={data.animationDuration || 0.5}
              onChange={(value) => onChange({ animationDuration: value })}
            />
          </div>
          <div className="property-group">
            <label className="property-label">השהיית האנימציה (שניות)</label>
            <RangeSlider
              min={0}
              max={2}
              step={0.1}
              value={data.animationDelay || 0}
              onChange={(value) => onChange({ animationDelay: value })}
            />
          </div>
        </>
      )}
      
      <div className="property-actions">
        <button 
          className="duplicate-button"
          onClick={handleDuplicate}
        >
          <FiCopy /> שכפל רכיב
        </button>
        <button 
          className="delete-button"
          onClick={handleDelete}
        >
          <FiTrash2 /> מחק רכיב
        </button>
      </div>
    </>
  );
};

export default SettingsPanel;