import React, { useState } from "react";
import TurnMarkerButton from "./buttons/TurnMarkerButton";
import AOPMarkerButton from "./buttons/AOPMarkerButton";
import MidwayInvasionButton from "./buttons/MidwayInvasionButton";
import DragAndDrop from "./DragAndDrop";
import CanvasHex from "./CanvasHex";
import "./board.css";
import AOPOffsets from "./AopBoxOffsets";

function Board({ turnHandler, onDrag, onStop, scale }) {
  let zProps = { us: 0, japan: 0 };
  const initialJpAopPosition = { left: 2.7, top: 7 };
  const initialUSAopPosition = { left: 3.5, top: 6.1 };
  const initialMIFPosition = { left: 45.5, top: 7.1 };

  const [zone, setZone] = useState(0);
  const [mifzone, setMIFZone] = useState(5);

  const [zIndex, setZIndex] = useState(zProps);

  const handleDragEnter = (event, zone) => {
    event.preventDefault();
    event.stopPropagation();
    setZone(zone);
  };
  const getZone = () => zone;
  const getMIFZone = () => mifzone;

  const incrementZIndex = (side, increment) => {
    if (side === "japan") {
      setZIndex({ ...zProps, japan: zProps[side] + increment });
    } else {
      setZIndex({ ...zProps, us: zProps[side] + increment });
    }
  };

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
        <div
          style={{
            position: "absolute",
            left: `7.2%`,
            top: `15.1%`,
          }}
        >
          <CanvasHex scale={scale}></CanvasHex>
        </div>
        <div
          className="border"
          style={{
            position: "absolute",
            width: "520px",
            height: "420px",
            left: `50.2%`,
            top: `17.7%`,
          }}
        >
          
          {/* US MAP <Canvas></Canvas> */} 
        </div>
        <TurnMarkerButton
          image="/images/turnmarker.png"
          turnHandler={turnHandler}
        />
        <div>
          <DragAndDrop
            handleDragEnter={handleDragEnter}
            zones={AOPOffsets}
          ></DragAndDrop>
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
        <MidwayInvasionButton
          image="/images/midwayinvasion.png"
          initialPosition={initialMIFPosition}
          onDrag={onDrag}
          onStop={onStop}
          getZone={getMIFZone}
        />
      </div>
    </>
  );
}

export default Board;
