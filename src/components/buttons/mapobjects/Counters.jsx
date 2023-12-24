import React, { useState } from "react";
import "../../board.css";
import CounterPositions from "./CounterPositions";
import GlobalGameState from "../../../model/GlobalGameState";

function Counters({ onDrag, onStop, currentHex, gameStateHandler }) {
  const counter = CounterPositions.find((obj) => obj.name === "1AF");

  const [position, setPosition] = useState({
    hexCoords: {},
    left: counter.currentHex.x,
    top: counter.currentHex.y,
  });

  const handleDrop = (event) => {
    setPosition({
      left: currentHex.x + counter.currentHex.x +66,
      top: currentHex.y + counter.currentHex.y +80,
    });
    GlobalGameState.log(`Japanese 1AF moves to ${currentHex.row}-${currentHex.col}`)
  };

  //   const counter = zones.map((p, index) => {
  return (
    <div>
      <input
        type="image"
        src="/images/1AF.png"
        style={{
          position: "absolute",
          width: "40px",
          left: position.left,
          top: position.top,
        }}
        onMouseEnter={onDrag}
        onMouseLeave={onStop}
        draggabble="true"
        onDragStart={onDrag}
        onDragEnd={handleDrop}
      />
    </div>
  );
  //   });
}

export default Counters;
