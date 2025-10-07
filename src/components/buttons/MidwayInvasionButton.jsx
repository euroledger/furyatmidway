import React, { useState, useEffect } from "react";
import GlobalGameState from "../../model/GlobalGameState";
import "./button.css";
import MIFOffsets from "../draganddrop/MIFBoxOffsets";
function MidwayInvasionButton({
  image,
  initialPosition,
}) {
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    setPosition({
      ...position,
      left: MIFOffsets[GlobalGameState.midwayInvasionLevel].left + 0.5,
      top: MIFOffsets[GlobalGameState.midwayInvasionLevel].top + 0.6,
    });
  }, [GlobalGameState.midwayInvasionLevel])
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
        />
      </div>
    </>
  );
}

export default MidwayInvasionButton;
