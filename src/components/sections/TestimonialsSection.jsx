import React from 'react';

const TestimonialsSection = ({ data }) => {
  const { title, testimonials = [] } = data;

  return (
    <div className="testimonials-section">
      <h2>{title}</h2>
      <div className="testimonials-grid">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="testimonial-card">
            <div className="testimonial-content">"{testimonial.content}"</div>
            <div className="testimonial-author">- {testimonial.author}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;