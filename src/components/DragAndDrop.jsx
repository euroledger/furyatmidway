import React, { useState } from "react";
import "./board.css";
import AOPOffsets from "./AopBoxOffsets";

function DragAndDrop({ handleDragEnter, handleDrop }) {
  const [position, setPosition] = useState(AOPOffsets);
  const onDragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };
  return (
    <>
      <div
        class={"drag-drop-zone zone1"}
        style={{
          left: position[0].left + "%",
          top: "5.8%",
        }}
        onDragEnter={(e) => handleDragEnter(e, 0)}
        onDragOver={onDragOver}
      ></div>
      <div
        class={"drag-drop-zone zone2"}
        style={{
          left: position[1].left + "%",
          top: "5.8%",
        }}
        onDragEnter={(e) => handleDragEnter(e, 1)}
        onDragOver={onDragOver}
      ></div>
      <div
        class={"drag-drop-zone zone2"}
        style={{
          left: position[2].left + "%",
          top: `5.8%`,
        }}
        onDragEnter={(e) => handleDragEnter(e, 2)}
        onDragOver={onDragOver}
      ></div>
      <div
        class={"drag-drop-zone zone2"}
        style={{
          left: position[3].left + "%",
          top: `5.8%`,
        }}
        onDragEnter={(e) => handleDragEnter(e, 3)}
        onDragOver={onDragOver}
      ></div>
      <div
        class={"drag-drop-zone zone2"}
        style={{
          left: position[4].left + "%",
          top: `5.8%`,
        }}
        onDragEnter={(e) => handleDragEnter(e, 4)}
        onDragOver={onDragOver}
      ></div>
    </>
  );
}

export default DragAndDrop;
