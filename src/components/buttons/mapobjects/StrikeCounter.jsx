import React, { useContext, useState } from "react"
import "../../board.css"
import Controller from "../../../controller/Controller"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { BoardContext } from "../../../App"
import "./counter.css"
import { allHexesWithinDistance } from "../../HexUtils"
import HexCommand from "../../../commands/HexCommand"

function StrikeCounter({ getStrikeGroupsAtLocation, currentUSHex, currentJapanHex, counterData, side }) {
  const {
    controller,
    loading,
    setUSMapRegions,
    USMapRegions,
    setIsMoveable,
    setJapanMapRegions,
    japanMapRegions,
    onDrag,
    onStop,
  } = useContext(BoardContext)

  const [currentHex, setCurrentHex] = useState({})

  const [position, setPosition] = useState({
    initial: true,
    left: counterData.position.left,
    top: counterData.position.top,
    currentHex: HexCommand.OFFBOARD,
  })
  const handleClick = (e) => {
    if (side === GlobalUnitsModel.Side.US) {
      if (counterData.location === GlobalUnitsModel.AirBox.OFFBOARD) {
        // if naval strike group - use CSF else use Midway
        // determine this from first air unit
        const unitsInGroup = controller.getAirUnitsInStrikeGroups(counterData.box)
        let usRegion, locationOfCarrier
        if (unitsInGroup[0].carrier === GlobalUnitsModel.Carrier.MIDWAY) {
          locationOfCarrier = Controller.MIDWAY_HEX
        } else {
          locationOfCarrier = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
        }

        setCurrentHex(locationOfCarrier)
        usRegion = allHexesWithinDistance(locationOfCarrier.currentHex, 2, true)
        setUSMapRegions(usRegion)
      }
    } else {
      if (counterData.location === GlobalUnitsModel.AirBox.OFFBOARD) {
        // Use 1AF
        const locationOfCarrier = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)

        setCurrentHex(locationOfCarrier)
        const jpRegion = allHexesWithinDistance(locationOfCarrier.currentHex, 2, true)
        setJapanMapRegions(jpRegion)
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

        setPosition({
          initial: false,
          left: currentUSHex.x + 603,
          top: currentUSHex.y + 210,
          currentHex: currentUSHex,
        })
        if (position.initial) {
          from = HexCommand.OFFBOARD
        } else {
          from = { currentHex: position.currentHex }
        }
        to = { currentHex: currentUSHex }
      }
    } else {
      const hex = { q: currentJapanHex.q, r: currentJapanHex.r }

      console.log("japanMapRegions = ", japanMapRegions)
      console.log("hex = ", hex)
      let isThere = japanMapRegions && japanMapRegions.find((h) => h.q === hex.q && h.r === hex.r)
      if (!isThere) {
        console.log("NO WAY SUZUKI!")
        return
      } else {
        setPosition({
          initial: false,
          left: currentJapanHex.x + 157,
          top: currentJapanHex.y + 180,
          currentHex: currentJapanHex,
        })
        if (position.initial) {
          from = HexCommand.OFFBOARD
        } else {
          from = { currentHex: position.currentHex }
        }
        to = { currentHex: currentJapanHex }
      }
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
    getStrikeGroupsAtLocation(side)
  }
  const zx = side === GlobalUnitsModel.Side.JAPAN ? 93 : 11

  const handleMouseEnter = () => {
    setIsMoveable(true)
    console.log("BOOG!")
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
        onMouseLeave={onStop}
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
