// src/components/editor/TextEditorModal.jsx
import React, { useState } from 'react';
import { FiX, FiSettings, FiEdit, FiType, FiImage, FiPlus, FiMinus } from 'react-icons/fi';
import './TextEditorModal.css';

const TextEditorModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('content'); // תוכן, עיצוב, הגדרות
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="text-editor-modal">
        <div className="modal-header">
          <h2>באנר</h2>
          <button className="close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <div className="modal-tabs">
          <button 
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FiSettings className="tab-icon" />
            <span className="tab-text">הגדרות</span>
          </button>
          <button 
            className={`tab-button ${activeTab === 'design' ? 'active' : ''}`}
            onClick={() => setActiveTab('design')}
          >
            <FiEdit className="tab-icon" />
            <span className="tab-text">עיצוב</span>
          </button>
          <button 
            className={`tab-button ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <FiType className="tab-icon" />
            <span className="tab-text">תוכן</span>
          </button>
        </div>
        
        <div className="modal-content">
          {activeTab === 'content' && (
            <div className="content-tab">
              <div className="field-group">
                <label className="field-label">כותרת</label>
                <input 
                  type="text" 
                  className="text-input" 
                  placeholder="מבצע מיוחד"
                  defaultValue="מבצע מיוחד"
                />
              </div>
              
              <div className="field-group">
                <label className="field-label">תיאור</label>
                <textarea 
                  className="text-area" 
                  placeholder="הנחה של 20% על כל החנות"
                  defaultValue="הנחה של 20% על כל החנות"
                ></textarea>
              </div>
              
              <div className="field-group">
                <label className="field-label">טקסט כפתור</label>
                <input 
                  type="text" 
                  className="text-input" 
                  placeholder="למבצע"
                  defaultValue="למבצע"
                />
              </div>
              
              <div className="field-group">
                <label className="field-label">קישור כפתור</label>
                <input 
                  type="text" 
                  className="text-input" 
                  placeholder="/collections/sale/"
                  defaultValue="/collections/sale/"
                />
              </div>
            </div>
          )}
          
          {activeTab === 'design' && (
            <div className="design-tab">
              <div className="field-group">
                <label className="field-label">תמונת רקע</label>
                <div className="image-upload-box">
                  <div className="image-preview-text">תצוגה מקדימה</div>
                  <FiImage className="image-icon" />
                </div>
              </div>
              
              <div className="field-group">
                <label className="field-label">עמעום רקע</label>
                <div className="slider-container">
                  <input type="number" className="number-input" defaultValue="40" min="0" max="100" />
                  <button className="slider-button increment">
                    <FiPlus />
                  </button>
                  <div className="slider">
                    <div className="slider-track"></div>
                    <div className="slider-fill" style={{ width: '40%' }}></div>
                    <div className="slider-thumb" style={{ left: '40%' }}></div>
                  </div>
                  <button className="slider-button decrement">
                    <FiMinus />
                  </button>
                </div>
              </div>
              
              <div className="field-group">
                <label className="field-label">גובה</label>
                <div className="slider-container">
                  <input type="number" className="number-input" defaultValue="00" min="0" max="500" />
                  <button className="slider-button increment">
                    <FiPlus />
                  </button>
                  <div className="slider">
                    <div className="slider-track"></div>
                    <div className="slider-fill" style={{ width: '20%' }}></div>
                    <div className="slider-thumb" style={{ left: '20%' }}></div>
                  </div>
                  <button className="slider-button decrement">
                    <FiMinus />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="settings-tab">
              <div className="field-group">
                <label className="field-label">הצג במחשב</label>
                <div className="toggle-switch active">
                  <div className="toggle-slider"></div>
                </div>
              </div>
              
              <div className="field-group">
                <label className="field-label">הצג בטאבלט</label>
                <div className="toggle-switch active">
                  <div className="toggle-slider"></div>
                </div>
              </div>
              
              <div className="field-group">
                <label className="field-label">הצג בנייד</label>
                <div className="toggle-switch active">
                  <div className="toggle-slider"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextEditorModal;