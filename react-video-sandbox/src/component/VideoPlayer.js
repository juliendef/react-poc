import React, { useRef, useState } from 'react';
import { RtspMp4Pipeline } from 'media-stream-library';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [wsUrl, setWsUrl] = useState('ws://dev.videoprotector.com/ws-stream-proxy');
  const [rtspUrl, setRtspUrl] = useState('');

  const handleStartStream = () => {
    const videoElement = videoRef.current;
    const mediaSource = new MediaSource();
    videoElement.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener('sourceopen', () => {
      const sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');

      const pipeline = new RtspMp4Pipeline({
        ws: { uri: wsUrl },
        rtsp: { uri: rtspUrl },
        mediaElement: videoElement,
      });

      pipeline.start();
    });
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

export default VideoPlayer;
