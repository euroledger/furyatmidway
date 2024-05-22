import React from "react";
import "../board.css";

function DragAndDropSmall({ name, handleDragEnter, zones, enabled }) {
  const onDragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

 const myZones = zones.map((p, index) => {
    if (!enabled) {
      return <></>
    }
    return (
      <div
        key={index}
        class={"drag-drop-zone-small zone2"}
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

export default DragAndDropSmall;
