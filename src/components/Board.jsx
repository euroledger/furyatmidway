import React, { useState, useEffect } from "react"
import TurnMarkerButton from "./buttons/TurnMarkerButton"
import AOPMarkerButton from "./buttons/AOPMarkerButton"
import MidwayInvasionButton from "./buttons/MidwayInvasionButton"
import MidwayGarrisonButton from "./buttons/MidwayGarrisonButton"
import DragAndDrop from "./draganddrop/DragAndDrop"
import CanvasHex from "./CanvasHex"
import AOPOffsets from "./draganddrop/AopBoxOffsets"
import MIFOffsets from "./draganddrop/MIFBoxOffsets"
import MGTOffsets from "./draganddrop/MGTBoxOffsets"
import FleetCounter from "./buttons/mapobjects/FleetCounter"
import AirCounters from "./buttons/mapobjects/AirCounters"
import JapanAirBoxOffsets from "./draganddrop/JapanAirBoxOffsets"
import USAirBoxOffsets from "./draganddrop/USAirBoxOffsets"
import GlobalInit from "../model/GlobalInit"
import JapanCarrierDropZones from "./draganddrop/JapanCarrierDropZones"
import USCarrierDropZones from "./draganddrop/USCarrierDropZones"
import GlobalGameState from "../model/GlobalGameState"
import StrikePanel from "./dialogs/StrikePanel"
import GlobalUnitsModel from "../model/GlobalUnitsModel"

function Board({
  controller,
  onDrag,
  onStop,
  scale,
  airUnitUpdate,
  fleetUnitUpdate,
  setAlertShow,
  showZones,
  USMapRegions,
  japanMapRegions,
}) {
  let zProps = { us: 0, japan: 0 }
  const initialJpAopPosition = { left: 2.7, top: 7 }
  const initialUSAopPosition = { left: 3.5, top: 6.1 }
  const initialMIFPosition = { left: 40.5, top: 6.6 }
  const initialMGFPosition = { left: 77.5, top: 6.6 }

  const [zone, setZone] = useState(0)
  const [currentJapanHex, setCurrentJapanHex] = useState({})
  const [currentUSHex, setCurrentUSHex] = useState({})
  const [mifzone, setMIFZone] = useState(5)
  const [mgfzone, setMGFZone] = useState(6)
  const [airBox, setAirBox] = useState({})
  const [zIndex, setZIndex] = useState(zProps)

  const setCurrentJapanCoords = (currentHex) => {
    setCurrentJapanHex(currentHex)
  }

  const setCurrentUSCoords = (currentHex) => {
    setCurrentUSHex(currentHex)
  }

  const handleDragEnter = (event, zone) => {
    event.preventDefault()
    event.stopPropagation()
    setZone(zone)
  }

  const handleMIFDragEnter = (event, zone) => {
    event.preventDefault()
    event.stopPropagation()
    setMIFZone(zone)
  }

  const handleMGFDragEnter = (event, zone) => {
    event.preventDefault()
    event.stopPropagation()
    setMGFZone(zone)
  }

  const handleAirBoxDragEnter = (event, index, name) => {
    event.preventDefault()
    event.stopPropagation()

    const airZones = JapanAirBoxOffsets.find((o) => o.name === name)

    const offsets = airZones.offsets[index]
    setAirBox({ name, offsets, index, side: GlobalUnitsModel.Side.JAPAN })
  }

  const handleUSAirBoxDragEnter = (event, index, name) => {
    event.preventDefault()
    event.stopPropagation()

    const airZones = USAirBoxOffsets.find((o) => o.name === name)

    const offsets = airZones.offsets[index]
    setAirBox({ name, offsets, index, side: GlobalUnitsModel.Side.US })
  }
  const getZone = () => zone
  const getMIFZone = () => mifzone
  const getMGFZone = () => mgfzone
  const getAirBox = () => {
    return airBox
  }

  const incrementZIndex = (side, increment) => {
    if (side === "japan") {
      setZIndex({ ...zProps, japan: zProps[side] + increment })
    } else {
      setZIndex({ ...zProps, us: zProps[side] + increment })
    }
  }

  return (
    <>
      <div>
        <img src="/images/bb.jpg" alt="test" style={{ left: "50%" }} width="100%" height="100%" />
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
            setCurrentCoords={setCurrentJapanCoords}
            usRegions={USMapRegions}
          ></CanvasHex>
        </div>
        <div
          id="canvas"
          // className="border"
          style={{
            position: "absolute",
            left: `47.4%`,
            top: `26.6%`,
          }}
        >
          {/* US MAP <Canvas></Canvas> */}
          <CanvasHex scale={scale} side="us" setCurrentCoords={setCurrentUSCoords} usRegions={USMapRegions}></CanvasHex>
        </div>
        <TurnMarkerButton image="/images/markers/turnmarker.png" />
        <div>
          <DragAndDrop handleDragEnter={handleDragEnter} zones={AOPOffsets}></DragAndDrop>
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
          <DragAndDrop handleDragEnter={handleMIFDragEnter} zones={MIFOffsets}></DragAndDrop>
        </div>
        <MidwayInvasionButton
          image="/images/markers/midwayinvasion.png"
          initialPosition={initialMIFPosition}
          onDrag={onDrag}
          onStop={onStop}
          getZone={getMIFZone}
        />
        <div>
          <DragAndDrop handleDragEnter={handleMGFDragEnter} zones={MGTOffsets}></DragAndDrop>
        </div>
        <MidwayGarrisonButton
          image="/images/markers/midwaygarrison.png"
          initialPosition={initialMGFPosition}
          onDrag={onDrag}
          onStop={onStop}
          getZone={getMGFZone}
        />
        <FleetCounter
          controller={controller}
          onDrag={onDrag}
          onStop={onStop}
          currentHex={currentJapanHex}
          id="1AF"
          counterData={GlobalInit.counters.get("1AF")}
          fleetUnitUpdate={fleetUnitUpdate}
          enabled={true}
        ></FleetCounter>
        <FleetCounter
          controller={controller}
          onDrag={onDrag}
          onStop={onStop}
          currentHex={currentUSHex}
          id="CSF"
          counterData={GlobalInit.counters.get("CSF")}
          usRegions={USMapRegions}
          fleetUnitUpdate={fleetUnitUpdate}
          enabled={GlobalGameState.gamePhase === GlobalGameState.PHASE.US_SETUP_FLEET || GlobalGameState.usFleetPlaced}
        ></FleetCounter>
        <AirCounters
          controller={controller}
          onDrag={onDrag}
          onStop={onStop}
          counterData={GlobalInit.counters}
          getAirBox={getAirBox}
          setAirBox={setAirBox}
          airUnitUpdate={airUnitUpdate}
          setAlertShow={setAlertShow}
        ></AirCounters>
        <JapanCarrierDropZones handleDragEnter={handleAirBoxDragEnter} show={showZones}></JapanCarrierDropZones>
        <USCarrierDropZones handleDragEnter={handleUSAirBoxDragEnter} show={showZones}></USCarrierDropZones>
        
        <StrikePanel side="Japan" enabled={false}></StrikePanel>
        <StrikePanel side="US" enabled={false}></StrikePanel>
      </div>
    </>
  )
}

export default Board
