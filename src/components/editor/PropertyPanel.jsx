import React, { useState } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { FiX, FiCopy, FiTrash2, FiType, FiLayout, FiSettings } from 'react-icons/fi';
import ColorPicker from './controls/ColorPicker';
import ImagePicker from './controls/ImagePicker';
import RangeSlider from './controls/RangeSlider';
import SwitchControl from './controls/SwitchControl';

const PropertyPanel = () => {
  const { selectedSection, updateSection, deleteSection } = useEditor();
  const [activeTab, setActiveTab] = useState('content'); // 'content', 'style', 'settings'

  // אם אין סקשן נבחר, מציגים הודעה מתאימה
  if (!selectedSection) {
    return (
      <div className="property-panel empty">
        <div className="panel-header">
          <h3>הגדרות</h3>
        </div>
        <div className="empty-message">
          <div className="empty-icon">
            <FiSettings size={40} opacity={0.3} />
          </div>
          <p>בחר אלמנט כדי לערוך את המאפיינים שלו</p>
        </div>
      </div>
    );
  }

  // פונקציית עזר לעדכון מאפיינים
  const handleChange = (field, value) => {
    updateSection(selectedSection.id, { [field]: value });
  };

  // פונקציה למחיקת סקשן
  const handleDelete = () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הסקשן הזה?')) {
      deleteSection(selectedSection.id);
    }
  };

  // פונקציה לשכפול סקשן
  const handleDuplicate = () => {
    // בפרויקט אמיתי, כאן תהיה לוגיקת השכפול
    console.log('Duplicating section:', selectedSection);
  };

  // רינדור טאבים
  const renderTabs = () => {
    return (
      <div className="property-tabs">
        <button 
          className={`tab ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          <FiType />
          תוכן
        </button>
        <button 
          className={`tab ${activeTab === 'style' ? 'active' : ''}`}
          onClick={() => setActiveTab('style')}
        >
          <FiLayout />
          עיצוב
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <FiSettings />
          הגדרות
        </button>
      </div>
    );
  };

  // רינדור השדות המותאמים לטאב הפעיל
  const renderFields = () => {
    if (activeTab === 'content') {
      // שדות עריכת תוכן בהתאם לסוג הסקשן
      switch (selectedSection.type) {
        case 'hero':
          return (
            <>
              <div className="property-group">
                <label className="property-label">כותרת ראשית</label>
                <input
                  type="text"
                  className="text-input"
                  value={selectedSection.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="הזן כותרת ראשית"
                />
              </div>
              <div className="property-group">
                <label className="property-label">כותרת משנה</label>
                <textarea
                  className="textarea-input"
                  value={selectedSection.subtitle || ''}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  placeholder="הזן תיאור קצר"
                  rows={3}
                />
              </div>
              <div className="property-group">
                <label className="property-label">טקסט כפתור</label>
                <input
                  type="text"
                  className="text-input"
                  value={selectedSection.buttonText || ''}
                  onChange={(e) => handleChange('buttonText', e.target.value)}
                  placeholder="לדוגמה: קרא עוד"
                />
              </div>
              <div className="property-group">
                <label className="property-label">קישור כפתור</label>
                <input
                  type="text"
                  className="text-input"
                  value={selectedSection.buttonLink || ''}
                  onChange={(e) => handleChange('buttonLink', e.target.value)}
                  placeholder="הזן URL"
                />
              </div>
            </>
          );
        
        case 'products':
        case 'featured-products':
          return (
            <>
              <div className="property-group">
                <label className="property-label">כותרת</label>
                <input
                  type="text"
                  className="text-input"
                  value={selectedSection.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              </div>
              <div className="property-group">
                <label className="property-label">מספר מוצרים להצגה</label>
                <RangeSlider
                  min={2}
                  max={12}
                  value={selectedSection.count || 4}
                  onChange={(value) => handleChange('count', value)}
                />
              </div>
              <div className="property-group">
                <label className="property-label">בחירת מוצרים</label>
                <button className="button-secondary" onClick={() => console.log('פתיחת חלון בחירת מוצרים')}>
                  בחר מוצרים
                </button>
                
                {selectedSection.products && selectedSection.products.length > 0 ? (
                  <div className="selected-items">
                    {selectedSection.products.map(product => (
                      <div key={product.id} className="selected-item">
                        <span>{product.title}</span>
                        <button 
                          className="remove-button"
                          onClick={() => {
                            const updatedProducts = selectedSection.products.filter(p => p.id !== product.id);
                            handleChange('products', updatedProducts);
                          }}
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-selection">לא נבחרו מוצרים (יוצגו המוצרים העדכניים ביותר)</p>
                )}
              </div>
            </>
          );
        
        case 'banner':
          return (
            <>
              <div className="property-group">
                <label className="property-label">כותרת</label>
                <input
                  type="text"
                  className="text-input"
                  value={selectedSection.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              </div>
              <div className="property-group">
                <label className="property-label">תיאור</label>
                <textarea
                  className="textarea-input"
                  value={selectedSection.subtitle || ''}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="property-group">
                <label className="property-label">טקסט כפתור</label>
                <input
                  type="text"
                  className="text-input"
                  value={selectedSection.buttonText || ''}
                  onChange={(e) => handleChange('buttonText', e.target.value)}
                />
              </div>
              <div className="property-group">
                <label className="property-label">קישור כפתור</label>
                <input
                  type="text"
                  className="text-input"
                  value={selectedSection.buttonLink || ''}
                  onChange={(e) => handleChange('buttonLink', e.target.value)}
                />
              </div>
            </>
          );
        
        case 'text-image':
          return (
            <>
              <div className="property-group">
                <label className="property-label">כותרת</label>
                <input
                  type="text"
                  className="text-input"
                  value={selectedSection.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              </div>
              <div className="property-group">
                <label className="property-label">תוכן</label>
                <textarea
                  className="textarea-input"
                  value={selectedSection.content || ''}
                  onChange={(e) => handleChange('content', e.target.value)}
                  rows={5}
                />
              </div>
              <div className="property-group">
                <label className="property-label">מיקום התמונה</label>
                <select
                  className="select-input"
                  value={selectedSection.imagePosition || 'right'}
                  onChange={(e) => handleChange('imagePosition', e.target.value)}
                >
                  <option value="right">מימין לטקסט</option>
                  <option value="left">משמאל לטקסט</option>
                </select>
              </div>
            </>
          );
          
        case 'testimonials':
          return (
            <>
              <div className="property-group">
                <label className="property-label">כותרת</label>
                <input
                  type="text"
                  className="text-input"
                  value={selectedSection.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              </div>
              
              <div className="property-group">
                <label className="property-label">המלצות</label>
                {selectedSection.testimonials && selectedSection.testimonials.map((testimonial, index) => (
                  <div key={testimonial.id} className="testimonial-item">
                    <div className="property-group">
                      <label className="property-label">שם</label>
                      <input
                        type="text"
                        className="text-input"
                        value={testimonial.author || ''}
                        onChange={(e) => {
                          const updatedTestimonials = [...selectedSection.testimonials];
                          updatedTestimonials[index] = {
                            ...updatedTestimonials[index],
                            author: e.target.value
                          };
                          handleChange('testimonials', updatedTestimonials);
                        }}
                      />
                    </div>
                    <div className="property-group">
                      <label className="property-label">תוכן</label>
                      <textarea
                        className="textarea-input"
                        value={testimonial.content || ''}
                        onChange={(e) => {
                          const updatedTestimonials = [...selectedSection.testimonials];
                          updatedTestimonials[index] = {
                            ...updatedTestimonials[index],
                            content: e.target.value
                          };
                          handleChange('testimonials', updatedTestimonials);
                        }}
                        rows={3}
                      />
                    </div>
                    <button
                      className="delete-button small"
                      onClick={() => {
                        const updatedTestimonials = selectedSection.testimonials.filter(t => t.id !== testimonial.id);
                        handleChange('testimonials', updatedTestimonials);
                      }}
                    >
                      <FiTrash2 /> הסר המלצה
                    </button>
                  </div>
                ))}
                
                <button
                  className="add-button"
                  onClick={() => {
                    const newTestimonial = {
                      id: Date.now().toString(),
                      author: '',
                      content: ''
                    };
                    const updatedTestimonials = [...(selectedSection.testimonials || []), newTestimonial];
                    handleChange('testimonials', updatedTestimonials);
                  }}
                >
                  + הוסף המלצה
                </button>
              </div>
            </>
          );
        
        case 'newsletter':
          return (
            <>
              <div className="property-group">
                <label className="property-label">כותרת</label>
                <input
                  type="text"
                  className="text-input"
                  value={selectedSection.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              </div>
              <div className="property-group">
                <label className="property-label">תיאור</label>
                <textarea
                  className="textarea-input"
                  value={selectedSection.subtitle || ''}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="property-group">
                <label className="property-label">טקסט כפתור</label>
                <input
                  type="text"
                  className="text-input"
                  value={selectedSection.buttonText || ''}
                  onChange={(e) => handleChange('buttonText', e.target.value)}
                />
              </div>
              <div className="property-group">
                <label className="property-label">כתובת אימייל לשליחת הטופס (צד שרת)</label>
                <input
                  type="email"
                  className="text-input"
                  value={selectedSection.formEmail || ''}
                  onChange={(e) => handleChange('formEmail', e.target.value)}
                  placeholder="mail@example.com"
                />
              </div>
            </>
          );
          
        default:
          return <p>אין הגדרות תוכן זמינות עבור רכיב זה</p>;
      }
    } 
    // טאב עיצוב
    else if (activeTab === 'style') {
      return (
        <>
          {/* הגדרות עיצוב כלליות */}
          <div className="property-group">
            <label className="property-label">מרווח עליון</label>
            <RangeSlider
              min={0}
              max={100}
              value={selectedSection.paddingTop || 20}
              onChange={(value) => handleChange('paddingTop', value)}
            />
          </div>
          <div className="property-group">
            <label className="property-label">מרווח תחתון</label>
            <RangeSlider
              min={0}
              max={100}
              value={selectedSection.paddingBottom || 20}
              onChange={(value) => handleChange('paddingBottom', value)}
            />
          </div>
          
          {/* הגדרות עיצוב ספציפיות לפי סוג הסקשן */}
          {selectedSection.type === 'hero' && (
            <>
              <div className="property-group">
                <label className="property-label">תמונת רקע</label>
                <ImagePicker
                  value={selectedSection.backgroundImage || ''}
                  onChange={(value) => handleChange('backgroundImage', value)}
                />
              </div>
              <div className="property-group">
                <label className="property-label">צבע כפתור</label>
                <ColorPicker
                  value={selectedSection.buttonColor || '#5271ff'}
                  onChange={(value) => handleChange('buttonColor', value)}
                />
              </div>
              <div className="property-group">
                <label className="property-label">גובה הסקשן</label>
                <RangeSlider
                  min={200}
                  max={800}
                  value={selectedSection.height || 400}
                  onChange={(value) => handleChange('height', value)}
                />
              </div>
              <div className="property-group">
                <label className="property-label">עמעום רקע</label>
                <RangeSlider
                  min={0}
                  max={100}
                  value={(selectedSection.overlayOpacity || 0.4) * 100}
                  onChange={(value) => handleChange('overlayOpacity', value / 100)}
                />
              </div>
            </>
          )}
          
          {selectedSection.type === 'banner' && (
            <>
              <div className="property-group">
                <label className="property-label">תמונת רקע</label>
                <ImagePicker
                  value={selectedSection.backgroundImage || ''}
                  onChange={(value) => handleChange('backgroundImage', value)}
                />
              </div>
              <div className="property-group">
                <label className="property-label">צבע כפתור</label>
                <ColorPicker
                  value={selectedSection.buttonColor || '#ffffff'}
                  onChange={(value) => handleChange('buttonColor', value)}
                />
              </div>
              <div className="property-group">
                <label className="property-label">צבע טקסט כפתור</label>
                <ColorPicker
                  value={selectedSection.buttonTextColor || '#000000'}
                  onChange={(value) => handleChange('buttonTextColor', value)}
                />
              </div>
            </>
          )}
          
          {selectedSection.type === 'text-image' && (
            <>
              <div className="property-group">
                <label className="property-label">תמונה</label>
                <ImagePicker
                  value={selectedSection.image || ''}
                  onChange={(value) => handleChange('image', value)}
                />
              </div>
              <div className="property-group">
                <label className="property-label">גודל תמונה</label>
                <RangeSlider
                  min={10}
                  max={90}
                  value={selectedSection.imageWidth || 50}
                  onChange={(value) => handleChange('imageWidth', value)}
                />
              </div>
            </>
          )}
          
          {selectedSection.type === 'newsletter' && (
            <>
              <div className="property-group">
                <label className="property-label">סוג רקע</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="bgType"
                      checked={!selectedSection.backgroundImage}
                      onChange={() => handleChange('backgroundImage', null)}
                    />
                    צבע רקע
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="bgType"
                      checked={!!selectedSection.backgroundImage}
                      onChange={() => handleChange('backgroundImage', '/placeholder-bg.jpg')}
                    />
                    תמונת רקע
                  </label>
                </div>
              </div>
              
              {selectedSection.backgroundImage ? (
                <div className="property-group">
                  <label className="property-label">תמונת רקע</label>
                  <ImagePicker
                    value={selectedSection.backgroundImage}
                    onChange={(value) => handleChange('backgroundImage', value)}
                  />
                </div>
              ) : (
                <div className="property-group">
                  <label className="property-label">צבע רקע</label>
                  <ColorPicker
                    value={selectedSection.backgroundColor || '#f7f7f7'}
                    onChange={(value) => handleChange('backgroundColor', value)}
                  />
                </div>
              )}
              
              <div className="property-group">
                <label className="property-label">צבע כפתור</label>
                <ColorPicker
                  value={selectedSection.buttonColor || '#5271ff'}
                  onChange={(value) => handleChange('buttonColor', value)}
                />
              </div>
            </>
          )}
        </>
      );
    } 
    // טאב הגדרות
    else if (activeTab === 'settings') {
      return (
        <>
          <div className="property-group">
            <label className="property-label">מזהה CSS מותאם אישית</label>
            <input
              type="text"
              className="text-input"
              value={selectedSection.customId || ''}
              onChange={(e) => handleChange('customId', e.target.value)}
              placeholder="section-1"
            />
            <small>משמש לקישור ישיר לסקשן זה</small>
          </div>
          
          <div className="property-group">
            <SwitchControl
              label="הצג בנייד"
              checked={selectedSection.showOnMobile !== false}
              onChange={(checked) => handleChange('showOnMobile', checked)}
            />
          </div>
          
          <div className="property-group">
            <SwitchControl
              label="הצג בטאבלט"
              checked={selectedSection.showOnTablet !== false}
              onChange={(checked) => handleChange('showOnTablet', checked)}
            />
          </div>
          
          <div className="property-group">
            <SwitchControl
              label="הצג במחשב"
              checked={selectedSection.showOnDesktop !== false}
              onChange={(checked) => handleChange('showOnDesktop', checked)}
            />
          </div>
          
          <div className="property-group">
            <label className="property-label">אנימציה</label>
            <select
              className="select-input"
              value={selectedSection.animation || 'none'}
              onChange={(e) => handleChange('animation', e.target.value)}
            >
              <option value="none">ללא</option>
              <option value="fade">Fade In</option>
              <option value="slideUp">Slide Up</option>
              <option value="slideDown">Slide Down</option>
            </select>
          </div>
          
          <div className="property-actions">
            <button 
              className="duplicate-button"
              onClick={handleDuplicate}
            >
              <FiCopy /> שכפל סקשן
            </button>
            <button 
              className="delete-button"
              onClick={handleDelete}
            >
              <FiTrash2 /> מחק סקשן
            </button>
          </div>
        </>
      );
    }
  };

  return (
    <div className="property-panel">
      <div className="panel-header">
        <h3>{getSectionName(selectedSection.type)}</h3>
        <button className="panel-toggle">
          <FiX />
        </button>
      </div>
      
      {renderTabs()}
      
      <div className="panel-content">
        {renderFields()}
      </div>
    </div>
  );
};

// פונקציית עזר להצגת שם ידידותי לסוג הסקשן
function getSectionName(type) {
  const typeNames = {
    'hero': 'כותרת ראשית',
    'products': 'מוצרים',
    'featured-products': 'מוצרים מובחרים',
    'banner': 'באנר',
    'text-image': 'טקסט ותמונה',
    'testimonials': 'המלצות',
    'collections': 'קטגוריות',
    'newsletter': 'ניוזלטר',
  };
  
  return typeNames[type] || type;
}

export default PropertyPanel;