import React, {useEffect, useRef, useState} from 'react';
import { RtspMp4Pipeline } from 'media-stream-library';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [wsUrl, setWsUrl] = useState('ws://dev.videoprotector.com/ws-stream-proxy');
  const [rtspUrl, setRtspUrl] = useState('');
  const [capturedFrame, setCapturedFrame] = useState(null);
  const [streamError, setStreamError] = useState(false);

  const captureFrameIntervalRef = useRef(null);
  const reverseIntervalRef = useRef(null);


  const handleKeyDown = (forward) => {
    const videoElement = videoRef.current;
    const frameTime = 1 / 8; // Assuming 30 FPS
    if (!forward) {
      videoElement.currentTime = Math.max(0, videoElement.currentTime - frameTime);
    } else {
      videoElement.currentTime = Math.min(videoElement.duration, videoElement.currentTime + frameTime);
    }
  };

  function captureFrame() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const videoElement = videoRef.current;
    if (!videoElement) return;

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Convert to an image
    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      setCapturedFrame(url);
    }, "image/png");
  }

  const handleStartStream = () => {
    const videoElement = videoRef.current;

    const pipeline = new RtspMp4Pipeline({
      ws: { uri: wsUrl },
      rtsp: { uri: rtspUrl },
      mediaElement: videoElement,
    });

    // Capture frames periodically
    captureFrameIntervalRef.current = setInterval(() => {
      if (videoElement.readyState >= 2) {
        captureFrame(videoElement);
      }
    }, 1000); // Adjust the interval as needed

    pipeline.start();
  };

  const startReversePlayback = () => {
    const videoElement = videoRef.current;
    reverseIntervalRef.current = setInterval(() => {
      if (videoElement.currentTime > 0) {
        videoElement.currentTime -= 0.1; // Adjust the decrement value as needed
      } else {
        clearInterval(reverseIntervalRef.current);
      }
    }, 100); // Adjust the interval as needed
  };

  const stopReversePlayback = () => {
    clearInterval(reverseIntervalRef.current);
  };

  const simulateStreamCrash = () => {
    if (streamError) {
      setStreamError(false);
    } else {
      setStreamError(true);
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(captureFrameIntervalRef.current);
      clearInterval(reverseIntervalRef.current);
    }
  }, []);

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

      {streamError && capturedFrame ? (
        <img src={capturedFrame} alt="Captured frame" style={{ width: 1280, height: 720, objectFit: 'fill', display: "block"}} />
      ) : (
        <video
          id="video"
          ref={videoRef}
          className="video-js vjs-default-skin"
          controls
          autoPlay
          // stretch the video to fill the container
          style={{ width: 1280, height: 720, objectFit: 'fill' }}
        ></video>
      )}

      <button onClick={() => handleKeyDown(false)}>Backward</button>
      <button onClick={() => handleKeyDown(true)}>Forward</button>
      <button onMouseDown={startReversePlayback} onMouseUp={stopReversePlayback}>Reverse Playback</button>
      <button onClick={simulateStreamCrash}>Simulate Stream Crash</button>
    </div>
  );
};


export default VideoPlayer;
