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
import FleetCounter from "./buttons/mapobjects/FleetCounter";
import AirCounter from "./buttons/mapobjects/AirCounter";
import loadCounters from "../Loader";
import JapanAirBoxOffsets from '../components/buttons/mapobjects/JapanAirBoxOffsets'

function Board({ onDrag, onStop, scale }) {
  let zProps = { us: 0, japan: 0 };
  const initialJpAopPosition = { left: 2.7, top: 7 };
  const initialUSAopPosition = { left: 3.5, top: 6.1 };
  const initialMIFPosition = { left: 40.3, top: 6.2 };
  const initialMGFPosition = { left: 77.5, top: 6.2 };

  const [zone, setZone] = useState(0);
  const [currentHex, setCurrentHex] = useState({});
  const [mifzone, setMIFZone] = useState(5);
  const [mgfzone, setMGFZone] = useState(6);
  const [airBox, setAirBox] = useState({});
  const [zIndex, setZIndex] = useState(zProps);

  const counters = loadCounters();

  const setCurrentCoords = (currentHex) => {
    setCurrentHex(currentHex);
  };

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

  const handleAirBoxDragEnter = (event, index, name) => {
    event.preventDefault();
    event.stopPropagation();
    const airZones = JapanAirBoxOffsets.find((o => o.name === name));
    console.log("AIR Box index = ", index)
    const offsets = airZones.offsets[index]
    setAirBox({name, offsets})
  }
  const getZone = () => zone;
  const getMIFZone = () => mifzone;
  const getMGFZone = () => mgfzone;
  const getAirBox = () => {
    
    return airBox;
  }

  const incrementZIndex = (side, increment) => {
    if (side === "japan") {
      setZIndex({ ...zProps, japan: zProps[side] + increment });
    } else {
      setZIndex({ ...zProps, us: zProps[side] + increment });
    }
  };

  const japanCapZones = JapanAirBoxOffsets.find((o => o.name === "1CD CAP"));
  const japanCapReturningZones = JapanAirBoxOffsets.find((o => o.name === "1CD CAP RETURNING"));

  return (
    <>
      <div>
        <img
          src="/images/bb.jpg"
          alt="test"
          style={{ left: "50%" }}
          width="100%"
          height="100%"
        />
        <div
          style={{
            position: "absolute",
            left: `12.5%`,
            top: `22.9%`,
          }}
        >
          <CanvasHex
            scale={scale}
            side="japan"
            setCurrentCoords={setCurrentCoords}
          ></CanvasHex>
        </div>
        <div id="canvas"
          // className="border"
          style={{
            position: "absolute",
            left: `47.4%`,
            top: `26.6%`,
          }}
        >
          {/* US MAP <Canvas></Canvas> */}
          <CanvasHex
            scale={scale}
            side="us"
            setCurrentCoords={setCurrentCoords}
          ></CanvasHex>
        </div>
        <TurnMarkerButton image="/images/markers/turnmarker.png" />
        <div>
          <DragAndDrop
            handleDragEnter={handleDragEnter}
            zones={AOPOffsets}
          ></DragAndDrop>
        </div>
        <AOPMarkerButton
          image="/images/markers/jpaop.png"
          side="japan"
          initialPosition={initialJpAopPosition}
          onDrag={onDrag}
          onStop={onStop}
          getZone={getZone}
          zIndex={zIndex}
          incrementZIndex={incrementZIndex}
        />
        <AOPMarkerButton
          image="/images/markers/usaop.png"
          side="us"
          initialPosition={initialUSAopPosition}
          onDrag={onDrag}
          onStop={onStop}
          getZone={getZone}
          zIndex={zIndex}
          incrementZIndex={incrementZIndex}
        />
        <div>
          <DragAndDrop
            handleDragEnter={handleMIFDragEnter}
            zones={MIFOffsets}
          ></DragAndDrop>
        </div>
        <MidwayInvasionButton
          image="/images/markers/midwayinvasion.png"
          initialPosition={initialMIFPosition}
          onDrag={onDrag}
          onStop={onStop}
          getZone={getMIFZone}
        />
        <div>
          <DragAndDrop
            handleDragEnter={handleMGFDragEnter}
            zones={MGTOffsets}
          ></DragAndDrop>
        </div>
        <MidwayGarrisonButton
          image="/images/markers/midwaygarrison.png"
          initialPosition={initialMGFPosition}
          onDrag={onDrag}
          onStop={onStop}
          getZone={getMGFZone}
        />
        <FleetCounter
          onDrag={onDrag}
          onStop={onStop}
          currentHex={currentHex}
          id="1AF"
          counterData={counters.get("1AF")}
        ></FleetCounter>
        <AirCounter
          onDrag={onDrag}
          onStop={onStop}
          currentHex={currentHex}
          counterData={counters.get("Akagi-A6M-1")}
          getAirBox={getAirBox}
        ></AirCounter>
        <div>
          <DragAndDrop
            // handleDragEnter={(e) => handleAirBoxDragEnter(e, japanCapZones.name)}
            name={japanCapZones.name}
            handleDragEnter={handleAirBoxDragEnter}
            zones={japanCapZones.offsets}
          ></DragAndDrop>
        </div>
        <div>
          <DragAndDrop
            handleDragEnter={(e) => handleAirBoxDragEnter(e, japanCapReturningZones.name)}
            zones={japanCapReturningZones.offsets}
          ></DragAndDrop>
        </div>
        
      </div>
    </>
  );
}

export default Board;
