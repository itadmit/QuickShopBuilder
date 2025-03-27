// src/components/editor/panels/ContentPanels/VideoContentPanel.jsx
import React from 'react';
import ImagePicker from '../../controls/ImagePicker';
import SelectControl from '../../controls/SelectControl';
import SwitchControl from '../../controls/SwitchControl';

const VideoContentPanel = ({ data, onChange }) => {
  // פונקציה להחלפת מאפיין
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  return (
    <>
      <div className="property-group">
        <label className="property-label">סוג הווידאו</label>
        <SelectControl
          options={[
            { value: 'youtube', label: 'YouTube' },
            { value: 'vimeo', label: 'Vimeo' },
            { value: 'local', label: 'וידאו מקומי' }
          ]}
          value={data.videoType || 'youtube'}
          onChange={(value) => handleChange('videoType', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">
          {data.videoType === 'youtube' ? 'קישור YouTube' : 
          data.videoType === 'vimeo' ? 'קישור Vimeo' : 
          'קישור לוידאו מקומי'}
        </label>
        <input
          type="text"
          className="text-input"
          value={data.videoUrl || ''}
          onChange={(e) => handleChange('videoUrl', e.target.value)}
          placeholder={
            data.videoType === 'youtube' ? 'לדוגמה: https://www.youtube.com/watch?v=dQw4w9WgXcQ' : 
            data.videoType === 'vimeo' ? 'לדוגמה: https://vimeo.com/148751763' : 
            'הזן קישור לווידאו מקומי'
          }
        />
      </div>
      
      {data.videoType === 'local' && (
        <div className="property-group">
          <label className="property-label">תמונת קדימון (למצבי הטענה)</label>
          <ImagePicker
            value={data.videoThumb || ''}
            onChange={(value) => handleChange('videoThumb', value)}
          />
        </div>
      )}
      
      <div className="property-group">
        <label className="property-label">כותרת (אופציונלי)</label>
        <input
          type="text"
          className="text-input"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="הזן כותרת לווידאו"
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">תיאור (אופציונלי)</label>
        <textarea
          className="textarea-input"
          value={data.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="הזן תיאור לווידאו"
          rows={3}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">מיקום הכותרת</label>
        <SelectControl
          options={[
            { value: 'top', label: 'מעל הווידאו' },
            { value: 'bottom', label: 'מתחת לווידאו' },
            { value: 'none', label: 'ללא כותרת' }
          ]}
          value={data.titlePosition || 'bottom'}
          onChange={(value) => handleChange('titlePosition', value)}
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">יחס תצוגה</label>
        <SelectControl
          options={[
            { value: '16:9', label: '16:9 (סטנדרטי)' },
            { value: '4:3', label: '4:3 (קלאסי)' },
            { value: '1:1', label: '1:1 (ריבוע)' },
            { value: '9:16', label: '9:16 (אנכי)' },
            { value: '21:9', label: '21:9 (רחב במיוחד)' }
          ]}
          value={data.aspectRatio || '16:9'}
          onChange={(value) => handleChange('aspectRatio', value)}
        />
      </div>
      
      <div className="property-group-title">הגדרות נגן</div>
      <div className="property-group">
        <label className="property-label">הפעלה אוטומטית</label>
        <SwitchControl
          checked={data.autoplay || false}
          onChange={(checked) => handleChange('autoplay', checked)}
        />
      </div>
      <div className="property-group">
        <label className="property-label">הצג פקדי שליטה</label>
        <SwitchControl
          checked={data.controls !== false} // ברירת מחדל true
          onChange={(checked) => handleChange('controls', checked)}
        />
      </div>
      <div className="property-group">
        <label className="property-label">השתק</label>
        <SwitchControl
          checked={data.muted || false}
          onChange={(checked) => handleChange('muted', checked)}
        />
      </div>
      <div className="property-group">
        <label className="property-label">הפעלה בלופ</label>
        <SwitchControl
          checked={data.loop || false}
          onChange={(checked) => handleChange('loop', checked)}
        />
      </div>
    </>
  );
};

export default VideoContentPanel;