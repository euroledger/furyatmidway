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
    //   "counterData.gameTurnMoved=",
    //   counterData.gameTurnMoved,
    //   "counterData._gameTurnMoved=",
    //   counterData._gameTurnMoved
    // )

    const sg = controller.getStrikeGroupForBox(side, counterData.box)
    const locationOfCarrier = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)

    // Use 1AF

    const locationOfStrikeGroup = controller.getStrikeGroupLocation(counterData.name, side)
    if (
      (sg.gameTurnMoved !== undefined && sg.gameTurnMoved !== GlobalGameState.gameTurn) ||
      (locationOfStrikeGroup !== undefined &&
        counterData.airOpMoved !== undefined &&
        GlobalGameState.airOpJapan !== counterData.airOpMoved)
    ) {
      setCurrentHex(locationOfStrikeGroup)

      if (
        GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK &&
        counterData.name !== GlobalGameState.midwayAttackGroup
      ) {
        // other SGs on the map cannot move or attack during Midway attack
        setJapanMapRegions([])
        return
      }
      if (GlobalGameState.gamePhase !== GlobalGameState.PHASE.MIDWAY_ATTACK) {
        const locationOfEnemyCarrier = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
        const locationOfEnemyDMCV = controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)
        let distanceToDMCV, distanceToCSF

        // if enemy fleet within range of 3
        // SG must move to enemy
        const jpRegion = new Array()

        if (locationOfEnemyCarrier !== undefined && locationOfEnemyCarrier.currentHex !== undefined) {
          distanceToCSF = distanceBetweenHexes(locationOfStrikeGroup.currentHex, locationOfEnemyCarrier.currentHex)
          if (distanceToCSF <= 3) {
            // strike group can move to attack enemy carrier fleet
            jpRegion.push(locationOfEnemyCarrier.currentHex)
          }
        }
        if (locationOfEnemyDMCV !== undefined && locationOfEnemyDMCV.currentHex !== undefined) {
          distanceToDMCV = distanceBetweenHexes(locationOfStrikeGroup.currentHex, locationOfEnemyDMCV.currentHex)

          if (distanceToDMCV <= 3) {
            // strike group can move to attack enemy carrier fleet
            jpRegion.push(locationOfEnemyDMCV.currentHex)
          }
        }
        if (jpRegion.length === 0) {
          // no enemy fleet within range of the SG -> set to attacked
          // this will trigger all SG air units to RETURN-2 box
          counterData.attacked = true
        } else {
          setJapanMapRegions(jpRegion)
        }
      }
    } else {
      // First Air Op: Set Regions to be any hex within 2 of 1AF
      if (GlobalGameState.gameTurn === 3 && GlobalGameState.airOperationPoints["japan"] === 1) {
        // if last air op of GT3 prohibit any move other than to enemy fleet(s)
        const locationOfEnemyCarrier = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
        const locationOfEnemyDMCV = controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)
        let distanceToDMCV, distanceToCSF

        const jpRegion = new Array()

        if (locationOfEnemyCarrier !== undefined && locationOfEnemyCarrier.currentHex !== undefined) {
          distanceToCSF = distanceBetweenHexes(locationOfCarrier.currentHex, locationOfEnemyCarrier.currentHex)
          if (distanceToCSF <= 2) {
            // strike group can move to attack enemy carrier fleet
            jpRegion.push(locationOfEnemyCarrier.currentHex)
          }
        }
        if (locationOfEnemyDMCV !== undefined && locationOfEnemyDMCV.currentHex !== undefined) {
          distanceToDMCV = distanceBetweenHexes(locationOfCarrier.currentHex, locationOfEnemyDMCV.currentHex)

          if (distanceToDMCV <= 2) {
            // strike group can move to attack enemy carrier fleet
            jpRegion.push(locationOfEnemyDMCV.currentHex)
          }
        }
        setJapanMapRegions(jpRegion)
      } else {
        setCurrentHex(locationOfCarrier)
        if (locationOfCarrier) {
          jpRegion = allHexesWithinDistance(locationOfCarrier.currentHex, 2, true)
          setJapanMapRegions(jpRegion)
        }
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
      jpRegion = allHexesWithinDistance(locationOfCarrier.currentHex, 2, true)
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
    console.log("ARISE")
    // if naval strike group - use, counter CSF else use Midway
    // determine this from first air unit
    let usRegion = new Array(),
      locationOfCarrier
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
      (sg.gameTurnMoved !== undefined && sg.gameTurnMoved !== GlobalGameState.gameTurn) ||
      (locationOfStrikeGroup !== undefined &&
        counterData.airOpMoved !== undefined &&
        GlobalGameState.airOpUS !== counterData.airOpMoved)
    ) {
      // second air op for this SG, use movement allowance (3) and position of SG to determine regions
      const speed = controller.getSlowestUnitSpeedInStrikeGroup(counterData.box)

      setCurrentHex(locationOfStrikeGroup)
      const locationOfEnemyCarrier = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
      const locationOfEnemyDMCV = controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)
      const locationOfEnemyMIF = controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)
      let distanceToDMCV, distanceTo1AF, distanceToMIF
      if (locationOfEnemyCarrier !== undefined) {
        distanceTo1AF = distanceBetweenHexes(locationOfStrikeGroup.currentHex, locationOfEnemyCarrier.currentHex)
        if (distanceTo1AF <= speed) {
          // strike group can move to attack enemy carrier fleet
          usRegion.push(locationOfEnemyCarrier.currentHex)
        }
      }
      if (locationOfEnemyDMCV !== undefined && locationOfEnemyDMCV.currentHex !== undefined) {
        distanceToDMCV = distanceBetweenHexes(locationOfStrikeGroup.currentHex, locationOfEnemyDMCV.currentHex)
        if (distanceToDMCV <= speed) {
          // strike group can move to attack enemy carrier fleet
          usRegion.push(locationOfEnemyDMCV.currentHex)
        }
      }
      if (locationOfEnemyMIF !== undefined && locationOfEnemyMIF.currentHex !== undefined) {
        distanceToMIF = distanceBetweenHexes(locationOfStrikeGroup.currentHex, locationOfEnemyMIF.currentHex)
        if (distanceToMIF <= speed) {
          // strike group can move to attack enemy carrier fleet
          usRegion.push(locationOfEnemyDMCV.currentHex)
        }
      }
      if (usRegion.length === 0) {
        // no enemy fleet within range of the SG -> set to attacked
        // this will trigger all SG air units to RETURN-2 box

        counterData.attacked = true
      } else {
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
      if (GlobalGameState.gameTurn === 3 && GlobalGameState.airOperationPoints["us"] === 1) {
        const locationOfEnemyCarrier = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
        const locationOfEnemyDMCV = controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)
        const locationOfEnemyMIF = controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)
        let distanceToDMCV, distanceTo1AF, distanceToMIF
        if (locationOfEnemyCarrier !== undefined) {
          distanceTo1AF = distanceBetweenHexes(locationOfCarrier.currentHex, locationOfEnemyCarrier.currentHex)
          if (distanceTo1AF <= 2) {
            // strike group can move to attack enemy carrier fleet
            usRegion.push(locationOfEnemyCarrier.currentHex)
          }
        }
        if (locationOfEnemyDMCV !== undefined && locationOfEnemyDMCV.currentHex !== undefined) {
          distanceToDMCV = distanceBetweenHexes(locationOfCarrier.currentHex, locationOfEnemyDMCV.currentHex)
          if (distanceToDMCV <= 2) {
            // strike group can move to attack enemy carrier fleet
            usRegion.push(locationOfEnemyDMCV.currentHex)
          }
        }
        if (locationOfEnemyMIF !== undefined && locationOfEnemyMIF.currentHex !== undefined) {
          distanceToMIF = distanceBetweenHexes(locationOfCarrier.currentHex, locationOfEnemyMIF.currentHex)
          if (distanceToMIF <= 2) {
            // strike group can move to attack enemy carrier fleet
            usRegion.push(locationOfEnemyDMCV.currentHex)
          }
        }
      } else {
        setCurrentHex(locationOfCarrier)
        usRegion = allHexesWithinDistance(locationOfCarrier.currentHex, 2, true)
      }
      setUSMapRegions(usRegion)
    }
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
        setZIndex(() => zIndex + groups.length * 20)
      }
    } else {
      if (side === GlobalUnitsModel.Side.US) {
        setZIndex(() => zIndex + groups.length * 20)
      } else {
        setZIndex(() => 182)
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

  const handleMouseEnter = () => {
    if (GlobalGameState.sideWithInitiative !== side) {
      return
    }
   if (GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_JAPAN) {
      // rare occasion where SG is at sea from previous turn
      counterData.attacked = true
      return
    }

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
          draggabble="true"
          onDragStart={onDrag}
          onDragEnd={handleDrop}
          onClick={(e) => handleClick(e)}
        />
      </div>
    </>
  )
  //   });
}

export default StrikeCounter
