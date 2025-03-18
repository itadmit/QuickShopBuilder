import React from 'react';

const HeroSection = ({ data }) => {
  const { title, subtitle, buttonText, buttonLink, backgroundImage } = data;

  return (
    <div className="hero-section" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <a href={buttonLink} className="hero-button">
          {buttonText}
        </a>
      </div>
    </div>
  );
};

export default HeroSection;