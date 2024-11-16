import React, { useState, useContext } from "react"
import "../../board.css"
import HexCommand from "../../../commands/HexCommand"
import Controller from "../../../controller/Controller"
import GlobalGameState from "../../../model/GlobalGameState"
import { BoardContext } from "../../../App"
import StrikeGroupPopUp from "./StrikeGroupPopUp"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { distanceBetweenHexes } from "../../HexUtils"

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
  setCurrentJapanHex,
  setPreviousPosition,
  previousPosition,
}) {
  const { setIsMoveable } = useContext(BoardContext)
  const { controller, fleetUnitUpdate } = useContext(BoardContext)

  const [position, setPosition] = useState({
    initial: true,
    left: counterData.position.left,
    top: counterData.position.top,
    currentHex: {},
  })

  const [smallOffset, setSmallOffset] = useState({
    x: 0,
    y: 0,
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
    if (fleetUnitUpdate.position.currentHex === HexCommand.OFFBOARD && !fleetUnitUpdate.name.includes("DMCV")) {
      return
    }
    hex = fleetUnitUpdate.position.currentHex
  }

  // This code for the test mode fleet unit updates (and game loads)
  if (
    fleetUnitUpdate &&
    counterData.name === fleetUnitUpdate.name &&
    (position.currentHex.q !== hex.q || position.currentHex.r !== hex.r)
  ) {
    hex = fleetUnitUpdate.position.currentHex

    // console.log("I am", fleetUnitUpdate.name, "side:", side, "-> FLEET UNIT UPDATE, move to", hex.row + ",", hex.col)

    if (side === GlobalUnitsModel.Side.US) {
      const locationDMCV = controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)
      const locationCSF = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
      const location1AF = controller.getFleetLocation("1AF-USMAP", GlobalUnitsModel.Side.US)

      let dmcv, csf, af1
      if (locationDMCV !== undefined  && locationDMCV !== HexCommand.OFFBOARD) {
        dmcv = distanceBetweenHexes(locationDMCV.currentHex, hex) === 0
      }
      if (locationCSF !== undefined) {
        csf = distanceBetweenHexes(locationCSF.currentHex, hex) === 0
      }
      if (location1AF !== undefined) {
        af1 = distanceBetweenHexes(location1AF.currentHex, hex) === 0
      }
      if (dmcv) {
        smallOffset.x = 7
        smallOffset.y = 7
      }
      if (csf) {
        smallOffset.x = 7
        smallOffset.y = 7
      }
      if (af1) {
        smallOffset.x = -7
        smallOffset.y = -7
      }
      if (!dmcv && !csf && !af1) {
        smallOffset.x = 0
        smallOffset.y = 0
      }
      setSmallOffset(smallOffset)
    } else {
      const locationDMCV = controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)
      const location1AF = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
      const locationMIF = controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)

      let dmcv, af1, mif
      if (locationDMCV !== undefined  && locationDMCV !== HexCommand.OFFBOARD) {
        dmcv = distanceBetweenHexes(locationDMCV.currentHex, hex) === 0
      }
      if (location1AF !== undefined) {
        af1 = distanceBetweenHexes(location1AF.currentHex, hex) === 0
      }
      if (locationMIF !== undefined) {
        mif = distanceBetweenHexes(locationMIF.currentHex, hex) === 0
      }
      if (dmcv) {
        smallOffset.x = -7
        smallOffset.y = -7
      }
      if (af1) {
        smallOffset.x = -7
        smallOffset.y = -7
      }
      if (mif) {
        smallOffset.x = -7
        smallOffset.y = -7
      }
      if (!dmcv && !af1 && !mif) {
        smallOffset.x = 0
        smallOffset.y = 0
      }
      setSmallOffset(smallOffset)
    }
    const newMap = new Map(previousPosition).set(counterData.name, position)
    setPreviousPosition(() => newMap)

    setPosition({
      initial: false,
      left: hex.x + counterData.position.left + counterData.offsets.x - smallOffset.x,
      top: hex.y + counterData.position.top + counterData.offsets.y + smallOffset.y,
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

    if (side === "US") {
      if (
        GlobalGameState.gamePhase !== GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING &&
        GlobalGameState.gamePhase !== GlobalGameState.PHASE.US_SETUP_FLEET &&
        GlobalGameState.gamePhase !== GlobalGameState.PHASE.RETREAT_US_FLEET
      ) {
        return
      }

      if (GlobalGameState.gamePhase === GlobalGameState.PHASE.RETREAT_US_FLEET) {
        if (counterData.name !== GlobalGameState.retreatFleet) {
          return
        }
      }
      const af1Location = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
      const locationDMCV = controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)
      const locationMIF = controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)

      let dmcv, af1, mif
      if (locationDMCV !== undefined && locationDMCV !== HexCommand.OFFBOARD) {
        dmcv = distanceBetweenHexes(locationDMCV.currentHex, hex) === 0
      }
      if (af1Location !== undefined) {
        af1 = distanceBetweenHexes(af1Location.currentHex, hex) === 0
      }
      if (locationMIF !== undefined) {
        mif = distanceBetweenHexes(locationMIF.currentHex, hex) === 0
      }
      if (af1) {
        smallOffset.x = 7
        smallOffset.y = 7
      }
      if (dmcv) {
        smallOffset.x = 7
        smallOffset.y = 7
      }
      if (mif) {
        smallOffset.x = 7
        smallOffset.y = 7
      }
      if (!dmcv && !af1 && !mif) {
        smallOffset.x = 0
        smallOffset.y = 0
      }
      setSmallOffset(smallOffset)
      let isThere = usRegions && usRegions.find((h) => h.q === hex.q && h.r === hex.r)
      if (!isThere) {
        return
      } else {
        GlobalGameState.usFleetMoved = true
        GlobalGameState.usFleetPlaced = true
        GlobalGameState.phaseCompleted = true
      }
    } else {
      if (GlobalGameState.gamePhase !== GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT) {
        return
      }

      // prevent 1AF and MIF ending up in same hex
      const locationMIF = controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)
      const location1AF = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)

      if (counterData.name === "1AF" && locationMIF !== undefined) {
        if (distanceBetweenHexes(locationMIF.currentHex, hex) === 0) {
          return
        }
      }
      if (counterData.name === "MIF") {
        if (distanceBetweenHexes(location1AF.currentHex, hex) === 0) {
          return
        }
      }
      const csfLocation = controller.getFleetLocation("CSF-JPMAP", GlobalUnitsModel.Side.JAPAN)
      const locationDMCV = controller.getFleetLocation("US-DMCV-JPMAP", GlobalUnitsModel.Side.JAPAN)
      // const locationMIFjp = controller.getFleetLocation("MIF-JPMAP", GlobalUnitsModel.Side.JAPAN)

      let dmcv, csf, mif
      if (locationDMCV !== undefined && locationDMCV !== HexCommand.OFFBOARD) {
        dmcv = distanceBetweenHexes(locationDMCV.currentHex, hex) === 0
      }
      if (csfLocation !== undefined) {
        csf = distanceBetweenHexes(csfLocation.currentHex, hex) === 0
      }
      if (locationMIF !== undefined) {
        mif = distanceBetweenHexes(locationMIF.currentHex, hex) === 0
      }
      if (csf) {
        smallOffset.x = -7
        smallOffset.y = -7
      }
      if (dmcv) {
        smallOffset.x = -7
        smallOffset.y = -7
      }
      if (mif) {
        smallOffset.x = -7
        smallOffset.y = -7
      }
      if (!dmcv && !csf && !mif) {
        smallOffset.x = 0
        smallOffset.y = 0
      }
      setSmallOffset(smallOffset)
      let isThere = jpRegions && jpRegions.find((h) => h.q === hex.q && h.r === hex.r)
      if (!isThere) {
        return
      }
      if (counterData.name === "1AF") {
        GlobalGameState.jpFleetPlaced = true
        GlobalGameState.jpFleetMoved = true
      }
      if (counterData.name === "MIF") {
        GlobalGameState.mifFleetPlaced = true
        GlobalGameState.mifFleetMoved = true
      }
      GlobalGameState.phaseCompleted = true
    }

    // console.log(
    //   `Fleet Unit ${counterData.name} moves to q:${hex.q}, r:${hex.r} => x:${currentHex.x},y:${currentHex.y}, row: ${currentHex.row}, col: ${currentHex.col}`
    // )

    const newMap = new Map(previousPosition).set(counterData.name, position)
    setPreviousPosition(() => newMap)
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
  }

  const handleMouseLeave = () => {
    setIsMoveable(false)
    setStrikeGroupPopup(side, false)
  }

  const handleClick = () => {}
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

  const fleets = controller.getAllFleetsInLocation(position, side, false)

  if (fleets.length === 1 && smallOffset.x !== 0) {
    // if -7, -7 do -x and +y
    if (smallOffset.x == -7) {
      if (counterData.name === "CSF-JPMAP") {
        setPosition({
          ...position,
          left: position.left + smallOffset.x,
          top: position.top - smallOffset.y,
        })
      } else {
        setPosition({
          ...position,
          left: position.left - smallOffset.x,
          top: position.top + smallOffset.y,
        })
      }
    } else {
      if (counterData.name === "CSF") {
        setPosition({
          ...position,
          left: position.left - smallOffset.x,
          top: position.top + smallOffset.y,
        })
      } else {
        setPosition({
          ...position,
          left: position.left + smallOffset.x,
          top: position.top - smallOffset.y,
        })
      }
    }
    smallOffset.x = 0
    smallOffset.y = 0
    setSmallOffset(smallOffset)
  }

  let zIndex
  if (counterData.side === GlobalUnitsModel.Side.US) {
    zIndex = 100
  } else {
    zIndex = 0
  }
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
            zIndex: zIndex,
          }}
          onDragEnter={handleDragEnter}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onDragEnd={handleDrop}
          onClick={handleClick}
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
