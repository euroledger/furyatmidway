import React, { useState, useContext } from "react"
import "../../board.css"
import HexCommand from "../../../commands/HexCommand"
import Controller from "../../../controller/Controller"
import GlobalGameState from "../../../model/GlobalGameState"
import { BoardContext } from "../../../App"
import StrikeGroupPopUp from "./StrikeGroupPopUp"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { distanceBetweenHexes } from "../../HexUtils"
import USOffMapFleetBoxOffsets from "../../draganddrop/USOffMapFleetBoxOffsets"
import JapanOffMapFleetBoxOffsets from "../../draganddrop/JapanOffMapFleetBoxOffsets"
import { testForOffMapBoxesJapan } from "../../../PlayerState/StateUtils"

function DMCVFleetCounter({
  id,
  currentHex,
  counterData,
  usRegions,
  jpRegions,
  enabled,
  side,
  getFleetBox,
  setFleetBox,
  currentMouseHex,
  setCurrentMouseHex,
  setCurrentUSHex,
  setCurrentJapanHex,
  setPreviousPosition,
  previousPosition,
}) {
  const {
    setIsMoveable,
    setDmcvCarrierSelectionPanelShow,
    enabledJapanFleetBoxes,
    enabledUSFleetBoxes,
    setEnabledJapanFleetBoxes,
    setEnabledUSFleetBoxes,
  } = useContext(BoardContext)
  const { controller, fleetUnitUpdate } = useContext(BoardContext)

  const [smallOffset, setSmallOffset] = useState({
    x: 0,
    y: 0,
  })
  const [position, setPosition] = useState({
    initial: true,
    left: counterData.position.left,
    top: counterData.position.top,
    currentHex: HexCommand.OFFBOARD,
  })

  const [showPopup, setShowPopup] = useState(false)
  const [popUpPosition, setPopUpPosition] = useState({})

  const [strikeGroupsAtLocation, setstrikeGroupsAtLocation] = useState([])
  const [fleetsAtLocation, setFleetsAtLocation] = useState([])
  const [hexw, setHexw] = useState(currentMouseHex)

  function setStrikeGroupPopup(side, show, hex) {
    if (show === false || hex === undefined || position.currentHex.boxName === HexCommand.FLEET_BOX) {
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

  function resetPosition() {
    const newPos = {
      left: counterData.position.left,
      top: counterData.position.top,
      currentHex: HexCommand.OFFBOARD,
    }
    setPosition(() => newPos)
  }
  let hex = {}

  if (fleetUnitUpdate && counterData.name === fleetUnitUpdate.name && fleetUnitUpdate.position.currentHex) {
    const test1 = position.currentHex && position.currentHex.boxName !== HexCommand.FLEET_BOX
    const test2 = fleetUnitUpdate.position.currentHex.boxName === HexCommand.FLEET_BOX
    const fleetBox = fleetUnitUpdate.position.currentHex.boxIndex
    if (test1 && test2) {
      console.log(">>>>>>>>>>>> FLEET BOLLOCKS")
      let from
      if (fleetUnitUpdate.side === GlobalUnitsModel.Side.JAPAN) {
        // set new position according to Japan Fleet Box (index boxIndex) offsets
        const newMap = new Map(previousPosition).set(counterData.name, position)
        setPreviousPosition(() => newMap)

        const left = JapanOffMapFleetBoxOffsets[fleetBox].left
        const top = JapanOffMapFleetBoxOffsets[fleetBox].top

        from = { currentHex: position.currentHex }

        console.log("ENABLE FLEET BOXES!")
        setEnabledJapanFleetBoxes(() => true)
        setPosition({
          initial: false,
          left: left + "%",
          top: top + "%",
          currentHex: {
            boxName: HexCommand.FLEET_BOX,
            boxIndex: fleetBox,
          },
        })
      } else if (fleetUnitUpdate.side === GlobalUnitsModel.Side.US) {
        // set new position according to Japan Fleet Box (index boxIndex) offsets
        const newMap = new Map(previousPosition).set(counterData.name, position)
        setPreviousPosition(() => newMap)

        const left = USOffMapFleetBoxOffsets[fleetBox].left
        const top = USOffMapFleetBoxOffsets[fleetBox].top

        from = { currentHex: position.currentHex }

        setEnabledUSFleetBoxes(() => true)
        setPosition({
          initial: false,
          left: left + "%",
          top: top + "%",
          currentHex: {
            boxName: HexCommand.FLEET_BOX,
            boxIndex: fleetBox,
          },
        })
      }
      controller.viewEventHandler({
        type: Controller.EventTypes.FLEET_SETUP,
        data: {
          initial: position.initial,
          id: counterData.name,
          from,
          to: {
            boxName: HexCommand.FLEET_BOX,
            boxIndex: fleetBox,
          },
          box: fleetBox,
          side: fleetUnitUpdate.side,
        },
      })
    }
  }
  // This code for the fleet unit updates (incl. game loads)
  // console.log("counterData.name=", counterData.name, "fleetUnitUpdate.name=",fleetUnitUpdate.name)
  if (fleetUnitUpdate && fleetUnitUpdate.position.currentHex !== HexCommand.OFFBOARD) {
    hex = fleetUnitUpdate.position.currentHex
  }

  if (
    fleetUnitUpdate &&
    counterData.name === fleetUnitUpdate.name &&
    fleetUnitUpdate.position.currentHex === HexCommand.OFFBOARD
  ) {
    console.log(
      "I am",
      fleetUnitUpdate.name,
      "side:",
      side,
      "-> FLEET UNIT CURRENT POSITION=",
      position.currentHex,
      "-> move to",
      fleetUnitUpdate.position.currentHex
    )
    if (
      position.currentHex !== HexCommand.OFFBOARD &&
      fleetUnitUpdate.position.currentHex.boxName !== HexCommand.FLEET_BOX
    ) {
      resetPosition()
      const to = HexCommand.OFFBOARD
      const from = position.currentHex

      // No need to log JPMAP or USMAP removal of DMCV Fleet
      controller.viewEventHandler({
        type: Controller.EventTypes.FLEET_SETUP,
        data: {
          initial: false,
          id: counterData.name,
          from,
          to,
          side,
          loading: false,
        },
      })
    }
  } else {
    // This code for the test mode fleet unit updates (and game loads and moving fleets on opponent's map)
    if (
      fleetUnitUpdate &&
      counterData.name === fleetUnitUpdate.name &&
      (position.currentHex.q !== hex.q || position.currentHex.r !== hex.r) &&
      fleetUnitUpdate.position.currentHex.boxName !== HexCommand.FLEET_BOX
    ) {
      hex = fleetUnitUpdate.position.currentHex

      let smallOffset = {
        x: 0,
        y: 0,
      }
      // console.log("I am", fleetUnitUpdate.name, "side:", side, "-> FLEET UNIT UPDATE, move to", hex.row + ",", hex.col)
      if (side === GlobalUnitsModel.Side.US) {
        const location1AF = controller.getFleetLocation("1AF-USMAP", GlobalUnitsModel.Side.US)
        const locationCSF = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
        const locationDMCV = controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)

        let af1, csf, dmcv
        if (locationCSF !== undefined && locationCSF.currentHex !== undefined) {
          csf = distanceBetweenHexes(locationCSF.currentHex, hex) === 0
        }
        if (location1AF !== undefined && location1AF.currentHex !== undefined) {
          af1 = distanceBetweenHexes(location1AF.currentHex, hex) === 0
        }
        if (locationDMCV !== undefined && locationDMCV.currentHex !== undefined) {
          dmcv = distanceBetweenHexes(locationDMCV.currentHex, hex) === 0
        }
        if (af1) {
          smallOffset.x = -7
          smallOffset.y = -7
        }
        if (csf) {
          smallOffset.x = -7
          smallOffset.y = -7
        }
        if (dmcv) {
          smallOffset.x = -7
          smallOffset.y = -7
        }
        if (!csf && !af1 && !dmcv) {
          smallOffset.x = 0
          smallOffset.y = 0
        }
        setSmallOffset(smallOffset)
      } else {
        const af1Location = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
        const locationDMCV = controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)
        const locationMIF = controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)

        let csf, dmcv, mif
        if (locationDMCV !== undefined && locationDMCV.currentHex !== undefined) {
          dmcv = distanceBetweenHexes(locationDMCV.currentHex, hex) === 0
        }
        if (af1Location !== undefined && af1Location.currentHex !== undefined) {
          csf = distanceBetweenHexes(af1Location.currentHex, hex) === 0
        }
        if (locationMIF !== undefined && locationMIF.currentHex !== undefined) {
          mif = distanceBetweenHexes(locationMIF.currentHex, hex) === 0
        }
        if (csf) {
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
        if (!dmcv && !csf && !mif) {
          smallOffset.x = 0
          smallOffset.y = 0
        }
        setSmallOffset(smallOffset)
      }

      const newMap = new Map(previousPosition).set(counterData.name, position)
      setPreviousPosition(() => newMap)

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
      setPreviousPosition(() => newMap)
    }
  }

  const dropIntoOffMapFleetBox = (fleetBox, side) => {
    if (side === GlobalUnitsModel.Side.JAPAN) {
      if (!GlobalGameState.jpDMCVFleetPlaced) {
        setDmcvCarrierSelectionPanelShow(true)
        GlobalGameState.jpDMCVFleetPlaced = true
      }
    } else {
      if (!GlobalGameState.usDMCVFleetPlaced) {
        setDmcvCarrierSelectionPanelShow(true)
        GlobalGameState.usDMCVFleetPlaced = true
      }
    }
    const newMap = new Map(previousPosition).set(counterData.name, position)
    setPreviousPosition(() => newMap)

    let left, top

    if (side === GlobalUnitsModel.Side.US) {
      left = USOffMapFleetBoxOffsets[fleetBox].left + "%"
      top = USOffMapFleetBoxOffsets[fleetBox].top + "%"
    } else {
      left = JapanOffMapFleetBoxOffsets[fleetBox].left + "%"
      top = JapanOffMapFleetBoxOffsets[fleetBox].top + "%"
    }

    let from = { currentHex: position.currentHex }

    setPosition({
      initial: false,
      left: left,
      top: top,
      currentHex: {
        boxName: HexCommand.FLEET_BOX,
        boxIndex: fleetBox,
      },
    })
    controller.viewEventHandler({
      type: Controller.EventTypes.FLEET_SETUP,
      data: {
        initial: position.initial,
        id: counterData.name,
        from,
        to: {
          boxName: HexCommand.FLEET_BOX,
          boxIndex: fleetBox,
        },
        box: fleetBox,
        side,
      },
    })
  }
  const handleDrop = (event) => {
    const fleetBox = getFleetBox()
    if (fleetBox !== -1) {
      if (
        counterData.side === GlobalUnitsModel.Side.US &&
        GlobalGameState.gamePhase !== GlobalGameState.PHASE.US_DMCV_FLEET_MOVEMENT_PLANNING
      ) {
        return
      }
      if (
        counterData.side === GlobalUnitsModel.Side.JAPAN &&
        GlobalGameState.gamePhase !== GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT
      ) {
        return
      }
      // Ensure fleet is eligible to go into fleet box      
      if (counterData.side === GlobalUnitsModel.Side.JAPAN) {
        if (testForOffMapBoxesJapan()) {
          dropIntoOffMapFleetBox(fleetBox, side)
        } 
      } else {
        // TODO test for offfmap boxes US
        dropIntoOffMapFleetBox(fleetBox, side)
      }

      return
    }
    const hex = { q: currentHex.q, r: currentHex.r }

    let smallOffset = {
      x: 0,
      y: 0,
    }
    if (side === "US") {
      if (
        GlobalGameState.gamePhase !== GlobalGameState.PHASE.US_DMCV_FLEET_MOVEMENT_PLANNING &&
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
      if (locationDMCV !== undefined && locationDMCV.currentHex !== undefined) {
        dmcv = distanceBetweenHexes(locationDMCV.currentHex, hex) === 0
      }
      if (af1Location !== undefined && af1Location.currentHex !== undefined) {
        af1 = distanceBetweenHexes(af1Location.currentHex, hex) === 0
      }
      if (locationMIF !== undefined && locationMIF.currentHex !== undefined) {
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
        if (GlobalGameState.usDMCVFleetPlaced) {
          GlobalGameState.usDMCVFleetMoved = true
        } else {
          setDmcvCarrierSelectionPanelShow(true)
          GlobalGameState.usDMCVFleetPlaced = true
        }
        GlobalGameState.phaseCompleted = true
      }
      // const csfLocation = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
      // if (distanceBetweenHexes(csfLocation.currentHex, hex) === 0) {
      //   smallOffset.x = 7
      //   smallOffset.y = 7
      // }
    } else {
      if (GlobalGameState.gamePhase !== GlobalGameState.PHASE.JAPAN_DMCV_FLEET_MOVEMENT) {
        return
      }
      const csfLocation = controller.getFleetLocation("CSF-JPMAP", GlobalUnitsModel.Side.JAPAN)
      const locationDMCV = controller.getFleetLocation("US-DMCV-JPMAP", GlobalUnitsModel.Side.JAPAN)
      let dmcv, csf
      if (locationDMCV !== undefined && locationDMCV.currentHex !== undefined) {
        dmcv = distanceBetweenHexes(locationDMCV.currentHex, hex) === 0
      }
      if (csfLocation !== undefined && csfLocation.boxName !== HexCommand.FLEET_BOX) {
        csf = distanceBetweenHexes(csfLocation.currentHex, hex) === 0
      }
      if (csf) {
        smallOffset.x = -7
        smallOffset.y = -7
      }
      if (dmcv) {
        smallOffset.x = -7
        smallOffset.y = -7
      }
      if (!dmcv && !csf) {
        smallOffset.x = 0
        smallOffset.y = 0
      }
      setSmallOffset(smallOffset)
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

    // const af1Location = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
    // if (distanceBetweenHexes(af1Location.currentHex, hex) === 0) {
    //   smallOffset.x = 7
    //   smallOffset.y = 7
    // }
    // const usDmcvLocation = controller.getFleetLocation("CSF-JPMAP", GlobalUnitsModel.Side.JAPAN)
    // if (distanceBetweenHexes(usDmcvLocation.currentHex, hex) === 0) {
    //   smallOffset.x = 7
    //   smallOffset.y = 7
    // } else {
    //   // if (smallOffset.x === 7) {
    //   smallOffset.x = 0
    //   smallOffset.y = 0
    //   // }
    // }

    // setSmallOffset(smallOffset)
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
    setPreviousPosition(() => newMap)
  }

  const handleMouseEnter = () => {
    setFleetBox(() => -1)
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

  let zIndex
  if (counterData.side === GlobalUnitsModel.Side.US) {
    zIndex = 100
  } else {
    zIndex = 93
  }
  const fleets = controller.getAllFleetsInLocation(position, side, false)
  if (fleets.length === 1 && smallOffset.x !== 0) {
    // if -7, -7 do -x and +y
    if (smallOffset.x == -7) {
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
    smallOffset.x = 0
    smallOffset.y = 0
    setSmallOffset(smallOffset)
  }
  if (enabled) {
    if (position.currentHex && position.currentHex.boxName === HexCommand.FLEET_BOX) {
      if (side === GlobalUnitsModel.Side.JAPAN) {
        enabled = enabledJapanFleetBoxes
      }
      if (side === GlobalUnitsModel.Side.US) {
        enabled = enabledUSFleetBoxes
      }
    }
  }
  const cdata = {
    side: counterData.name.includes("USMAP") ? GlobalUnitsModel.Side.US : GlobalUnitsModel.Side.JAPAN,
  }
  if (counterData.name === "US-DMCV") {
    cdata.side = GlobalUnitsModel.Side.US
  }

  return (
    <div>
      {enabled && (
        <input
          hidden={GlobalGameState.hide(cdata)}
          type="image"
          src={counterData.image}
          style={{
            zIndex: zIndex,
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
