import React, { useContext, useState } from "react"
import "../../board.css"
import Controller from "../../../controller/Controller"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { BoardContext } from "../../../App"
import GlobalGameState from "../../../model/GlobalGameState"
import "./counter.css"
import { allHexesWithinDistance } from "../../HexUtils"
import HexCommand from "../../../commands/HexCommand"

function StrikeCounter({ setStrikeGroupPopup, currentUSHex, currentJapanHex, counterData, side }) {
  const {
    controller,
    loading,
    setUSMapRegions,
    USMapRegions,
    setIsMoveable,
    setJapanMapRegions,
    japanMapRegions,
    onDrag,
    fleetUnitUpdate,
  } = useContext(BoardContext)

  const [currentHex, setCurrentHex] = useState({})

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

  function setUSPosition(hex) {
    setPosition({
      initial: false,
      left: hex.x + 603,
      top: hex.y + 220,
      currentHex: hex,
    })
  }
  // FLEET UNIT UPDATE CODE
  let hex = {}
  if (fleetUnitUpdate) {
    hex = fleetUnitUpdate.position.currentHex
  }

  if (
    fleetUnitUpdate &&
    counterData.name === fleetUnitUpdate.name &&
    (position.currentHex.q !== hex.q || position.currentHex.r !== hex.r)
  ) {
    console.log("I am ", fleetUnitUpdate.name, " -> STRIKE GROUP UPDATE, move to ", hex.q + ",", hex.r)

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
    controller.viewEventHandler({
      type: Controller.EventTypes.STRIKE_GROUP_MOVE,
      data: {
        initial: position.initial,
        counterData,
        from,
        to,
        side,
        loading: true,
      },
    })
  }

  function setJapanRegions() {
    if (counterData.location === GlobalUnitsModel.AirBox.OFFBOARD) {
      // Use 1AF
      const locationOfCarrier = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)

      setCurrentHex(locationOfCarrier)
      const jpRegion = allHexesWithinDistance(locationOfCarrier.currentHex, 2, true)
      setJapanMapRegions(jpRegion)
    }
  }
  function setUSRegions() {
    // if naval strike group - use, counter CSF else use Midway
    // determine this from first air unit
    let usRegion, locationOfCarrier

    if (counterData.location === GlobalUnitsModel.AirBox.OFFBOARD) {
      const unitsInGroup = controller.getAirUnitsInStrikeGroups(counterData.box)
      if (unitsInGroup[0].carrier === GlobalUnitsModel.Carrier.MIDWAY) {
        locationOfCarrier = Controller.MIDWAY_HEX
      } else {
        locationOfCarrier = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
      }
    }

    // @TODO set US Regions when strike counter is on the map

    setCurrentHex(locationOfCarrier)
    usRegion = allHexesWithinDistance(locationOfCarrier.currentHex, 2, true)
    setUSMapRegions(usRegion)
  }
  const handleClick = (e) => {
    if (side === GlobalUnitsModel.Side.US) {
        setUSRegions()
    } else {
        setJapanRegions()
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
    // let from = { currentHex: position.currentHex }
    let from = HexCommand.OFFBOARD
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

        // will also need some hover capability to show the stack better like Vassal

        // also a means to select a counter in a stack

        setUSPosition(currentUSHex)
        if (position.initial) {
          from = HexCommand.OFFBOARD
        } else {
          from = { currentHex: position.currentHex }
        }
        to = { currentHex: currentUSHex }
        setUSMapRegions([])
      }
    } else {
      const hex = { q: currentJapanHex.q, r: currentJapanHex.r }
      let isThere = japanMapRegions && japanMapRegions.find((h) => h.q === hex.q && h.r === hex.r)
      if (!isThere) {
        return
      } else {
        setJapanPosition(currentJapanHex)
        if (position.initial) {
          from = HexCommand.OFFBOARD
        } else {
          from = { currentHex: position.currentHex }
        }
        to = { currentHex: currentJapanHex }
      }
      setJapanMapRegions([])
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

    const units = controller.getStrikeGroupsNotMoved(side)
    if (units.length === 0) {
      GlobalGameState.phaseCompleted = true
    } else {
      GlobalGameState.phaseCompleted = false
    }
  }
  const zx = side === GlobalUnitsModel.Side.JAPAN ? 93 : 11

  const handleMouseEnter = () => {
    setIsMoveable(true)
    if (side === GlobalUnitsModel.Side.JAPAN) {
      setJapanRegions()
    } else {
      setUSRegions()
    }
    const location = controller.getStrikeGroupLocation(counterData.name, side)
    setStrikeGroupPopup(side, true, location)
  }

  const handleMouseLeave = () => {
    setIsMoveable(false)
    setStrikeGroupPopup(side, false)
  }
  //   console.log("counter data=", counterData)
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
            zIndex: zx,
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
          // onContextMenu={(e) => handleRightClick(e)}
          zIndex={side === GlobalUnitsModel.Side.JAPAN ? 91 : 11}
        />
      </div>
    </>
  )
  //   });
}

export default StrikeCounter
