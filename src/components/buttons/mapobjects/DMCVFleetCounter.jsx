import React, { useState, useContext } from "react"
import "../../board.css"
import HexCommand from "../../../commands/HexCommand"
import Controller from "../../../controller/Controller"
import GlobalGameState from "../../../model/GlobalGameState"
import { BoardContext } from "../../../App"
import StrikeGroupPopUp from "./StrikeGroupPopUp"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { allHexesWithinDistance, distanceBetweenHexes } from "../../HexUtils"

function DMCVFleetCounter({
  id,
  currentHex,
  counterData,
  usRegions,
  jpRegions,
  enabled,
  side,
  currentMouseHex,
  setCurrentMouseHex,
  setCurrentUSHex,
  setCurrentJapanHex,
}) {
  const { setIsMoveable, setDmcvCarrierSelectionPanelShow } = useContext(BoardContext)
  const { controller, onDrag, onStop, fleetUnitUpdate, setUSMapRegions } = useContext(BoardContext)

  const [position, setPosition] = useState({
    initial: true,
    left: counterData.position.left,
    top: counterData.position.top,
    currentHex: {},
  })

  const [showPopup, setShowPopup] = useState(false)
  const [popUpPosition, setPopUpPosition] = useState({})

  const [strikeGroupsAtLocation, setstrikeGroupsAtLocation] = useState([])
  const [fleetsAtLocation, setFleetsAtLocation] = useState([])
  const [hexw, setHexw] = useState(currentMouseHex)

  const setUsDMCVRegions = () => {
    // if DMCV is on the map, region it can move to is all hexes within 1 hex of its current location
    if (GlobalGameState.usDMCVFleetPlaced && !GlobalGameState.usDMCVFleetMoved) {
      const dmcvLocation = controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)
      const usRegion = allHexesWithinDistance(dmcvLocation.currentHex, 1, true)
      setUSMapRegions(usRegion)
    } else {
      const region = new Array()
      // initial placement - must be in same hex as CSF
      const csfLocation = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
      region.push(csfLocation.currentHex)
      setUSMapRegions(region)
    }
  }
  function setStrikeGroupPopup(side, show, hex) {
    if (show === false || hex === undefined) {
      setShowPopup(false)
      return
    }
    setHexw(() => hex)
    const groups = controller.getAllStrikeGroupsInLocation(hex, side)
    setstrikeGroupsAtLocation(() => groups)

    let fleets = []
    fleets = controller.getAllFleetsInLocation(hex, side)
    setFleetsAtLocation(() => fleets)

    if (groups.length > 0 || fleets.length > 0) {
      setShowPopup(true)
      setPopUpPosition(() => hex.currentHex)
    } else {
      setShowPopup(false)
    }

    setCurrentMouseHex({})
  }
  let hex = {}
  if (fleetUnitUpdate) {
    hex = fleetUnitUpdate.position.currentHex
  }

  // This code for the fleet unit updates (incl. game loads)
  if (
    fleetUnitUpdate &&
    counterData.name === fleetUnitUpdate.name &&
    (position.currentHex.q !== hex.q || position.currentHex.r !== hex.r)
  ) {
    hex = fleetUnitUpdate.position.currentHex

    let smallOffset = {
      x: 0,
      y: 0,
    }
    console.log("I am", fleetUnitUpdate.name, "side:", side, "-> FLEET UNIT UPDATE, move to", hex.row + ",", hex.col)
    if (side === GlobalUnitsModel.Side.US) {
      const csfLocation = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
      if (distanceBetweenHexes(csfLocation.currentHex, hex) === 0) {
        smallOffset.x = 7
        smallOffset.y = 7
      }
    } else {
      const af1Location = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
      if (distanceBetweenHexes(af1Location.currentHex, hex) === 0) {
        smallOffset.x = 7
        smallOffset.y = 7
      }
    }
    setPosition({
      initial: false,
      left: hex.x + counterData.position.left + counterData.offsets.x + smallOffset.x,
      top: hex.y + counterData.position.top + counterData.offsets.y - smallOffset.y,
      currentHex: hex,
    })

    let from = {
      currentHex: position.currentHex,
    }
    let to = { currentHex: hex }
    if (position.initial) {
      from = HexCommand.OFFBOARD
    }
    controller.viewEventHandler({
      type: Controller.EventTypes.FLEET_SETUP,
      data: {
        initial: position.initial,
        id: counterData.name,
        from,
        to,
        side,
        loading: true,
      },
    })
  }

  const handleDrop = (event) => {
    const hex = { q: currentHex.q, r: currentHex.r }

    let smallOffset = {
      x: 0,
      y: 0,
    }
    if (side === "US") {
      let isThere = usRegions && usRegions.find((h) => h.q === hex.q && h.r === hex.r)
      if (!isThere) {
        return
      } else {
        if (GlobalGameState.usDMCVFleetPlaced) {
          GlobalGameState.usDMCVFleetMoved = true
        } else {
          setDmcvCarrierSelectionPanelShow(true)
          GlobalGameState.usDMCVFleetPlaced = true
        }
        GlobalGameState.phaseCompleted = true
      }
      const csfLocation = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
      if (distanceBetweenHexes(csfLocation.currentHex, hex) === 0) {
        smallOffset.x = 7
        smallOffset.y = 7
      }
    } else {
      let isThere = jpRegions && jpRegions.find((h) => h.q === hex.q && h.r === hex.r)
      if (!isThere) {
        return
      }
      if (GlobalGameState.jpDMCVFleetPlaced) {
        GlobalGameState.jpDMCVFleetMoved = true
      } else {
        setDmcvCarrierSelectionPanelShow(true)
        GlobalGameState.jpDMCVFleetPlaced = true
      }
      GlobalGameState.phaseCompleted = true
    }

    const af1Location = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
    if (distanceBetweenHexes(af1Location.currentHex, hex) === 0) {
      smallOffset.x = 7
      smallOffset.y = 7
    }

    // console.log(
    //   `Fleet Unit ${counterData.name} moves to q:${hex.q}, r:${hex.r} => x:${currentHex.x},y:${currentHex.y}, row: ${currentHex.row}, col: ${currentHex.col}`
    // )

    setPosition({
      initial: false,
      left: currentHex.x + counterData.position.left + counterData.offsets.x + smallOffset.x,
      top: currentHex.y + counterData.position.top + counterData.offsets.y - smallOffset.y,
      currentHex,
    })

    let from = { currentHex: position.currentHex }
    let to = { currentHex }
    if (position.initial) {
      from = HexCommand.OFFBOARD
    }

    controller.viewEventHandler({
      type: Controller.EventTypes.FLEET_SETUP,
      data: {
        initial: position.initial,
        id,
        from,
        to,
        side,
      },
    })
  }

  const handleMouseEnter = () => {
    setIsMoveable(true)
    const location = controller.getFleetLocation(counterData.name, side)
    setStrikeGroupPopup(side, true, location)
    // if (
    //   side === GlobalUnitsModel.Side.US &&
    //   GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
    // ) {
    //   // setUsDMCVRegions()
    // } else {
    // }
  }

  const handleMouseLeave = () => {
    setIsMoveable(false)
    setStrikeGroupPopup(side, false)
  }
  const handleDragEnter = () => {
    const location = controller.getFleetLocation(counterData.name, side)

    if (!location) {
      return // (fleet could be OFFBOARD)
    }

    if (side === GlobalUnitsModel.Side.US) {
      setCurrentUSHex(location.currentHex)
    } else {
      setCurrentJapanHex(location.currentHex)
    }
  }

  //  if (side !== GlobalGameState.sideWithInitiative) {
  //   return <></>
  // }
  return (
    <div>
      {enabled && (
        <input
          type="image"
          src={counterData.image}
          style={{
            position: "absolute",
            width: counterData.width,
            left: position.left,
            top: position.top,
          }}
          onDragEnter={handleDragEnter}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onDragEnd={handleDrop}
          // onClick={handleClick}
        />
      )}
      {showPopup && (
        <StrikeGroupPopUp
          strikeGroup={strikeGroupsAtLocation}
          fleetUnits={fleetsAtLocation}
          side={side}
          popUpPosition={popUpPosition}
          hex={hexw}
        ></StrikeGroupPopUp>
      )}
    </div>
  )
}

export default DMCVFleetCounter
