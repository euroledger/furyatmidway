import React, { useState, useEffect, useContext } from "react"
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
import StrikeCounters from "./buttons/mapobjects/StrikeCounters"
import JapanAirBoxOffsets from "./draganddrop/JapanAirBoxOffsets"
import USAirBoxOffsets from "./draganddrop/USAirBoxOffsets"
import GlobalInit from "../model/GlobalInit"
import JapanCarrierDropZones from "./draganddrop/JapanCarrierDropZones"
import USCarrierDropZones from "./draganddrop/USCarrierDropZones"
import GlobalGameState from "../model/GlobalGameState"
import StrikePanel from "./dialogs/StrikePanel"
import GlobalUnitsModel from "../model/GlobalUnitsModel"

function Board({ scale, USMapRegions, japanMapRegions, japanStrikePanelEnabled, usStrikePanelEnabled }) {
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
            jpRegions={japanMapRegions}
          ></CanvasHex>
        </div>
        <div
          id="canvas"
          style={{
            position: "absolute",
            left: `47.4%`,
            top: `26.6%`,
          }}
        >
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
          getZone={getZone}
          zIndex={zIndex}
          incrementZIndex={incrementZIndex}
        />
        <AOPMarkerButton
          image="/images/markers/usaop.png"
          side="us"
          initialPosition={initialUSAopPosition}
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
          getZone={getMIFZone}
        />
        <div>
          <DragAndDrop handleDragEnter={handleMGFDragEnter} zones={MGTOffsets}></DragAndDrop>
        </div>
        <MidwayGarrisonButton
          image="/images/markers/midwaygarrison.png"
          initialPosition={initialMGFPosition}
          getZone={getMGFZone}
        />
        <FleetCounter
          currentHex={currentJapanHex}
          id="1AF"
          counterData={GlobalInit.counters.get("1AF")}
          jpRegions={japanMapRegions}
          enabled={
            GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT ||
            GlobalGameState.jpFleetPlaced === true
          }
          side={GlobalUnitsModel.Side.JAPAN}
        ></FleetCounter>
        <FleetCounter
          currentHex={currentJapanHex}
          id="MIF"
          counterData={GlobalInit.counters.get("MIF")}
          jpRegions={japanMapRegions}
          enabled={true}
          side={GlobalUnitsModel.Side.JAPAN}
        ></FleetCounter>
        <FleetCounter
          currentHex={currentUSHex}
          id="CSF"
          counterData={GlobalInit.counters.get("CSF")}
          usRegions={USMapRegions}
          enabled={
            GlobalGameState.gamePhase === GlobalGameState.PHASE.US_SETUP_FLEET || GlobalGameState.usFleetPlaced === true
          }
          side={GlobalUnitsModel.Side.US}
        ></FleetCounter>
        <FleetCounter
          currentHex={currentUSHex}
          id="CSF-JPMAP"
          counterData={GlobalInit.counters.get("CSF-JPMAP")}
          enabled={true}
          side={GlobalUnitsModel.Side.JP}
        ></FleetCounter>
        <FleetCounter
          currentHex={currentJapanHex}
          id="1AF-USMAP"
          counterData={GlobalInit.counters.get("1AF-USMAP")}
          enabled={true}
          side={GlobalUnitsModel.Side.US}
        ></FleetCounter>
        <FleetCounter
          currentHex={currentJapanHex}
          id="MIF-USMAP"
          counterData={GlobalInit.counters.get("MIF-USMAP")}
          enabled={true}
          side={GlobalUnitsModel.Side.US}
        ></FleetCounter>

        <AirCounters counterData={GlobalInit.counters} getAirBox={getAirBox} setAirBox={setAirBox}></AirCounters>
        <StrikeCounters
          controller={GlobalInit.controller}
          // onDrag={onDrag}
          // onStop={onStop}
          counterData={GlobalInit.counters}
        ></StrikeCounters>

        <JapanCarrierDropZones handleDragEnter={handleAirBoxDragEnter}></JapanCarrierDropZones>
        <USCarrierDropZones handleDragEnter={handleUSAirBoxDragEnter}></USCarrierDropZones>

        <StrikePanel side="Japan" enabled={japanStrikePanelEnabled} zIndex={90}></StrikePanel>
        <StrikePanel side="US" enabled={usStrikePanelEnabled} zIndex={1}></StrikePanel>
      </div>
    </>
  )
}

export default Board
