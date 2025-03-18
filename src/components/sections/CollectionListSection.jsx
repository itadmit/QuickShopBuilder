import React from 'react';

const CollectionListSection = ({ data }) => {
  const { title, collections = [], count = 3 } = data;
  
  // לייצר תצוגה של קטגוריות ריקות אם אין קטגוריות שנבחרו
  const displayCollections = collections.length > 0 
    ? collections.slice(0, count) 
    : Array(count).fill(null);

  return (
    <div className="collection-list-section">
      <h2>{title}</h2>
      <div className="collections-grid">
        {displayCollections.map((collection, index) => (
          <div key={collection ? collection.id : `placeholder-${index}`} className="collection-card">
            <div className="collection-image">
              {collection?.image_url && (
                <img src={collection.image_url} alt={collection.title} />
              )}
            </div>
            <h3>{collection ? collection.title : 'שם קטגוריה לדוגמה'}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionListSection;