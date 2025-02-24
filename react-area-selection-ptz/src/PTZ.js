import React, { useRef, useState, useEffect } from "react";

const AreaSelectionPTZ = ({
  imageSrc,
  imageWidth = 800,
  imageHeight = 600,
  onPTZChange,
}) => {
  const canvasRef = useRef(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [currentPoint, setCurrentPoint] = useState(null);
  const [ptz, setPTZ] = useState(null);

  // Start selection on mouse down
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPoint({ x, y });
    setCurrentPoint({ x, y });
    setIsSelecting(true);
  };

  // Update the current point as the user drags
  const handleMouseMove = (e) => {
    if (!isSelecting) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentPoint({ x, y });
    draw(); // update drawing as selection changes
  };

  // End selection on mouse up and compute PTZ values
  const handleMouseUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);
    if (startPoint && currentPoint) {
      const computedPTZ = computePTZ(startPoint, currentPoint);
      setPTZ(computedPTZ);
      if (onPTZChange) {
        onPTZChange(computedPTZ);
      }
    }
    draw(); // final drawing update
  };

  // Compute pan, tilt and zoom based on the selection rectangle
  const computePTZ = (p1, p2) => {
    const x1 = Math.min(p1.x, p2.x);
    const y1 = Math.min(p1.y, p2.y);
    const x2 = Math.max(p1.x, p2.x);
    const y2 = Math.max(p1.y, p2.y);
    const selectionWidth = x2 - x1;
    const selectionHeight = y2 - y1;
    const selectionCenterX = x1 + selectionWidth / 2;
    const selectionCenterY = y1 + selectionHeight / 2;
    const imageCenterX = imageWidth / 2;
    const imageCenterY = imageHeight / 2;
    // Normalize pan and tilt to range [-1, 1]
    const pan = (selectionCenterX - imageCenterX) / (imageWidth / 2);
    const tilt = (selectionCenterY - imageCenterY) / (imageHeight / 2);
    // Compute zoom factor so that the selected area fills the view
    const zoom = Math.min(
      imageWidth / selectionWidth,
      imageHeight / selectionHeight
    );
    return { pan, tilt, zoom };
  };

  // Draw the image and selection rectangle on the canvas
  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the image as background
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      // If there is an active selection, draw the rectangle
      if (startPoint && currentPoint) {
        const rectX = startPoint.x;
        const rectY = startPoint.y;
        const rectWidth = currentPoint.x - startPoint.x;
        const rectHeight = currentPoint.y - startPoint.y;
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
      }
    };
  };

  // Redraw the canvas whenever the selection or image source changes
  useEffect(() => {
    draw();
  }, [startPoint, currentPoint, imageSrc]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={imageWidth}
        height={imageHeight}
        style={{ border: "1px solid #ccc", cursor: "crosshair" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      {ptz && (
        <div style={{ marginTop: "10px" }}>
          <h3>Computed PTZ Values:</h3>
          <p>Pan: {ptz.pan.toFixed(2)}</p>
          <p>Tilt: {ptz.tilt.toFixed(2)}</p>
          <p>Zoom: {ptz.zoom.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default AreaSelectionPTZ;
