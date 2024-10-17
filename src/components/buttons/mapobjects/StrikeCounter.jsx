import React, { useContext, useState } from "react"
import "../../board.css"
import Controller from "../../../controller/Controller"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { BoardContext } from "../../../App"
import GlobalGameState from "../../../model/GlobalGameState"
import "./counter.css"
import { allHexesWithinDistance, hexesInTwoRegions, distanceBetweenHexes } from "../../HexUtils"
import HexCommand from "../../../commands/HexCommand"

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

  function setJapanPosition(hex) {
    setPosition({
      initial: false,
      left: hex.x + 157,
      top: hex.y + 190,
      currentHex: hex,
    })
  }

  function setJapanOffBoardPosition(position) {
    setPosition({
      initial: true,
      left: position.left,
      top: position.top,
    })
  }
  function setUSOffBoardPosition(position) {
    setPosition({
      initial: true,
      left: position.left,
      top: position.top,
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
    if (strikeGroupUpdate.position.currentHex) {
      // console.log("GOT A STRIKE UPDATE: ", strikeGroupUpdate)
      // console.log("\t=>SG name=", strikeGroupUpdate.name)
      // console.log("\t=>counter data name=", counterData.name)
      // console.log("\t=>position=", position)
      // console.log("\t=>position.currentHex=", position.currentHex)
    }

    hex = strikeGroupUpdate.position.currentHex
    // console.log("\t=>hex=", hex)
  }
  // const locationOfStrikeGroup = controller.getStrikeGroupLocation(counterData.name, side)

  // if (side === GlobalUnitsModel.Side.US && counterData.attacked) {
  //   console.log("STRIKE GROUP", counterData.name, "HAS ATTACKED, location =", locationOfStrikeGroup)
  // } else {
  //   console.log("STRIKE GROUP", counterData.name, "HAS NOT ATTACKED, location =", locationOfStrikeGroup)
  // }
  // console.log("*********** UPDATE=", strikeGroupUpdate, "hex=", hex)
  if (strikeGroupUpdate && strikeGroupUpdate.name != "" && counterData.name === strikeGroupUpdate.name) {
    if (
      hex === undefined &&
      position.initial !== true &&
      strikeGroupUpdate.position.left !== position.left &&
      strikeGroupUpdate.position.top !== position.top
    ) {
      console.log("I am", strikeGroupUpdate.name, " -> STRIKE GROUP TO OFFBOARD UPDATE= ", strikeGroupUpdate)

      if (side === GlobalUnitsModel.Side.US) {
        setUSOffBoardPosition(strikeGroupUpdate.position)
       } else {
        setJapanOffBoardPosition(strikeGroupUpdate.position)
      }
    } else {
      if (
        (strikeGroupUpdate.position.currentHex !== undefined && position.currentHex.q !== hex.q) ||
        (strikeGroupUpdate.position.currentHex !== undefined && position.currentHex.r !== hex.r)
      ) {
        console.log("I am", strikeGroupUpdate.name, " -> STRIKE NORMAL UPDATE= ", strikeGroupUpdate)

        if (side === GlobalUnitsModel.Side.US) {
          setUSPosition(hex)
        } else {
          setJapanPosition(hex)
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
      }
    }
  }

  function setJapanRegions() {
    let jpRegion

    // console.log(
    //   "GlobalGameState.airOpJapan",
    //   GlobalGameState.airOpJapan,
    //   "counterData.airOpMoved=",
    //   counterData.airOpMoved
    // )
    // Use 1AF
    if (counterData.airOpMoved !== undefined && GlobalGameState.airOpJapan !== counterData.airOpMoved) {
      // second air op for this SG, use movement allowance (3) and position of SG to determine regions
      const locationOfStrikeGroup = controller.getStrikeGroupLocation(counterData.name, side)

      setCurrentHex(locationOfStrikeGroup)
      const locationOfEnemyCarrier = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)

      // if enemy fleet within range of 3
      // SG must move to enemy
      if (locationOfStrikeGroup !== undefined && locationOfEnemyCarrier !== undefined) {
        if (distanceBetweenHexes(locationOfStrikeGroup.currentHex, locationOfEnemyCarrier.currentHex) <= 3) {
          // strike group can move to attack enemy carrier fleet
          jpRegion = [locationOfEnemyCarrier.currentHex]
          setJapanMapRegions(jpRegion)
        } else {
          // strike group must return to "RETURN 2" space
          // @TODO move SG counter offboard and mark Strike Units as moved
        }
      }
    } else {
      const locationOfCarrier = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
      // First Air Op: Set Regions to be any hex within 2 of 1AF
      setCurrentHex(locationOfCarrier)
      if (locationOfCarrier) {
        jpRegion = allHexesWithinDistance(locationOfCarrier.currentHex, 2, true)
        setJapanMapRegions(jpRegion)
      }
    }

    // If this is the first Midway AirOp and strike group is more than two hexes from Midway
    // ensure that SG moves to within two hexes of Midway
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK && GlobalGameState.midwayAirOp === 1) {
      const jpRegion2 = allHexesWithinDistance(Controller.MIDWAY_HEX.currentHex, 3, true)
      const hexes = hexesInTwoRegions(jpRegion, jpRegion2)
      setJapanMapRegions(hexes)
    }

    // If this is the second Midway AirOp ensure SG moves to Midway
    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK && GlobalGameState.midwayAirOp === 2) {
      const midway = [{ q: 6, r: 3 }]
      setJapanMapRegions(midway)
    }
  }
  function setUSRegions() {
    // if naval strike group - use, counter CSF else use Midway
    // determine this from first air unit
    let usRegion, locationOfCarrier
    // @TODO need some new flag -> counterData.comingFromOffboard
    // to allow for remove (eg if player accidentally drops onto wrong hex)
    // if (locationOfStrikeGroup === undefined) {

    // }

    console.log(
      "GlobalGameState.airOpUS=",
      GlobalGameState.airOpUS,
      "counter data name:",
      counterData.name,
      "counterData.airOpMoved=",
      counterData.airOpMoved
    )

    if (counterData.airOpMoved !== undefined && GlobalGameState.airOpUS !== counterData.airOpMoved) {
      // second air op for this SG, use movement allowance (3) and position of SG to determine regions
      const locationOfStrikeGroup = controller.getStrikeGroupLocation(counterData.name, side)
      const speed = controller.getSlowestUnitSpeedInStrikeGroup(counterData.box)

      setCurrentHex(locationOfStrikeGroup)
      const locationOfEnemyCarrier = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)

      // if enemy fleet within range of (speed hexes calculated above)
      // SG must move to enemy
      if (locationOfStrikeGroup !== undefined && locationOfEnemyCarrier !== undefined) {
        if (distanceBetweenHexes(locationOfStrikeGroup.currentHex, locationOfEnemyCarrier.currentHex) <= speed) {
          // strike group can move to attack enemy carrier fleet
          usRegion = [locationOfEnemyCarrier.currentHex]
          setUSMapRegions(usRegion)
        } else {
          // strike group must return to "RETURN 2" space
          // @TODO move SG counter offboard and mark Strike Units as moved
        }
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
    const sg = controller.getStrikeGroupForBox(side, counterData.box)
    if (sg.attacked) {
      // if this strike group has attacked, disallow further movement for this air op
      return
    }

    // let from = { currentHex: position.currentHex }
    let from = HexCommand.OFFBOARD
    console.log("CURRENT HEX=", currentHex)
    let to = { currentHex }
    if (side === GlobalUnitsModel.Side.US) {
      const hex = { q: currentUSHex.q, r: currentUSHex.r }

      let isThere = USMapRegions && USMapRegions.find((h) => h.q === hex.q && h.r === hex.r)
      if (!isThere) {
        return
      } else {
        // ??
        // console.log(
        //   `Strike Unit ${counterData.name} moves to q:${hex.q}, r:${hex.r} => row: ${currentUSHex.row}, col: ${currentUSHex.col}`
        // )

        // TODO determine how many strike groups in this hex and
        // adjust positions accordingly
        // (set state in parent StrikeCounters component so all counters in the hex
        // shift their position slightly if needed)

        // we will need each counter to have an index in the stack
        // and the offset will be a factor of the index

        // also a means to select a counter in a stack

        if (index > 0) {
          currentUSHex.x += 6 * index
          currentUSHex.y -= 6 * index
        }
        setUSPosition(() => currentUSHex)
        if (position.initial) {
          from = HexCommand.OFFBOARD
        } else {
          from = { currentHex: position.currentHex }
        }
        to = { currentHex: currentUSHex }
        setUSMapRegions([])
        setCurrentHex(() => currentUSHex)
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
        setJapanPosition(() => currentJapanHex)
        if (position.initial) {
          from = HexCommand.OFFBOARD
        } else {
          from = { currentHex: position.currentHex }
        }
        to = { currentHex: currentJapanHex }
      }
      setJapanMapRegions([])
      setCurrentHex(() => currentJapanHex)
    }
    console.log("**** IMPORTANT FROM=", from)

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

    // Since air units cannot move again after being added to a strike group,
    // once that strike group has moved, we should rotate the air counters back to normal position
  }
  const zx = side === GlobalUnitsModel.Side.JAPAN ? 93 : 11

  const handleMouseEnter = () => {
    setIsMoveable(true)
    const sg = controller.getStrikeGroupForBox(side, counterData.box)
    console.log("SG ", sg.name, "attacked=", sg.attacked)
    if (!sg.attacked) {
      if (side === GlobalUnitsModel.Side.JAPAN) {
        setJapanRegions()
      } else {
        setUSRegions()
      }
    }
    const location = controller.getStrikeGroupLocation(counterData.name, side)
    setStrikeGroupPopup(side, true, location)
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
    if (side === GlobalUnitsModel.Side.JAPAN) {
      setJapanMapRegions([])
    } else {
      setUSMapRegions([])
    }
  }
  // console.log("DISPLAY STRIKE GROUP", counterData.name, "position=", position)

  return (
    <>
      <div>
        <input
          type="image"
          src={counterData.image}
          style={{
            position: "absolute",
            width: counterData.width,
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
          // zIndex={side === GlobalUnitsModel.Side.JAPAN ? 91 : 155}
        />
      </div>
    </>
  )
  //   });
}

export default StrikeCounter
