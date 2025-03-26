import React, { useState } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { FiSettings, FiX } from 'react-icons/fi';

// ייבוא הווידג'טים שיכולים להיות בתוך עמודות
import ButtonSection from './ButtonSection';
import ImageSection from './ImageSection';
import TextSection from './TextSection';
import VideoSection from './VideoSection';

const RowSection = ({ data }) => {
  const { 
    id,
    columns = 2,
    columnsContent = Array(columns).fill({ widgets: [] }),
    columnGap = 20,
    columnWidths = Array(columns).fill(100 / columns),
    columnsResponsive = true,
    columnBackgroundColor = 'rgba(248, 249, 251, 0.7)',
    
    // מאפייני רקע
    backgroundColor,
    backgroundImage,
    
    // מאפייני טיפוגרפיה
    textColor,
    
    // מאפייני מרווחים
    marginTop, marginRight, marginBottom, marginLeft,
    paddingTop, paddingRight, paddingBottom, paddingLeft,
    
    // מאפייני אנימציה
    animation, animationDuration, animationDelay
  } = data;

  const { 
    isDragging, 
    selectedSectionId, 
    setSelectedSectionId,  // חשוב להוסיף את זה!
    updateSection, 
    showToast 
  } = useEditor();
  
  const [activeDropColumn, setActiveDropColumn] = useState(null);

  // פונקציה לרינדור ווידג'ט בהתאם לסוג
  const renderWidget = (widget) => {
    const widgetData = { ...widget }; // העתק של נתוני הווידג'ט
    
    switch (widget.type) {
      case 'button':
        return <ButtonSection data={widgetData} />;
      case 'image':
        return <ImageSection data={widgetData} />;
      case 'text':
        return <TextSection data={widgetData} />;
      case 'video':
        return <VideoSection data={widgetData} />;
      default:
        return <div>סוג ווידג'ט לא מוכר: {widget.type}</div>;
    }
  };

  // סגנונות לקונטיינר
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

  // סגנונות לשורה
  const rowStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: `${columnGap}px`,
    position: 'relative',
    zIndex: 2
  };

  // פונקציה לטיפול בגרירה מעל עמודה
  const handleColumnDragOver = (e, columnIndex) => {
    e.preventDefault();
    e.stopPropagation();
    
    // קביעת אפקט הגרירה
    e.dataTransfer.dropEffect = 'copy';
    
    // סימון העמודה הפעילה
    setActiveDropColumn(columnIndex);
  };

  // פונקציה לטיפול בעזיבת גרירה מעל עמודה
  const handleColumnDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // ביטול סימון העמודה
    setActiveDropColumn(null);
  };

  // פונקציה לטיפול בשחרור (drop) על עמודה
  const handleColumnDrop = (e, columnIndex) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Drop event at column:", columnIndex);
    setActiveDropColumn(null);
    
    try {
      // ניסיון לקבל נתונים מהדראג
      let dragData;
      
      // ניסיון לקרוא מ-dataTransfer
      let jsonData;
      let textData;
      
      try {
        jsonData = e.dataTransfer.getData('application/json');
      } catch (error) {
        console.warn('Could not read application/json from dataTransfer', error);
      }
      
      try {
        textData = e.dataTransfer.getData('text/plain');
      } catch (error) {
        console.warn('Could not read text/plain from dataTransfer', error);
      }
      
      if (jsonData) {
        dragData = JSON.parse(jsonData);
        console.log("Successfully parsed JSON data from dataTransfer", dragData);
      } else if (textData) {
        dragData = JSON.parse(textData);
        console.log("Successfully parsed text data from dataTransfer", dragData);
      } else {
        // ניסיון לקרוא מ-localStorage כגיבוי
        const localData = localStorage.getItem('dragData');
        
        if (localData) {
          dragData = JSON.parse(localData);
          console.log("Retrieved drag data from localStorage", dragData);
        } else {
          console.warn("No drag data found in dataTransfer or localStorage");
        }
      }
      
      if (dragData && dragData.type) {
        // זה רכיב/ווידג'ט חדש 
        console.log("Adding new widget of type", dragData.type, "to column", columnIndex);
        
        // יצירת עותק של תוכן העמודות
        let newColumnsContent = [...columnsContent];
        
        // במקרה שהמערך קצר מהאינדקס, נרחיב אותו
        while (newColumnsContent.length <= columnIndex) {
          newColumnsContent.push({ widgets: [] });
        }
        
        // וידוא שהעמודה מאותחלת נכון
        if (!newColumnsContent[columnIndex] || !newColumnsContent[columnIndex].widgets) {
          newColumnsContent[columnIndex] = { widgets: [] };
        }
        
        // בניית אובייקט ווידג'ט לפי סוג
        const newWidget = createWidgetByType(dragData.type, dragData.name);
        
        // הוספת הווידג'ט לעמודה
        newColumnsContent[columnIndex].widgets.push(newWidget);
        
        // עדכון הסקשן
        updateSection(id, { columnsContent: newColumnsContent });
        showToast && showToast(`נוסף ווידג'ט ${dragData.name || dragData.type} לעמודה`, "success");
      } else {
        console.warn("Invalid drag data format or no type information", dragData);
      }
    } catch (error) {
      console.error('Error processing drop:', error);
      showToast && showToast("אירעה שגיאה בהוספת הווידג'ט", "error");
    } finally {
      // ניקוי נתוני גרירה בכל מקרה
      localStorage.removeItem('dragData');
    }
  };

  // פונקציה ליצירת ווידג'ט לפי סוג
  const createWidgetByType = (type, name) => {
    const widgetId = `widget-${Date.now()}`;
    
    // תבניות ברירת מחדל לפי סוג הווידג'ט
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

  // רינדור העמודות בשורה
  const renderColumns = () => {
    // ודא שיש לנו את המספר הנכון של עמודות
    const currentColumnsContent = columnsContent || Array(columns).fill({ widgets: [] });
    
    return Array(columns).fill().map((_, index) => {
      // חישוב הרוחב של העמודה
      const columnWidth = columnWidths[index] || (100 / columns);
      
      // סגנונות לעמודה
      const columnStyle = {
        flex: `0 0 calc(${columnWidth}% - ${(columnGap * (columns - 1)) / columns}px)`,
        position: 'relative',
        minHeight: '100px',
        padding: '10px',
        backgroundColor: columnBackgroundColor || 'rgba(248, 249, 251, 0.7)',
        borderRadius: '4px',
        boxShadow: isDragging ? '0 0 0 2px #5271ff' : 'none',
        transition: 'box-shadow 0.2s ease'
      };
      
      // הגדרות העמודה
      const columnData = currentColumnsContent[index] || { widgets: [] };
      
      return (
        <div 
          key={`column-${index}`} 
          className={`row-column column-${index+1} ${isDragging ? 'droppable' : ''} ${activeDropColumn === index ? 'active-drop' : ''}`}
          style={columnStyle}
          data-column-index={index}
          data-row-id={id}
          onDragOver={(e) => handleColumnDragOver(e, index)}
          onDragLeave={handleColumnDragLeave}
          onDrop={(e) => handleColumnDrop(e, index)}
        >
          <div className="column-content">
            {Array.isArray(columnData.widgets) && columnData.widgets.length > 0 ? (
              // יש ווידג'טים בעמודה - הצג אותם
              <div className="column-widgets">
                {columnData.widgets.map((widget, widgetIndex) => (
                  <div 
                    key={`widget-${widgetIndex}`} 
                    className="column-widget"
                    onClick={() => {
                      // בלחיצה על הווידג'ט בוחרים אותו לעריכה
                      // נשמור את המזהה של הווידג'ט ואת העמודה שלו בקונטקסט
                      // כדי שנוכל להשתמש בו בפאנל ההגדרות
                      const widgetSectionId = `${id}-col${index}-widget${widgetIndex}`;
                      
                      // עדכון מידע נוסף לווידג'ט כדי שנוכל לשלוף אותו אחר כך
                      const updatedWidget = {
                        ...widget,
                        _parentSectionId: id,
                        _columnIndex: index,
                        _widgetIndex: widgetIndex
                      };
                      
                      // עדכון העמודה עם המידע הנוסף
                      const newColumnsContent = [...columnsContent];
                      if (newColumnsContent[index] && newColumnsContent[index].widgets) {
                        newColumnsContent[index].widgets[widgetIndex] = updatedWidget;
                        updateSection(id, { columnsContent: newColumnsContent });
                      }
                      
                      // שינוי הסקשן הנבחר לווידג'ט
                      setSelectedSectionId(widget.id);
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
                          // פתיחת הגדרות הווידג'ט
                          setSelectedSectionId(widget.id);
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
                          
                          if (window.confirm('האם אתה בטוח שברצונך למחוק את הווידג\'ט?')) {
                            // הסרת הווידג'ט
                            const updatedWidgets = [...columnData.widgets];
                            updatedWidgets.splice(widgetIndex, 1);
                            
                            // עדכון העמודה
                            const newColumnsContent = [...columnsContent];
                            newColumnsContent[index] = { 
                              ...newColumnsContent[index], 
                              widgets: updatedWidgets 
                            };
                            
                            // עדכון הסקשן
                            updateSection(id, { columnsContent: newColumnsContent });
                            showToast && showToast("הווידג'ט נמחק בהצלחה", "success");
                          }
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
                      transition: 'box-shadow 0.2s ease'
                    }}>
                      {renderWidget(widget)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // אין ווידג'טים - הצג הודעה
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
    <div className="row-section" style={containerStyle} data-responsive={columnsResponsive}>
      {/* אם יש תמונת רקע, הוסף שכבת כיסוי */}
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
      
      {/* שורת העמודות */}
      <div className="row-columns" style={rowStyle}>
        {renderColumns()}
      </div>
    </div>
  );
};

export default RowSection;