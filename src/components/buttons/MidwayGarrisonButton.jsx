import React, { useRef, useState } from "react";
import GlobalGameState from "../../model/GlobalGameState";
import "./button.css";
import MGTOffsets from "../MGTBoxOffsets";

function MidwayGarrisonButton({
  image,
  initialPosition,
  onDrag,
  onStop,
  getZone,
  gameStateHandler
}) {
  const [position, setPosition] = useState(initialPosition);

  const myRef = useRef();

  
  const handleDrop = (event) => {
    event.preventDefault();

    GlobalGameState.midwayGarrisonLevel = getZone();
  
    setPosition({
      ...position,
      left: MGTOffsets[getZone()].left + 0.1,
      top: MGTOffsets[getZone()].top + 0.2,
    });
    gameStateHandler();
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

export default MidwayGarrisonButton;
