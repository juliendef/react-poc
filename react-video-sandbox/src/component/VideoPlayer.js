import React, { useRef, useState } from 'react';
import { RtspMp4Pipeline } from 'media-stream-library';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [wsUrl, setWsUrl] = useState('ws://dev.videoprotector.com/ws-stream-proxy');
  const [rtspUrl, setRtspUrl] = useState('');

  const handleStartStream = () => {
    const videoElement = videoRef.current;

    const pipeline = new RtspMp4Pipeline({
      ws: { uri: wsUrl },
      rtsp: { uri: rtspUrl },
      mediaElement: videoElement,
    });

    pipeline.start();
  };

  return (
    <div>
      <div>
        <label htmlFor="ws-url">WebSocket URL:</label>
        <input
          type="text"
          id="ws-url"
          value={wsUrl}
          onChange={(e) => setWsUrl(e.target.value)}
          placeholder="ws://localhost:8554"
        />
      </div>
      <div>
        <label htmlFor="rtsp-url">RTSP Stream URL:</label>
        <input
          type="text"
          id="rtsp-url"
          value={rtspUrl}
          onChange={(e) => setRtspUrl(e.target.value)}
          placeholder="rtsp://example.com/stream"
        />
      </div>
      <button onClick={handleStartStream}>Start Stream</button>

      <video
        id="video"
        ref={videoRef}
        className="video-js vjs-default-skin"
        controls
        autoPlay
      ></video>
    </div>
  );
};

function captureFrame(videoElement) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // Convert to an image
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    console.log("Extracted frame:", url);
  }, "image/png");
}

export default VideoPlayer;
