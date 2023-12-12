import React, { useState } from "react";
import "./board.css";

function DragAndDrop({ handleDragEnter, handleDrop, zones }) {
  const onDragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const myZones = zones.map((p, index) => {
    return (
      <div
        key={index}
        class={"drag-drop-zone zone2"}
        style={{
          left: p.left + "%",
          top: p.top + "%",
        }}
        onDragEnter={(e) => handleDragEnter(e, index)}
        onDragOver={onDragOver}
      ></div>
    );
  });
  return <>{myZones}</>;
}

export default DragAndDrop;
