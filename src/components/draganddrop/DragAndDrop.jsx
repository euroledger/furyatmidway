import React from "react";
import "../board.css";

function DragAndDrop({ name, handleDragEnter, zones }) {
  const onDragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const myZones = zones.map((p, index) => {
    return (
      <div
        key={index}
        className={"drag-drop-zone"}
        style={{
          left: p.left + "%",
          top: p.top + "%",
        }}
        onDragEnter={(e) => handleDragEnter(e, index, name)}
        onDragOver={onDragOver}
      ></div>
    );
  });
  return <>{myZones}</>;
}

export default DragAndDrop;
