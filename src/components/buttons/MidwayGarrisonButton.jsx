import React, { useState, useEffect } from "react";
import GlobalGameState from "../../model/GlobalGameState";
import "./button.css";
import MGTOffsets from "../draganddrop/MGTBoxOffsets";
import { BoardContext } from "../../App";
function MidwayGarrisonButton({
  image,
  initialPosition,
}) {
  const [position, setPosition] = useState(initialPosition);

  // const [level, setLevel] = useState(6)

  useEffect(() => {
    setPosition({
      ...position,
      left: MGTOffsets[GlobalGameState.midwayGarrisonLevel].left + 0.5,
      top: MGTOffsets[GlobalGameState.midwayGarrisonLevel].top + 0.6,
    });
  }, [GlobalGameState.midwayGarrisonLevel])
  
  // const handleDrop = (event) => {
  //   event.preventDefault();

  //   GlobalGameState.midwayGarrisonLevel = getZone();

  //   const gl = getZone() === 0 ? "X" : getZone()
  
  //   GlobalGameState.log(`Midway Garrison Track set to ${gl}`)

  //   setPosition({
  //     ...position,
  //     left: MGTOffsets[getZone()].left + 0.5,
  //     top: MGTOffsets[getZone()].top + 0.6,
  //   });
  //   GlobalGameState.stateHandler();
  // };

  return (
    <>
      <div>
        <input
          type="image"
          src={image}
          name="saveForm"
          className={"button-pos"}
          style={{
            position: "absolute",
            width: "2.5%",
            left: `${position.left}%`,
            top: `${position.top}%`,
          }}
          id="saveForm"
          // onMouseEnter={onDrag}
          // onMouseLeave={onStop}
          // draggabble="true"
          // onDragStart={onDrag}
          // onDragEnd={handleDrop}
        />
      </div>
    </>
  );
}

export default MidwayGarrisonButton;
