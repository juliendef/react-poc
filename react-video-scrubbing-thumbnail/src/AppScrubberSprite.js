import React, { useState, useEffect, useRef } from "react";

const VideoScrubberSprite = ({ videoSrc, spriteSrc, totalThumbnails }) => {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => setDuration(videoRef.current.duration);
    }
  }, []);

  const handleScrub = (e) => {
    const percent = e.target.value / 100;
    const index = Math.min(Math.floor(percent * totalThumbnails), totalThumbnails - 1);
    setPosition(index);
  };

  const scrubberStyle = {
    position: "relative",
    width: "100%",
  };

  const thumbnailStyle = {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    top: "-48px",
    width: "200px",
    height: "112px",
    backgroundImage: `url(${spriteSrc})`,
    backgroundPosition: `-${position * 200}px 0px`,
    backgroundSize: `${totalThumbnails * 200}px auto`,
  };

  const inputStyle = {
    width: "100%",
  };

  return (
    <div style={scrubberStyle}>
      <video width={200} height={200} ref={videoRef} src={videoSrc} controls style={{ width: "100%" }}></video>
      <div style={{ position: "relative", marginTop: "16px" }}>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          style={inputStyle}
          onChange={handleScrub}
        />
        <div style={thumbnailStyle}></div>
      </div>
    </div>
  );
};

// Usage Example
const AppScrubberSprite = () => {
  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
        Video Scrubbing Preview
      </h1>
      <VideoScrubberSprite
        videoSrc="/video.mp4"
        spriteSrc="/sprite.jpg"
        totalThumbnails={10}
      />
    </div>
  );
};

export default AppScrubberSprite;
