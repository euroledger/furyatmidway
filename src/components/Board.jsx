import React, { useState } from "react";
import TurnMarkerButton from "./buttons/TurnMarkerButton";
import AOPMarkerButton from "./buttons/AOPMarkerButton";
import DragAndDrop from "./DragAndDrop";

function Board({ turnHandler, onDrag, onStop }) {
  let zProps = { us: 0, japan: 0};
  const initialJpAopPosition = { left: 2.7, top: 7 };
  const initialUSAopPosition = { left: 3.5, top: 6.1 };
  const [zone, setZone] = useState(0);
  const [zIndex, setZIndex] = useState(zProps);

  const handleDragEnter = (event, zone) => {
    event.preventDefault();
    event.stopPropagation();
    setZone(zone);
  };  
  const getZone = () => zone;

  const incrementZIndex = (side, increment) => {
    if (side === "japan") {
      setZIndex({...zProps, japan: zProps[side]+ increment});
    } else {
      setZIndex({...zProps, us: zProps[side]+ increment});
    }
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
        <div>
          <DragAndDrop handleDragEnter={handleDragEnter}></DragAndDrop>
        </div>
        <AOPMarkerButton
          image="/images/jpaop.png"
          side="japan"
          initialPosition={initialJpAopPosition}
          onDrag={onDrag}
          onStop={onStop}
          getZone={getZone}
          zIndex={zIndex}
          incrementZIndex={incrementZIndex}
        />
        <AOPMarkerButton
          image="/images/usaop.png"
          side="us"
          initialPosition={initialUSAopPosition}
          onDrag={onDrag}
          onStop={onStop}
          getZone={getZone}
          zIndex={zIndex}
          incrementZIndex={incrementZIndex}
        />
      </div>
    </>
  );
}

export default Board;
