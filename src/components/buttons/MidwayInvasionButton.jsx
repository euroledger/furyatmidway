import React, { useState, useContext } from "react";
import GlobalGameState from "../../model/GlobalGameState";
import "./button.css";
import MIFOffsets from "../draganddrop/MIFBoxOffsets";
import { BoardContext } from "../../App";
function MidwayInvasionButton({
  image,
  initialPosition,
  getZone,
}) {
  const { onDrag, onStop } = useContext(BoardContext)

  const [position, setPosition] = useState(initialPosition);
 
  const handleDrop = (event) => {
    event.preventDefault();

    GlobalGameState.midwayInvasionLevel = getZone();
  
    const il = getZone() === 0 ? "X" : getZone()

    GlobalGameState.log(`Midway Invasion Track set to ${il}`)

    setPosition({
      ...position,
      left: MIFOffsets[getZone()].left + 0.6,
      top: MIFOffsets[getZone()].top + 0.5,
    });
    GlobalGameState.stateHandler();
  };

  return (
    <>
      <div>
        <input
          type="image"
          src={image}
          name="saveForm"
          className={"button-pos dropdown-toggle"}
          style={{
            position: "absolute",
            width: "2.5%",
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
