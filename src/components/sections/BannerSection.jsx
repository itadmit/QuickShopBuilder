import React from 'react';

const BannerSection = ({ data }) => {
  const { title, subtitle, buttonText, buttonLink, backgroundImage } = data;

  return (
    <div className="banner-section" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="banner-overlay"></div>
      <div className="banner-content">
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <a href={buttonLink} className="banner-button">
          {buttonText}
        </a>
      </div>
    </div>
  );
};

export default BannerSection;