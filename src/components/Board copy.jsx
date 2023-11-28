import React, { useState } from "react";
import TurnMarkerButton from "./buttons/TurnMarkerButton";
import AOPMarkerButton from "./buttons/AOPMarkerButton";
import DragAndDrop from "./DragAndDrop";

import "./board.css";

function Board({ turnHandler, onDrag, onStop }) {
  const initialJpAopPosition = { left: 2.7, top: 7 };
  const initialUSAopPosition = { left: 3.5, top: 6.1 };

  const [jpPosition, setJpPosition] = useState(initialJpAopPosition);
  const [usPosition, setUsPosition] = useState(initialUSAopPosition);

  const usPositionChangeHandler = (newPos, xoffset) => {
    const newPos = usPosition.left + xoffset;
    setUsPosition({ ...usPosition, left: newPos });
  }

  const jpPositionChangeHandler = (newPos, xoffset) => {
    const newPos = jpPosition.left + xoffset;
    setJpPosition({ ...jpPosition, left: newPos });
  }
  const handleDragEnter = (event, zone) => {
    console.log("ENTER DROP ZONE", zone);
  };

  const jpAops = {
    handler: jpPositionChangeHandler,
    position: jpPosition
  }

  const Aops = {
    handler: jpPositionChangeHandler,
    position: jpPosition
  }
  return (
    <>
      <div>
        <img
          src="/images/battleboard.gif"
          alt="test"
          style={{ left: "50%" }}
          width="100%"
          height="100%"
        />
        <TurnMarkerButton
          image="/images/turnmarker.png"
          turnHandler={turnHandler}
        />
        <DragAndDrop handleDragEnter={handleDragEnter}></DragAndDrop>
        <AOPMarkerButton
          image="/images/jpaop.png"
          side="japan"
          positionChangeHandler={jpPositionChangeHandler}
          onDrag={onDrag}
          onStop={onStop}
        />
        <AOPMarkerButton
          image="/images/usaop.png"
          side="us"
          positionChangeHandler={usPositionChangeHandler}
          onDrag={onDrag}
          onStop={onStop}
        />
      </div>
    </>
  );
}

export default Board;
