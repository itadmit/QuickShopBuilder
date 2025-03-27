// src/components/editor/panels/ContentPanels/TestimonialsContentPanel.jsx
import React from 'react';
import { FiTrash2 } from 'react-icons/fi';

const TestimonialsContentPanel = ({ data, onChange }) => {
  // פונקציה להחלפת מאפיין
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  // פונקציה להוספת המלצה חדשה
  const addTestimonial = () => {
    const newTestimonial = {
      id: Date.now().toString(),
      author: '',
      content: ''
    };
    
    const updatedTestimonials = [...(data.testimonials || []), newTestimonial];
    handleChange('testimonials', updatedTestimonials);
  };

  // פונקציה להסרת המלצה
  const removeTestimonial = (testimonialId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את ההמלצה הזו?')) {
      const updatedTestimonials = (data.testimonials || []).filter(t => t.id !== testimonialId);
      handleChange('testimonials', updatedTestimonials);
    }
  };

  // פונקציה לעדכון פרטי המלצה
  const updateTestimonial = (index, field, value) => {
    const updatedTestimonials = [...(data.testimonials || [])];
    updatedTestimonials[index] = {
      ...updatedTestimonials[index],
      [field]: value
    };
    handleChange('testimonials', updatedTestimonials);
  };

  return (
    <>
      <div className="property-group">
        <label className="property-label">כותרת</label>
        <input
          type="text"
          className="text-input"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="הזן כותרת"
        />
      </div>
      
      <div className="property-group">
        <label className="property-label">המלצות</label>
        {(data.testimonials || []).map((testimonial, index) => (
          <div key={testimonial.id} className="testimonial-item">
            <div className="testimonial-header">
              <span className="testimonial-number">המלצה {index + 1}</span>
              <button
                className="delete-button small"
                onClick={() => removeTestimonial(testimonial.id)}
                title="הסר המלצה"
              >
                <FiTrash2 />
              </button>
            </div>
            
            <div className="property-group">
              <label className="property-label">שם</label>
              <input
                type="text"
                className="text-input"
                value={testimonial.author || ''}
                onChange={(e) => updateTestimonial(index, 'author', e.target.value)}
                placeholder="שם הלקוח"
              />
            </div>
            
            <div className="property-group">
              <label className="property-label">תוכן</label>
              <textarea
                className="textarea-input"
                value={testimonial.content || ''}
                onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                placeholder="תוכן ההמלצה"
                rows={3}
              />
            </div>
          </div>
        ))}
        
        <button
          className="add-button"
          onClick={addTestimonial}
        >
          + הוסף המלצה
        </button>
      </div>
    </>
  );
};

export default TestimonialsContentPanel;