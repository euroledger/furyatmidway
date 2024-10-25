import React, { useEffect, useRef, useState } from "react";
import PopupMenu from "./PopupMenu";
import GlobalGameState from "../../model/GlobalGameState";
import "./button.css";
import TurnMarkerOffsets from "../draganddrop/TurnMarkerOffsets";


function TurnMarkerButton({ image }) {
  
  const [position, setPosition] = useState({ left: 2.6, top: 55.6 });

  useEffect(() => {
    setPosition({
      ...position,
      left: TurnMarkerOffsets[GlobalGameState.gameTurn - 1].left,
      top: TurnMarkerOffsets[GlobalGameState.gameTurn - 1].top,
    });
  }, [GlobalGameState.gameTurn])
  return (
    <>
      <div>
        <input
          type="image"
          src={image}
          name="saveForm"
          className={"button-pos dropdown-toggle"}
          style={{ position: 'absolute', width: '40px', left: `${position.left}%`, top: `${position.top}%` }}
          id="saveForm"
        />
      </div>
    </>
  );
}

export default TurnMarkerButton;
