import React from 'react';

const ProductsSection = ({ data }) => {
  const { title, products = [], count = 4 } = data;
  
  // לייצר תצוגה של מוצרים ריקים אם אין מוצרים שנבחרו
  const displayProducts = products.length > 0 
    ? products.slice(0, count) 
    : Array(count).fill(null);

  return (
    <div className="products-section">
      <h2 className="section-title">{title}</h2>
      <div className="products-grid">
        {displayProducts.map((product, index) => (
          <div key={product ? product.id : `placeholder-${index}`} className="product-card">
            <div className="product-image">
              {product?.image_url && (
                <img src={product.image_url} alt={product.title} />
              )}
            </div>
            <h3 className="product-title">{product?.title || 'שם המוצר'}</h3>
            <div className="product-price">{product?.price ? `₪${product.price}` : '₪00.00'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsSection;