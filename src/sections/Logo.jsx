import React from "react";
import "../css/Logo.css";

const Logo = ({ brands, title = "Brand yang Sudah Mempercayai Kami" }) => {
  // Duplikasi array brands untuk efek infinite scroll yang mulus
  const duplicatedBrands = [...brands, ...brands];

  return (
    <div className="brand-carousel-container">
      <h2 className="brand-carousel-title">{title}</h2>
      <div className="brand-carousel-wrapper">
        <div className="brand-track">
          {duplicatedBrands.map((brand, index) => (
            <div key={index} className="brand-item">
              <img src={brand.logo} alt={brand.name} className="brand-logo" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Logo;
