import React, { useContext, useState } from "react"
import "../../board.css"
import Controller from "../../../controller/Controller"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { BoardContext } from "../../../App"
import GlobalGameState from "../../../model/GlobalGameState"
import "./counter.css"
import { allHexesWithinDistance, hexesInTwoRegions, distanceBetweenHexes } from "../../HexUtils"
import HexCommand from "../../../commands/HexCommand"
import { setUpAirAttack } from "../../../controller/AirAttackHandler"

function StrikeCounter({ setStrikeGroupPopup, currentUSHex, currentJapanHex, counterData, side, index }) {
  const {
    controller,
    loading,
    setUSMapRegions,
    USMapRegions,
    setIsMoveable,
    setJapanMapRegions,
    japanMapRegions,
    strikeGroupUpdate,
    setCardNumber,
  } = useContext(BoardContext)
  const [currentHex, setCurrentHex] = useState({})

  const [zIndex, setZIndex] = useState(11) // TODO FIX FOR JAPAN
  const [japanZIndex, setJapanZIndex] = useState(11) // TODO FIX FOR JAPAN

  const [position, setPosition] = useState({
    initial: true,
    left: counterData.position.left,
    top: counterData.position.top,
    currentHex: HexCommand.OFFBOARD,
  })

  function resetJapanPosition(position) {
    setPosition({
      initial: true,
      left: position.left,
      top: position.top,
      currentHex: HexCommand.OFFBOARD,
    })
  }
  function setJapanPosition(hex) {
    setPosition({
      initial: false,
      left: hex.x + 157,
      top: hex.y + 190,
      currentHex: hex,
    })
    // console.log("\tname: ", counterData.name, "=>NEW POSITION=", position)
  }
  function resetUSPosition(position) {
    setPosition({
      left: position.left,
      top: position.top,
      currentHex: HexCommand.OFFBOARD,
    })
  }
  function setUSPosition(hex) {
    setPosition({
      initial: false,
      left: hex.x + 603,
      top: hex.y + 220,
      currentHex: hex,
    })
  }
  // STRIKE GROUP UPDATE CODE
  let hex = {}
  if (strikeGroupUpdate) {
    // if (strikeGroupUpdate.position.currentHex) {
    //   console.log("GOT A STRIKE UPDATE: ", strikeGroupUpdate)
    //   console.log("\t=>SG name=", strikeGroupUpdate.name)
    //   console.log("\t=>counter data name=", counterData.name)
    //   console.log("\t=>position=", position)
    //   console.log("\t=>position.currentHex=", position.currentHex)
    // }

    hex = strikeGroupUpdate.position.currentHex
    // console.log("\t=>hex=", hex)
  }
  // console.log("STRIKE GROUP", counterData.name, "location=", locationOfStrikeGroup )

  if (
    strikeGroupUpdate &&
    hex != undefined &&
    strikeGroupUpdate.name != "" &&
    counterData.name === strikeGroupUpdate.name &&
    ((strikeGroupUpdate.position.currentHex != undefined && position.currentHex.q !== hex.q) ||
      position.currentHex.r !== hex.r)
  ) {
    // console.log(
    //   "I am",
    //   strikeGroupUpdate.name,
    //   " -> STRIKE GROUP UPDATE, moved= ",
    //   strikeGroupUpdate.moved,
    //   "attacked =",
    //   strikeGroupUpdate.attacked,
    //   "strikeGroupUpdate.position.left=",
    //   strikeGroupUpdate.position.left,
    //   "strikeGroupUpdate.position.top=",
    //   strikeGroupUpdate.position.top,
    //   "strikeGroupUpdate.position.currentHex=",strikeGroupUpdate.position.currentHex
    // )

    if (side === GlobalUnitsModel.Side.US) {
      if (strikeGroupUpdate.position.currentHex === HexCommand.OFFBOARD) {
        resetUSPosition(strikeGroupUpdate.position)
      } else {
        setUSPosition(hex)
      }
    } else {
      if (strikeGroupUpdate.position.currentHex === HexCommand.OFFBOARD && position.initial !== true) {
        resetJapanPosition(strikeGroupUpdate.position)
      } else {
        setJapanPosition(hex)
      }
    }
    let from, to
    if (position.initial) {
      from = HexCommand.OFFBOARD
    } else {
      from = { currentHex: position.currentHex }
    }
    to = { currentHex: hex }
    const loading = strikeGroupUpdate.loading === false ? false : true

    controller.viewEventHandler({
      type: Controller.EventTypes.STRIKE_GROUP_MOVE,
      data: {
        initial: position.initial,
        counterData,
        from,
        to,
        side,
        loading,
        moved: true,
        attacked: strikeGroupUpdate.attacked,
      },
    })
    if (!loading && controller.checkForAirAttack(to, side)) {
      setUpAirAttack(controller, to, counterData, setCardNumber)
      GlobalGameState.attackingStrikeGroup = counterData
    }
  }

  function setJapanRegions() {
    let jpRegion

    // console.log(
    //   "GlobalGameState.airOpJapan",
    //   GlobalGameState.airOpJapan,
    //   "counterData.airOpMoved=",
    //   counterData.airOpMoved,
    //   "counterData.gemeTurnMoved=",
    //   counterData.gemeTurnMoved,
    //   "counterData._gemeTurnMoved=",
    //   counterData._gemeTurnMoved
    // )

    const sg = controller.getStrikeGroupForBox(side, counterData.box)
    const locationOfCarrier = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)

    // console.log("SG turn moved=", sg.gameTurnMoved)
    // Use 1AF

    const locationOfStrikeGroup = controller.getStrikeGroupLocation(counterData.name, side)
    if (
      (sg.gameTurnMoved !== undefined && sg.gameTurnMoved !== GlobalGameState.gameTurn) ||
      (locationOfStrikeGroup !== undefined &&
        counterData.airOpMoved !== undefined &&
        GlobalGameState.airOpJapan !== counterData.airOpMoved)
    ) {
      // second air op for this SG, use movement allowance (3) and position of SG to determine regions
      setCurrentHex(locationOfStrikeGroup)
      const locationOfEnemyCarrier = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
      const locationOfEnemyDMCV = controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)

      // if enemy fleet within range of 3
      // SG must move to enemy
      const jpRegion = new Array()
      if (locationOfEnemyCarrier === undefined && locationOfEnemyDMCV === undefined) {
        // strike group must return to "RETURN 2" space
        // Set SG to attacked - will trigger units to be moved to return 2
        counterData.attacked = true
      } else {
        if (locationOfEnemyCarrier !== undefined) {
          if (distanceBetweenHexes(locationOfStrikeGroup.currentHex, locationOfEnemyCarrier.currentHex) <= 3) {
            // strike group can move to attack enemy carrier fleet
            jpRegion.push(locationOfEnemyCarrier.currentHex)
          }
        }
        if (locationOfEnemyDMCV !== undefined) {
          if (distanceBetweenHexes(locationOfStrikeGroup.currentHex, locationOfEnemyDMCV.currentHex) <= 3) {
            // strike group can move to attack enemy carrier fleet
            jpRegion.push(locationOfEnemyDMCV.currentHex)
          }
        }
        setJapanMapRegions(jpRegion)
      }
    } else {
      // First Air Op: Set Regions to be any hex within 2 of 1AF
      setCurrentHex(locationOfCarrier)
      if (locationOfCarrier) {
        jpRegion = allHexesWithinDistance(locationOfCarrier.currentHex, 2, true)
        setJapanMapRegions(jpRegion)
      }
    }
    // If this is the first Midway AirOp and strike group is more than two hexes from Midway
    // ensure that SG moves to within two hexes of Midway
    const distanceToMidway = controller.getDistanceBetween1AFAndMidway()
    if (
      GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK &&
      GlobalGameState.midwayAirOp === 1 &&
      distanceToMidway > 2
    ) {
      const jpRegion2 = allHexesWithinDistance(Controller.MIDWAY_HEX.currentHex, 3, true)
      const hexes = hexesInTwoRegions(jpRegion, jpRegion2)
      setJapanMapRegions(hexes)
    }

    // If this is the second Midway AirOp ensure SG moves to Midway
    if (
      GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK &&
      (GlobalGameState.midwayAirOp === 2 || distanceToMidway <= 2)
    ) {
      const midway = [{ q: 6, r: 3 }]
      setJapanMapRegions(midway)
    }
  }
  function setUSRegions() {
    // if naval strike group - use, counter CSF else use Midway
    // determine this from first air unit
    let usRegion, locationOfCarrier
    // console.log(
    //   "GlobalGameState.airOpUS=",
    //   GlobalGameState.airOpUS,
    //   "counter data name:",
    //   counterData.name,
    //   "counterData.airOpMoved=",
    //   counterData.airOpMoved,
    //   "counterData.gameTurnMoved=",
    //   counterData.gameTurnMoved
    // )

    const locationOfStrikeGroup = controller.getStrikeGroupLocation(counterData.name, side)
    const sg = controller.getStrikeGroupForBox(side, counterData.box)

    if (
      (counterData.gemeTurnMoved !== undefined && counterData.gemeTurnMoved !== GlobalGameState.gameTurn) ||
      (locationOfStrikeGroup !== undefined &&
        counterData.airOpMoved !== undefined &&
        GlobalGameState.airOpUS !== counterData.airOpMoved)
    ) {
      // second air op for this SG, use movement allowance (3) and position of SG to determine regions
      const speed = controller.getSlowestUnitSpeedInStrikeGroup(counterData.box)

      setCurrentHex(locationOfStrikeGroup)
      const locationOfEnemyCarrier = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
      const locationOfEnemyDMCV = controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)

      // // if enemy fleet within range of (speed hexes calculated above)
      // // SG must move to enemy
      // if (locationOfEnemyCarrier !== undefined) {
      //   if (distanceBetweenHexes(locationOfStrikeGroup.currentHex, locationOfEnemyCarrier.currentHex) <= speed) {
      //     // strike group can move to attack enemy carrier fleet
      //     usRegion = [locationOfEnemyCarrier.currentHex]
      //     setUSMapRegions(usRegion)
      //   } else {
      //     // strike group must return to "RETURN 2" space
      //     // @TODO move SG counter offboard and mark Strike Units as moved
      //     console.log("@TODO enemy carrier is out of range, return SG to return 2 box")
      //     // Set SG to attacked - will trigger units to be moved to return 2
      //     counterData.attacked = true
      //     // sg.attacked = true
      //   }
      // }
      const usRegion = new Array()
      if (locationOfEnemyCarrier === undefined && locationOfEnemyDMCV === undefined) {
        // strike group must return to "RETURN 2" space
        // @TODO move SG counter offboard and mark Strike Units as moved
        // Set SG to attacked - will trigger units to be moved to return 2
        counterData.attacked = true
      } else {
        if (locationOfEnemyCarrier !== undefined) {
          if (distanceBetweenHexes(locationOfStrikeGroup.currentHex, locationOfEnemyCarrier.currentHex) <= speed) {
            // strike group can move to attack enemy carrier fleet
            usRegion.push(locationOfEnemyCarrier.currentHex)
          }
        }
        if (locationOfEnemyDMCV !== undefined) {
          if (distanceBetweenHexes(locationOfStrikeGroup.currentHex, locationOfEnemyDMCV.currentHex) <= speed) {
            // strike group can move to attack enemy carrier fleet
            usRegion.push(locationOfEnemyDMCV.currentHex)
          }
        }
        setUSMapRegions(usRegion)
      }
    } else {
      const unitsInGroup = controller.getAirUnitsInStrikeGroups(counterData.box)
      if (unitsInGroup[0].carrier === GlobalUnitsModel.Carrier.MIDWAY) {
        locationOfCarrier = Controller.MIDWAY_HEX
      } else {
        locationOfCarrier = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
      }
      if (!locationOfCarrier) {
        return
      }
      setCurrentHex(locationOfCarrier)
      usRegion = allHexesWithinDistance(locationOfCarrier.currentHex, 2, true)
      setUSMapRegions(usRegion)
    }
    // @TODO set US Regions when strike counter is on the map
  }
  const handleClick = (e) => {
    const sg = controller.getStrikeGroupForBox(side, counterData.box)
    if (sg.attacked) {
      return
    }

    if (side === GlobalUnitsModel.Side.US) {
      setUSRegions()
    } else {
      setJapanRegions()
    }
    if (position.initial) {
      return
    }

    const location = controller.getStrikeGroupLocation(counterData.name, side)
    const groups = controller.getAllStrikeGroupsInLocation(location, side)

    if (groups.length > 1) {
      if (side === GlobalUnitsModel.Side.US) {
        setZIndex(() => zIndex + groups.length * 20)
      } else {
        setJapanZIndex(() => zIndex + groups.length * 20)
      }
    }
    // 1. US
    // if in strike box -> use location of CSF Fleet
    // if on map -> use location of this counter
    // draw hexes around this location as drop zone

    // 2. Japan
    // if in strike box -> use location of 1AF Fleet
    // if on map -> use location of this counter
    // draw hexes around this location as drop zone
  } // end handleClick
  const handleDrop = (event) => {
    // setStrikeGroupPopup(side, false)
    const sg = controller.getStrikeGroupForBox(side, counterData.box)
    if (sg.attacked) {
      // if this strike group has attacked, disallow further movement for this air op
      return
    }

    // let from = { currentHex: position.currentHex }
    let from = HexCommand.OFFBOARD
    let to = { currentHex }
    if (side === GlobalUnitsModel.Side.US) {
      const hex = { q: currentUSHex.q, r: currentUSHex.r }

      let isThere = USMapRegions && USMapRegions.find((h) => h.q === hex.q && h.r === hex.r)
      if (!isThere) {
        return
      } else {
        if (index > 0) {
          currentUSHex.x += 6 * index
          currentUSHex.y -= 6 * index
        }
        setUSPosition(currentUSHex)
        if (position.initial) {
          from = HexCommand.OFFBOARD
        } else {
          from = { currentHex: position.currentHex }
        }
        to = { currentHex: currentUSHex }
        setUSMapRegions([])
        setCurrentHex(currentUSHex)
      }
    } else {
      const hex = { q: currentJapanHex.q, r: currentJapanHex.r }
      let isThere = japanMapRegions && japanMapRegions.find((h) => h.q === hex.q && h.r === hex.r)
      if (!isThere) {
        return
      } else {
        if (index > 0) {
          currentJapanHex.x += 6 * index
          currentJapanHex.y -= 6 * index
        }
        setJapanPosition(currentJapanHex)
        if (position.initial) {
          from = HexCommand.OFFBOARD
        } else {
          from = { currentHex: position.currentHex }
        }
        to = { currentHex: currentJapanHex }
      }
      setJapanMapRegions([])
      setCurrentHex(currentJapanHex)
    }

    controller.viewEventHandler({
      type: Controller.EventTypes.STRIKE_GROUP_MOVE,
      data: {
        initial: position.initial,
        counterData,
        from,
        to,
        side,
        loading,
      },
    })
    if (!loading && controller.checkForAirAttack(to, side)) {
      setUpAirAttack(controller, to, counterData, setCardNumber)
      GlobalGameState.attackingStrikeGroup = counterData
    }

    // Since air units cannot move again after being added to a strike group,
    // once that strike group has moved, we should rotate the air counters back to normal position
  }
  const zx = side === GlobalUnitsModel.Side.JAPAN ? 93 : 11

  const handleMouseEnter = () => {
    if (
      GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS ||
      GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK
    ) {
      setIsMoveable(true)
      const sg = controller.getStrikeGroupForBox(side, counterData.box)
      if (!sg.attacked) {
        if (side === GlobalUnitsModel.Side.JAPAN) {
          setJapanRegions()
        } else {
          setUSRegions()
        }
      }
    }
    // if (!sg.attacked) {
    const location = controller.getStrikeGroupLocation(counterData.name, side)
    if (location && location.currentHex !== HexCommand.OFFBOARD) {
      setStrikeGroupPopup(side, true, location)
    }
    // }
  }

  const onDrag = () => {
    setIsMoveable(true)
    const sg = controller.getStrikeGroupForBox(side, counterData.box)
    if (sg.attacked) {
      return
    }
    if (side === GlobalUnitsModel.Side.JAPAN) {
      setJapanRegions()
    } else {
      setUSRegions()
    }
  }

  const handleMouseLeave = () => {
    setIsMoveable(false)
    setStrikeGroupPopup(side, false)
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.AIR_OPERATIONS) {
      if (side === GlobalUnitsModel.Side.JAPAN) {
        setJapanMapRegions([])
      } else {
        setUSMapRegions([])
      }
    }
  }
  let disp = "block"

  const sg = controller.getStrikeGroupForBox(side, counterData.box)
  if (
    sg.attacked === true || 
    GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT ||
    GlobalGameState.gamePhase === GlobalGameState.PHASE.US_FLEET_MOVEMENT ||
    controller.getAirUnitsInStrikeGroups(sg.box).length === 0
  ) {
    disp = "none"
  }
  return (
    <>
      <div>
        <input
          type="image"
          src={counterData.image}
          style={{
            position: "absolute",
            width: counterData.width,
            display: disp,
            left: position.left,
            top: position.top,
            zIndex: zIndex,
            "&:focus": {
              borderRadius: "2px",
              border: "3px solid rgb(197,9,9)",
            },
          }}
          id="saveForm2"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          // onBlur={handleFocusOut}
          draggabble="true"
          onDragStart={onDrag}
          onDragEnd={handleDrop}
          onClick={(e) => handleClick(e)}
          // onContextMenu={(e) => handleRightClick(e)}
          zIndex={side === GlobalUnitsModel.Side.JAPAN ? 91 : 155}
        />
      </div>
    </>
  )
  //   });
}

export default StrikeCounter
