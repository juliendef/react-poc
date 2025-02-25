import { useState, useEffect, useRef } from "react";

const VideoScrubber = ({ videoSrc, thumbnails }) => {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.onloadedmetadata = () => setDuration(video.duration);
    }
  }, []);

  const handleScrub = (e) => {
    const percent = e.target.value / 100;
    const index = Math.min(Math.floor(percent * thumbnails.length), thumbnails.length - 1);
    setThumbnailIndex(index);
  };

  return (
    <div className="relative w-full">
      <video width={200} height={200} ref={videoRef} src={videoSrc} controls className="w-full"></video>

      {/* Thumbnail Preview */}
      <div className="relative mt-2">
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          className="w-full"
          onChange={handleScrub}
        />
        <img
          src={thumbnails[thumbnailIndex]}
          alt="Thumbnail Preview"
          className="absolute left-1/2 transform -translate-x-1/2 -top-12 w-32 rounded shadow-md"
        />
      </div>
    </div>
  );
};

const AppScrubber = () => {
  const videoSrc = "./video.mp4"; // Adjust the path
  const thumbnails = Array.from({ length: 10 }, (_, i) => `/thumbnails/thumb${String(i + 1).padStart(4, '0')}.jpg`);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Video Scrubbing Preview</h1>
      <VideoScrubber videoSrc={videoSrc} thumbnails={thumbnails} />
    </div>
  );
};

export default AppScrubber;
