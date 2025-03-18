import React from 'react';

const TextWithImageSection = ({ data }) => {
  const { title, content, image, imagePosition } = data;

  return (
    <div className={`text-with-image-section image-${imagePosition}`}>
      <div className="text-content">
        <h2>{title}</h2>
        <div className="section-text">{content}</div>
      </div>
      <div className="image-container">
        <img src={image} alt={title} />
      </div>
    </div>
  );
};

export default TextWithImageSection;