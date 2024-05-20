import React, { useState, useEffect } from "react";
import TurnMarkerButton from "./buttons/TurnMarkerButton";
import AOPMarkerButton from "./buttons/AOPMarkerButton";
import MidwayInvasionButton from "./buttons/MidwayInvasionButton";
import MidwayGarrisonButton from "./buttons/MidwayGarrisonButton";
import DragAndDrop from "./DragAndDrop";
import DragAndDropSmall from "./DragAndDropSmall";
import CanvasHex from "./CanvasHex";
import "./board.css";
import AOPOffsets from "./AopBoxOffsets";
import MIFOffsets from "./MIFBoxOffsets";
import MGTOffsets from "./MGTBoxOffsets";
import FleetCounter from "./buttons/mapobjects/FleetCounter";
import AirCounters from "./buttons/mapobjects/AirCounters";
import loadCounters from "../Loader";
import JapanAirBoxOffsets from '../components/buttons/mapobjects/JapanAirBoxOffsets'
import GlobalUnitsModel from '../model/GlobalUnitsModel'
import GlobalGameState from "../model/GlobalGameState";

function Board({ controller, onDrag, onStop, scale }) {
  let zProps = { us: 0, japan: 0 };
  const initialJpAopPosition = { left: 2.7, top: 7 };
  const initialUSAopPosition = { left: 3.5, top: 6.1 };
  const initialMIFPosition = { left: 40.3, top: 6.2 };
  const initialMGFPosition = { left: 77.5, top: 6.2 };

  const [zone, setZone] = useState(0);
  const [loaded, setLoaded] = useState(false)
  const [currentHex, setCurrentHex] = useState({});
  const [mifzone, setMIFZone] = useState(5);
  const [mgfzone, setMGFZone] = useState(6);
  const [airBox, setAirBox] = useState({});
  const [zIndex, setZIndex] = useState(zProps);

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

    const unit = controller.getAirUnitInBox(name, index)
    console.log("...and unit here is", unit)
    const airZones = JapanAirBoxOffsets.find((o => o.name === name));

    const offsets = airZones.offsets[index]
    setAirBox({ name, offsets, index })
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

  const japan1DCapZones = JapanAirBoxOffsets.find((o => o.name === GlobalUnitsModel.AirBoxes.JP_CD_CAP1));
  const japan1DCapReturningZones = JapanAirBoxOffsets.find((o => o.name === GlobalUnitsModel.AirBoxes.JP_CAP_RETURN1));
  const japan1DHangarZones = JapanAirBoxOffsets.find((o => o.name === GlobalUnitsModel.AirBoxes.JP_1CD_HANGER));

  return (
    <>
      <div >
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
          counterData={GlobalGameState.counters.get("1AF")}
        ></FleetCounter>
        {/* <AirCounter
          onDrag={onDrag}
          onStop={onStop}
          counterData={counters.get("Akagi-A6M-2b-1")}
          getAirBox={getAirBox}
        ></AirCounter> */}
          <AirCounters
          controller={controller}
          onDrag={onDrag}
          onStop={onStop}
          counterData={GlobalGameState.counters}
          getAirBox={getAirBox}
          setAirBox={setAirBox}
        ></AirCounters>
        <div>
          <DragAndDropSmall
            name={japan1DCapZones.name}
            handleDragEnter={handleAirBoxDragEnter}
            zones={japan1DCapZones.offsets}
          ></DragAndDropSmall>
        </div>
        <div>
          <DragAndDropSmall
            handleDragEnter={(e) => handleAirBoxDragEnter(e, 0, japan1DCapReturningZones.name)}
            zones={japan1DCapReturningZones.offsets}
          ></DragAndDropSmall>
        </div>
        <div>
          <DragAndDropSmall
            name={japan1DHangarZones.name}
            handleDragEnter={handleAirBoxDragEnter}
            zones={japan1DHangarZones.offsets}
          ></DragAndDropSmall>
        </div>

      </div>
    </>
  );
}

export default Board;
