import React, { useRef, useEffect } from "react";

const Canvas = (props) => {
  const canvasRef = useRef(null);

  const draw = (ctx) => {
    ctx.fillStyle = "rgba(50, 40, 0, 1)";
    ctx.beginPath();
    // ctx.lineWidth = 12;

    ctx.rect(0, 0, 1000, 1000);

    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    //Our draw come here
    draw(context);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        // zIndex: "100",
      }}
      {...props}
    />
  );
};

export default Canvas;
