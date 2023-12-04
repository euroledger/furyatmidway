import React, { useState } from "react";
import "./board.css";
import AOPOffsets from "./AopBoxOffsets";

function DragAndDrop({ handleDragEnter, handleDrop, zones }) {
  console.log("** zones = ", zones);
  const [position, setPosition] = useState(AOPOffsets);
  const onDragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const myZones = zones.map((p, index) => {
    return (
      <div
        class={"drag-drop-zone zone1"}
        style={{
          left: p.left + "%",
          top: p.top + "%",
        }}
        onDragEnter={(e) => handleDragEnter(e, index)}
        onDragOver={onDragOver}
      ></div>
    );
  });
  return (
    <>
      {/* <div
        class={"drag-drop-zone zone1"}
        style={{
          left: zones[0].left + "%",
          top: zones[0].top + "%",
        }}
        onDragEnter={(e) => handleDragEnter(e, 0)}
        onDragOver={onDragOver}
      ></div>
      <div
        class={"drag-drop-zone zone1"}
        style={{
          left: zones[1].left + "%",
          top: zones[1].top + "%",
        }}
        onDragEnter={(e) => handleDragEnter(e, 1)}
        onDragOver={onDragOver}
      ></div>
      <div
        class={"drag-drop-zone zone1"}
        style={{
          left: zones[2].left + "%",
          top: zones[2].top + "%",
        }}
        onDragEnter={(e) => handleDragEnter(e, 2)}
        onDragOver={onDragOver}
      ></div>
      <div
        class={"drag-drop-zone zone1"}
        style={{
          left: zones[3].left + "%",
          top: zones[3].top + "%",
        }}
        onDragEnter={(e) => handleDragEnter(e, 3)}
        onDragOver={onDragOver}
      ></div>
      <div
        class={"drag-drop-zone zone1"}
        style={{
          left: zones[4].left + "%",
          top: zones[4].top + "%",
        }}
        onDragEnter={(e) => handleDragEnter(e, 4)}
        onDragOver={onDragOver}
      ></div> */}
      {myZones}
    </>
  );
}

export default DragAndDrop;
