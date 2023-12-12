import React, { useState } from "react";
import TurnMarkerButton from "./buttons/TurnMarkerButton";
import AOPMarkerButton from "./buttons/AOPMarkerButton";
import MidwayInvasionButton from "./buttons/MidwayInvasionButton";
import MidwayGarrisonButton from "./buttons/MidwayGarrisonButton";
import DragAndDrop from "./DragAndDrop";
import CanvasHex from "./CanvasHex";
import "./board.css";
import AOPOffsets from "./AopBoxOffsets";
import MIFOffsets from "./MIFBoxOffsets";
import MGTOffsets from "./MGTBoxOffsets";

function Board({ turnHandler, gameStateHandler, onDrag, onStop, scale }) {
  let zProps = { us: 0, japan: 0 };
  const initialJpAopPosition = { left: 2.7, top: 7 };
  const initialUSAopPosition = { left: 3.5, top: 6.1 };
  const initialMIFPosition = { left: 40.1, top: 5.9 };
  const initialMGFPosition = { left: 77.3, top: 5.9 };

  const [zone, setZone] = useState(0);
  const [mifzone, setMIFZone] = useState(5);
  const [mgfzone, setMGFZone] = useState(6);
  const [zIndex, setZIndex] = useState(zProps);

  const handleDragEnter = (event, zone) => {
    event.preventDefault();
    event.stopPropagation();
    setZone(zone);
  };
  const handleMIFDragEnter = (event, zone) => {
    event.preventDefault();
    event.stopPropagation();
    setMIFZone(zone);
  };

  const handleMGFDragEnter = (event, zone) => {
    event.preventDefault();
    event.stopPropagation();
    setMGFZone(zone);
  };
  const getZone = () => zone;
  const getMIFZone = () => mifzone;
  const getMGFZone = () => mgfzone;


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
            left: `7.3%`,
            top: `15.1%`,
          }}
        >
          <CanvasHex scale={scale} side="japan"></CanvasHex>
        </div>
        <div
          // className="border"
          style={{
            position: "absolute",
            width: "520px",
            height: "420px",
            left: `50.4%`,
            top: `17.8%`,
          }}
        >
          {/* US MAP <Canvas></Canvas> */}
          <CanvasHex scale={scale} side="us"></CanvasHex>
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
          gameStateHandler={gameStateHandler}
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
          gameStateHandler={gameStateHandler}
        />
        <div>
          <DragAndDrop
            handleDragEnter={handleMIFDragEnter}
            zones={MIFOffsets}
          ></DragAndDrop>
        </div>
        <MidwayInvasionButton
          image="/images/midwayinvasion.png"
          initialPosition={initialMIFPosition}
          onDrag={onDrag}
          onStop={onStop}
          getZone={getMIFZone}
          gameStateHandler={gameStateHandler}
        />
        <div>
          <DragAndDrop
            handleDragEnter={handleMGFDragEnter}
            zones={MGTOffsets}
          ></DragAndDrop>
        </div>
        <MidwayGarrisonButton
          image="/images/midwaygarrison.png"
          initialPosition={initialMGFPosition}
          onDrag={onDrag}
          onStop={onStop}
          getZone={getMGFZone}
          gameStateHandler={gameStateHandler}
        />
      </div>
    </>
  );
}

export default Board;
