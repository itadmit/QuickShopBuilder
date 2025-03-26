import React from 'react';

const VideoSection = ({ data }) => {
  const { 
    title,
    videoUrl = '',
    videoType = 'youtube', // youtube, vimeo, custom
    customThumbnail = '',
    aspectRatio = '16:9',
    autoplay = false,
    muted = true,
    loop = false,
    controls = true,
    startTime = 0,
    
    // מאפייני יישור
    alignment = 'center',
    
    // מאפייני טיפוגרפיה כותרת
    titleFontFamily, 
    titleFontSize, 
    titleFontWeight, 
    titleFontStyle, 
    titleTextDecoration, 
    titleTextTransform, 
    titleLineHeight, 
    titleLetterSpacing,
    titleColor,
    
    // מאפייני וידאו
    maxWidth,
    borderRadius,
    
    // מאפייני מרווחים
    marginTop, marginRight, marginBottom, marginLeft,
    paddingTop, paddingRight, paddingBottom, paddingLeft,
    
    // מאפייני אנימציה
    animation, animationDuration, animationDelay,
    
    // אפקטים
    shadow = false,
    shadowColor = 'rgba(0, 0, 0, 0.2)',
    
    // תיאור (כיתוב)
    caption = '',
    captionFontFamily,
    captionFontSize,
    captionColor,
  } = data;

  // סגנונות לקונטיינר
  const containerStyle = {
    marginTop: marginTop || '',
    marginRight: marginRight || '',
    marginBottom: marginBottom || '',
    marginLeft: marginLeft || '',
    paddingTop: paddingTop || '20px',
    paddingRight: paddingRight || '30px',
    paddingBottom: paddingBottom || '20px',
    paddingLeft: paddingLeft || '30px',
    textAlign: alignment,
    animation: animation ? `${animation} ${animationDuration || 0.5}s ${animationDelay || 0}s` : 'none'
  };

  // סגנונות לכותרת
  const titleStyle = {
    fontFamily: titleFontFamily || "'Noto Sans Hebrew', sans-serif",
    fontSize: titleFontSize ? `${titleFontSize}px` : '22px',
    fontWeight: titleFontWeight || 'bold',
    fontStyle: titleFontStyle || 'normal',
    textDecoration: titleTextDecoration || 'none',
    textTransform: titleTextTransform || 'none',
    lineHeight: titleLineHeight || 1.2,
    letterSpacing: titleLetterSpacing ? `${titleLetterSpacing}px` : 'normal',
    color: titleColor || '#202123',
    marginTop: 0,
    marginBottom: title ? '15px' : 0,
    textAlign: alignment
  };

  // סגנונות למכל הווידאו
  const videoContainerStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: maxWidth ? `${maxWidth}px` : '800px',
    margin: '0 auto',
    overflow: 'hidden',
    borderRadius: borderRadius ? `${borderRadius}px` : '0',
    boxShadow: shadow ? `0 8px 30px ${shadowColor}` : 'none',
  };

  // סגנונות עבור הרספונסיביות של הווידאו
  const videoWrapperStyle = {
    position: 'relative',
    height: '0',
    overflow: 'hidden',
  };

  // חישוב יחס גובה-רוחב
  const getAspectRatioPadding = () => {
    if (aspectRatio === '16:9') return { paddingTop: '56.25%' }; // 9/16 * 100%
    if (aspectRatio === '4:3') return { paddingTop: '75%' }; // 3/4 * 100%
    if (aspectRatio === '1:1') return { paddingTop: '100%' };
    
    // פורמט מותאם: "16:9" -> [16, 9]
    const parts = aspectRatio.split(':').map(Number);
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parts[0] > 0 && parts[1] > 0) {
      return { paddingTop: `${(parts[1] / parts[0]) * 100}%` };
    }
    
    // ברירת מחדל
    return { paddingTop: '56.25%' };
  };

  // סגנונות למסגרת הסרטון
  const iframeStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    border: '0',
  };

  // סגנונות לכיתוב
  const captionStyle = {
    marginTop: '10px',
    textAlign: alignment,
    fontFamily: captionFontFamily || "'Noto Sans Hebrew', sans-serif",
    fontSize: captionFontSize ? `${captionFontSize}px` : '14px',
    color: captionColor || '#666',
  };

  // פענוח URL של Youtube
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    // תבניות URL אפשריות של Youtube
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // פענוח URL של Vimeo
  const getVimeoVideoId = (url) => {
    if (!url) return null;
    
    // תבניות URL אפשריות של Vimeo
    const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
    const match = url.match(regExp);
    
    return match ? match[1] : null;
  };

  // רינדור הווידאו בהתאם לסוג
  const renderVideo = () => {
    if (videoType === 'youtube') {
      const videoId = getYouTubeVideoId(videoUrl);
      if (!videoId) return <div className="error-message">כתובת יוטיוב לא תקינה</div>;
      
      // יצירת פרמטרים ל-URL
      const params = new URLSearchParams({
        autoplay: autoplay ? 1 : 0,
        mute: muted ? 1 : 0,
        controls: controls ? 1 : 0,
        loop: loop ? 1 : 0,
        start: startTime || 0,
        rel: 0, // ללא סרטונים מומלצים בסוף
        modestbranding: 1 // לוגו יוטיוב מוקטן
      });
      
      if (loop) {
        params.append('playlist', videoId);
      }
      
      const embedUrl = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
      
      return (
        <iframe 
          src={embedUrl}
          title={title || "YouTube video player"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={iframeStyle}
        ></iframe>
      );
    } 
    else if (videoType === 'vimeo') {
      const videoId = getVimeoVideoId(videoUrl);
      if (!videoId) return <div className="error-message">כתובת וימאו לא תקינה</div>;
      
      // יצירת פרמטרים ל-URL
      const params = new URLSearchParams({
        autoplay: autoplay ? 1 : 0,
        muted: muted ? 1 : 0,
        loop: loop ? 1 : 0,
      });
      
      if (startTime) {
        params.append('#t', startTime);
      }
      
      const embedUrl = `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
      
      return (
        <iframe 
          src={embedUrl}
          title={title || "Vimeo video player"}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          style={iframeStyle}
        ></iframe>
      );
    }
    else if (videoType === 'custom') {
      if (!videoUrl) return <div className="error-message">לא הוזנה כתובת וידאו</div>;
      
      // סרטון MP4/WebM מותאם אישית
      return (
        <video
          src={videoUrl}
          controls={controls}
          autoPlay={autoplay}
          muted={muted}
          loop={loop}
          poster={customThumbnail}
          style={iframeStyle}
        >
          דפדפן זה אינו תומך בתגית וידאו.
        </video>
      );
    }
    
    return <div className="error-message">הזן כתובת וידאו תקינה</div>;
  };

  return (
    <div className="video-section" style={containerStyle}>
      {title && <h2 className="section-title" style={titleStyle}>{title}</h2>}
      
      <div className="video-container" style={videoContainerStyle}>
        <div className="video-wrapper" style={{...videoWrapperStyle, ...getAspectRatioPadding()}}>
          {renderVideo()}
        </div>
      </div>
      
      {caption && (
        <div className="video-caption" style={captionStyle}>
          {caption}
        </div>
      )}
    </div>
  );
};

export default VideoSection;