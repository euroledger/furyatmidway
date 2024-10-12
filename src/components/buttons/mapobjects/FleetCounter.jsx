import React, { useState, useContext } from "react"
import "../../board.css"
import HexCommand from "../../../commands/HexCommand"
import Controller from "../../../controller/Controller"
import GlobalGameState from "../../../model/GlobalGameState"
import { BoardContext } from "../../../App"
import StrikeGroupPopUp from "./StrikeGroupPopUp"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"

function FleetCounter({
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
  setCurrentJapanHex
}) {

 
  const { setIsMoveable } = useContext(BoardContext)
  const { controller, onDrag, onStop, fleetUnitUpdate } = useContext(BoardContext)

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

  function setStrikeGroupPopup(side, show, hex) {
    if (show === false || hex === undefined) {
      setShowPopup(false)
      return
    }
    setHexw(() => hex)
    const groups = controller.getAllStrikeGroupsInLocation(hex, side)
    setstrikeGroupsAtLocation(() => groups)

    let fleets=[]
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

  // This code for the test mode fleet unit updates
  if (
    fleetUnitUpdate &&
    counterData.name === fleetUnitUpdate.name &&
    (position.currentHex.q !== hex.q || position.currentHex.r !== hex.r)
  ) {
    hex = fleetUnitUpdate.position.currentHex

    // console.log("I am", fleetUnitUpdate.name, "side:", side, "-> FLEET UNIT UPDATE, move to", hex.row + ",", hex.col)
    setPosition({
      initial: false,
      left: hex.x + counterData.position.left + counterData.offsets.x,
      top: hex.y + counterData.position.top + counterData.offsets.y,
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
      },
    })
  }

  const handleDrop = (event) => {
    const hex = { q: currentHex.q, r: currentHex.r }

    if (side === "US") {
      let isThere = usRegions && usRegions.find((h) => h.q === hex.q && h.r === hex.r)
      if (!isThere) {
        return
      } else {
        GlobalGameState.usFleetMoved = true
        GlobalGameState.usFleetPlaced = true
      }
    } else {
      let isThere = jpRegions && jpRegions.find((h) => h.q === hex.q && h.r === hex.r)
      if (!isThere) {
        return
      }
      GlobalGameState.jpFleetPlaced = true
      GlobalGameState.jpFleetMoved = true
    }

    // console.log(
    //   `Fleet Unit ${counterData.name} moves to q:${hex.q}, r:${hex.r} => x:${currentHex.x},y:${currentHex.y}, row: ${currentHex.row}, col: ${currentHex.col}`
    // )

    setPosition({
      initial: false,
      left: currentHex.x + counterData.position.left + counterData.offsets.x,
      top: currentHex.y + counterData.position.top + counterData.offsets.y,
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

export default FleetCounter
