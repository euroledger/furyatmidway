import React, { useEffect, useRef, useState } from "react";
import PopupMenu from "./PopupMenu";
import GlobalGameState from "../../model/GlobalGameState";
import "./button.css";
import MIFOffsets from "../MIFBoxOffsets";

function MidwayInvasionButton({
  image,
  initialPosition,
  onDrag,
  onStop,
  getZone,
}) {
  const [position, setPosition] = useState(initialPosition);

  const myRef = useRef();

  
  const handleDrop = (event) => {
    event.preventDefault();

    GlobalGameState.midwayInvasionLevel = getZone();
  
    setPosition({
      ...position,
      left: MIFOffsets[getZone()].left + 0.3,
      top: MIFOffsets[getZone()].top + 0.4,
    });
  };

  return (
    <>
      <div>
        <input
          type="image"
          src={image}
          name="saveForm"
          class={"button-pos dropdown-toggle"}
          style={{
            position: "absolute",
            width: "40px",
            left: `${position.left}%`,
            top: `${position.top}%`,
          }}
          id="saveForm"
          onMouseEnter={onDrag}
          onMouseLeave={onStop}
          draggabble="true"
          onDragStart={onDrag}
          onDragEnd={handleDrop}
        />
      </div>
    </>
  );
}

export default MidwayInvasionButton;
