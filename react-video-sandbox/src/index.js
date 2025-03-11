import React, { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import VideoPlayer from "./component/VideoPlayer";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>RTSP Stream Player</h1>
      </header>
      <main>
        <VideoPlayer />
      </main>
    </div>
  );
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
