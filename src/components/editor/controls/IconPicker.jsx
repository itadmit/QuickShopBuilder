// src/components/editor/controls/IconPicker.jsx
import React, { useState, useEffect, useRef } from 'react';
import * as FiIcons from 'react-icons/fi';  // Feather Icons
import * as AiIcons from 'react-icons/ai';  // Ant Design Icons
import * as BiIcons from 'react-icons/bi';  // Bootstrap Icons
import * as BsIcons from 'react-icons/bs';  // Bootstrap Icons
import * as FaIcons from 'react-icons/fa';  // Font Awesome Icons
import * as HiIcons from 'react-icons/hi';  // Heroicons
import * as IoIcons from 'react-icons/io5'; // Ionicons 5
import * as RiIcons from 'react-icons/ri';  // Remix Icons
import { FiSearch, FiX } from 'react-icons/fi';

const IconPicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLib, setSelectedLib] = useState('all');
  const [filteredIcons, setFilteredIcons] = useState([]);
  const modalRef = useRef(null);
  
  // מיפוי ספריות האייקונים
  const iconLibraries = {
    Fi: { name: 'Feather', lib: FiIcons },
    Ai: { name: 'Ant Design', lib: AiIcons },
    Bi: { name: 'Bootstrap', lib: BiIcons },
    Bs: { name: 'Bootstrap', lib: BsIcons },
    Fa: { name: 'Font Awesome', lib: FaIcons },
    Hi: { name: 'Heroicons', lib: HiIcons },
    Io: { name: 'Ionicons', lib: IoIcons },
    Ri: { name: 'Remix', lib: RiIcons }
  };
  
  // המרת האייקונים למערך שניתן לסנן
  const getAllIcons = () => {
    let allIcons = [];
    
    Object.entries(iconLibraries).forEach(([prefix, { name, lib }]) => {
      const icons = Object.keys(lib)
        .filter(key => key.startsWith(prefix)) // רק אייקונים עם הפרפיקס הנכון
        .map(key => ({
          id: key,
          lib: prefix,
          name: key.replace(prefix, ''),
          component: lib[key]
        }));
      
      allIcons = [...allIcons, ...icons];
    });
    
    return allIcons;
  };
  
  // פילטור האייקונים לפי חיפוש וספריה
  useEffect(() => {
    const allIcons = getAllIcons();
    
    const filtered = allIcons.filter(icon => {
      const matchesSearch = searchTerm === '' || 
        icon.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLib = selectedLib === 'all' || icon.lib === selectedLib;
      
      return matchesSearch && matchesLib;
    });
    
    // לקחת רק 200 אייקונים לביצועים טובים יותר
    setFilteredIcons(filtered.slice(0, 200));
  }, [searchTerm, selectedLib]);
  
  // סגירת המודל כאשר לוחצים מחוץ לו
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // פונקציה לבחירת אייקון
  const selectIcon = (iconId) => {
    onChange(iconId);
    setIsOpen(false);
  };
  
  // קבלת האייקון הנוכחי
  const getCurrentIcon = () => {
    if (!value) return null;
    
    const prefix = value.substring(0, 2);
    const lib = iconLibraries[prefix]?.lib;
    
    if (lib && lib[value]) {
      const Icon = lib[value];
      return <Icon size={24} />;
    }
    
    // ברירת מחדל אם לא נמצא
    return <FiIcons.FiStar size={24} />;
  };
  
  return (
    <div className="icon-picker">
      <div 
        className="icon-picker-preview"
        onClick={() => setIsOpen(true)}
      >
        <div className="selected-icon">
          {getCurrentIcon()}
        </div>
        <div className="icon-name">{value || 'בחר אייקון'}</div>
      </div>
      
      {isOpen && (
        <div className="icon-picker-modal-backdrop">
          <div className="icon-picker-modal" ref={modalRef}>
            <div className="icon-picker-header">
              <h3>בחירת אייקון</h3>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                <FiX />
              </button>
            </div>
            
            <div className="icon-picker-filters">
              <div className="search-box">
                <FiSearch />
                <input
                  type="text"
                  placeholder="חיפוש אייקונים..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="library-select">
                <select 
                  value={selectedLib} 
                  onChange={(e) => setSelectedLib(e.target.value)}
                >
                  <option value="all">כל הספריות</option>
                  {Object.entries(iconLibraries).map(([prefix, { name }]) => (
                    <option key={prefix} value={prefix}>{name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="icons-grid">
              {filteredIcons.length > 0 ? (
                filteredIcons.map(icon => {
                  const Icon = icon.component;
                  return (
                    <div 
                      key={icon.id}
                      className={`icon-item ${value === icon.id ? 'selected' : ''}`}
                      onClick={() => selectIcon(icon.id)}
                      title={icon.id}
                    >
                      <Icon size={24} />
                      <span className="icon-name">{icon.name}</span>
                    </div>
                  );
                })
              ) : (
                <div className="no-results">לא נמצאו אייקונים תואמים</div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .icon-picker {
          position: relative;
        }
        
        .icon-picker-preview {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          cursor: pointer;
          background-color: #fff;
        }
        
        .selected-icon {
          margin-left: 10px;
        }
        
        .icon-name {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .icon-picker-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .icon-picker-modal {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 800px;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .icon-picker-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 24px;
        }
        
        .icon-picker-filters {
          display: flex;
          padding: 16px;
          gap: 10px;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          padding: 0 10px;
        }
        
        .search-box input {
          flex: 1;
          border: none;
          padding: 8px;
          outline: none;
        }
        
        .library-select select {
          padding: 8px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
        }
        
        .icons-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 10px;
          padding: 16px;
          overflow-y: auto;
        }
        
        .icon-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .icon-item:hover {
          background-color: #f0f0f0;
        }
        
        .icon-item.selected {
          background-color: #e3f2fd;
          border: 1px solid #2196f3;
        }
        
        .icon-item .icon-name {
          font-size: 12px;
          margin-top: 5px;
          text-align: center;
          word-break: break-word;
        }
        
        .no-results {
          padding: 40px;
          text-align: center;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default IconPicker;