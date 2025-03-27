import React, { useState } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { FiSettings, FiX } from 'react-icons/fi';

import ButtonSection from './ButtonSection';
import ImageSection from './ImageSection';
import TextSection from './TextSection';
import VideoSection from './VideoSection';

const RowSection = ({ data }) => {
  const {
    id,
    rowWidthType = 'full',
    rowCustomWidth = 1000,

    columns = 2,
    columnsContent = Array(columns).fill({ widgets: [] }),
    columnGap = 20,
    columnWidths = Array(columns).fill(100 / columns),
    columnsResponsive = true,
    mobileColumns = 1,
    tabletColumns = Math.min(2, columns),
    columnBackgroundColor = 'rgba(248, 249, 251, 0.7)',

    // הוספנו שני פרופס חדשים למסגרת העמודות:
    columnBorderWidth = 0,
    columnBorderColor = '#cccccc',

    backgroundColor,
    backgroundImage,
    textColor,

    marginTop, marginRight, marginBottom, marginLeft,
    paddingTop, paddingRight, paddingBottom, paddingLeft,

    animation, animationDuration, animationDelay
  } = data;

  const {
    isDragging,
    selectedSectionId,
    setSelectedSectionId,
    updateSection,
    showToast
  } = useEditor();

  const [activeDropColumn, setActiveDropColumn] = useState(null);

  // יצירת ווידג'ט חדש לפי סוג
  const createWidgetByType = (type, name) => {
    const widgetId = `widget-${Date.now()}`;
    const defaultWidgets = {
      button: {
        id: widgetId,
        type: 'button',
        name: name || 'כפתור',
        buttonText: 'לחץ כאן',
        buttonLink: '#',
        alignment: 'center',
        buttonSize: 'medium',
        buttonStyle: 'filled',
        buttonColor: '#5271ff',
        buttonTextColor: '#ffffff'
      },
      image: {
        id: widgetId,
        type: 'image',
        name: name || 'תמונה',
        image: '/builder/build/images/placeholders/image-placeholder.jpg',
        altText: 'תמונה',
        alignment: 'center'
      },
      text: {
        id: widgetId,
        type: 'text',
        name: name || 'טקסט',
        title: 'כותרת',
        content: 'הזן כאן את הטקסט שלך',
        alignment: 'right',
        contentColor: '#444444'
      },
      video: {
        id: widgetId,
        type: 'video',
        name: name || 'וידאו',
        title: '',
        videoUrl: '',
        videoType: 'youtube',
        aspectRatio: '16:9',
        alignment: 'center'
      }
    };
    return defaultWidgets[type] || { id: widgetId, type, name: name || type };
  };

  // רינדור ווידג'ט בהתאם לסוג
  const renderWidget = (widget) => {
    const widgetData = { ...widget };
    switch (widget.type) {
      case 'button': return <ButtonSection data={widgetData} />;
      case 'image':  return <ImageSection data={widgetData} />;
      case 'text':   return <TextSection data={widgetData} />;
      case 'video':  return <VideoSection data={widgetData} />;
      default:       return <div>סוג ווידג'ט לא מוכר: {widget.type}</div>;
    }
  };

  // חישוב רוחב חיצוני של השורה (Full/Container/Custom)
  const resolveOuterWidth = () => {
    switch (rowWidthType) {
      case 'container':
        return '1000px';
      case 'custom':
        return `${rowCustomWidth || 1000}px`;
      case 'full':
      default:
        return '100%';
    }
  };

  const outerContainerStyle = {
    width: resolveOuterWidth(),
    margin: '0 auto' // לרוחב מלא, אפשר להשאיר auto כדי למרכז. 
  };

  // סגנונות החלק הפנימי של השורה
  const containerStyle = {
    marginTop: marginTop || '',
    marginRight: marginRight || '',
    marginBottom: marginBottom || '',
    marginLeft: marginLeft || '',
    paddingTop: paddingTop || '30px',
    paddingRight: paddingRight || '30px',
    paddingBottom: paddingBottom || '30px',
    paddingLeft: paddingLeft || '30px',
    backgroundColor: backgroundColor || '',
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
    backgroundSize: backgroundImage ? 'cover' : 'auto',
    backgroundPosition: backgroundImage ? 'center' : 'initial',
    color: textColor || 'inherit',
    animation: animation ? `${animation} ${animationDuration || 0.5}s ${animationDelay || 0}s` : 'none',
    position: 'relative'
  };

  // סגנונות לרמת השורה עצמה
  const rowStyle = {
    display: 'flex',
    flexWrap: columnsResponsive ? 'wrap' : 'nowrap',
    gap: `${columnGap}px`,
    position: 'relative',
    zIndex: 2
  };

  // פונקציות לגרירה/שחרור ווידג'טים לעמודות
  const handleColumnDragOver = (e, columnIndex) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setActiveDropColumn(columnIndex);
  };

  const handleColumnDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropColumn(null);
  };

  const handleColumnDrop = (e, columnIndex) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropColumn(null);
    try {
      let dragData;
      const jsonData = e.dataTransfer.getData('application/json');
      const textData = e.dataTransfer.getData('text/plain');

      if (jsonData) {
        dragData = JSON.parse(jsonData);
      } else if (textData) {
        dragData = JSON.parse(textData);
      } else {
        const localData = localStorage.getItem('dragData');
        if (localData) {
          dragData = JSON.parse(localData);
        }
      }

      if (dragData && dragData.type) {
        let newColumnsContent = [...columnsContent];
        while (newColumnsContent.length <= columnIndex) {
          newColumnsContent.push({ widgets: [] });
        }
        if (!newColumnsContent[columnIndex] || !newColumnsContent[columnIndex].widgets) {
          newColumnsContent[columnIndex] = { widgets: [] };
        }
        const newWidget = createWidgetByType(dragData.type, dragData.name);
        newColumnsContent[columnIndex].widgets.push(newWidget);
        updateSection(id, { columnsContent: newColumnsContent });
        showToast && showToast(`נוסף ווידג'ט ${dragData.name || dragData.type} לעמודה`, "success");
      }
    } catch (error) {
      console.error('Error processing drop:', error);
      showToast && showToast("אירעה שגיאה בהוספת הווידג'ט", "error");
    } finally {
      localStorage.removeItem('dragData');
    }
  };

  // בחירת ווידג'ט
  const handleWidgetSelect = (widget, columnIndex, widgetIndex) => {
    const updatedWidget = {
      ...widget,
      _parentSectionId: id,
      _columnIndex: columnIndex,
      _widgetIndex: widgetIndex
    };
    const newColumnsContent = [...columnsContent];
    if (newColumnsContent[columnIndex] && newColumnsContent[columnIndex].widgets) {
      newColumnsContent[columnIndex].widgets[widgetIndex] = updatedWidget;
      updateSection(id, { columnsContent: newColumnsContent });
    }
    setSelectedSectionId(widget.id);
  };

  // הסרת ווידג'ט
  const removeWidget = (columnIndex, widgetIndex) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הווידג\'ט?')) {
      const newColumnsContent = [...columnsContent];
      if (newColumnsContent[columnIndex] && Array.isArray(newColumnsContent[columnIndex].widgets)) {
        newColumnsContent[columnIndex].widgets.splice(widgetIndex, 1);
        updateSection(id, { columnsContent: newColumnsContent });
        showToast && showToast("הווידג'ט נמחק בהצלחה", "success");
      }
    }
  };

  // רינדור העמודות
  const renderColumns = () => {
    const currentColumnsContent = columnsContent || Array(columns).fill({ widgets: [] });
    const columnClasses = {
      1: 'col-full',
      2: 'col-half',
      3: 'col-third',
      4: 'col-quarter',
      5: 'col-fifth',
      6: 'col-sixth'
    };

    return Array(columns).fill().map((_, index) => {
      const columnWidth = columnWidths && columnWidths[index] ? columnWidths[index] : (100 / columns);
      
      // הגדרת סגנון לעמודה כולל מסגרת (border)
      const columnStyle = {
        flex: `0 0 calc(${columnWidth}% - ${(columnGap * (columns - 1)) / columns}px)`,
        position: 'relative',
        minHeight: '100px',
        padding: '10px',
        backgroundColor: columnBackgroundColor || 'rgba(248, 249, 251, 0.7)',
        borderRadius: '4px',

        // **מסגרת חדשה**:
        border: `${columnBorderWidth}px solid ${columnBorderColor}`,

        // הצללה בעת גרירה
        boxShadow: isDragging ? '0 0 0 2px #5271ff' : 'none',
        transition: 'box-shadow 0.2s ease'
      };

      const columnData = currentColumnsContent[index] || { widgets: [] };

      return (
        <div 
          key={`column-${index}`} 
          className={`row-column column-${index+1} ${columnClasses[columns] || ''} 
                      ${isDragging ? 'droppable' : ''} 
                      ${activeDropColumn === index ? 'active-drop' : ''}`}
          style={columnStyle}
          data-column-index={index}
          data-row-id={id}
          data-tablet-columns={tabletColumns}
          data-mobile-columns={mobileColumns}
          onDragOver={(e) => handleColumnDragOver(e, index)}
          onDragLeave={handleColumnDragLeave}
          onDrop={(e) => handleColumnDrop(e, index)}
        >
          <div className="column-content">
            {Array.isArray(columnData.widgets) && columnData.widgets.length > 0 ? (
              <div className="column-widgets">
                {columnData.widgets.map((widget, widgetIndex) => (
                  <div 
                    key={`widget-${widgetIndex}`} 
                    className={`column-widget ${selectedSectionId === widget.id ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWidgetSelect(widget, index, widgetIndex);
                    }}
                  >
                    <div className="widget-controls" style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      display: 'flex',
                      gap: '5px',
                      zIndex: 10
                    }}>
                      <button
                        className="widget-settings-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWidgetSelect(widget, index, widgetIndex);
                        }}
                        style={{
                          background: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }}
                      >
                        <FiSettings size={14} />
                      </button>
                      <button
                        className="widget-remove-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeWidget(index, widgetIndex);
                        }}
                        style={{
                          background: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }}
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                    <div className="widget-content" style={{
                      padding: '5px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s ease',
                      boxShadow: selectedSectionId === widget.id ? '0 0 0 2px #5271ff' : 'none'
                    }}>
                      {renderWidget(widget)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-column-placeholder">
                <div className="placeholder-text">גרור ווידג'טים לכאן</div>
              </div>
            )}
          </div>
          {isDragging && (
            <div className="column-drop-indicator" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(82, 113, 255, 0.1)',
              pointerEvents: 'none',
              opacity: activeDropColumn === index ? 1 : 0,
              transition: 'opacity 0.2s ease'
            }}>
              <div className="drop-here-text" style={{
                background: 'rgba(82, 113, 255, 0.2)',
                color: '#5271ff',
                padding: '8px 12px',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}>שחרר כאן</div>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="row-section" style={outerContainerStyle} data-responsive={columnsResponsive}>
      <div className="row-section-inner" style={containerStyle}>
        {backgroundImage && (
          <div className="row-overlay" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            zIndex: 1
          }}></div>
        )}
        <div className="row-columns" style={rowStyle}>
          {renderColumns()}
        </div>
      </div>
    </div>
  );
};

export default RowSection;
