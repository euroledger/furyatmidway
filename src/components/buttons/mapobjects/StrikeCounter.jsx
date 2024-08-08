import React, { useContext, useState } from "react"
import "../../board.css"
import Controller from "../../../controller/Controller"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import GlobalGameState from "../../../model/GlobalGameState"
import { BoardContext } from "../../../App"
import "./counter.css"
import { setValidDestinationBoxes } from "../../../controller/AirOperationsHandler"
import { allHexesWithinDistance } from "../../HexUtils"
import HexCommand from "../../../commands/HexCommand"

function StrikeCounter({ currentUSHex, currentJapanHex, counterData, side }) {
  const { controller, loading, setUSMapRegions, USMapRegions, setJapanMapRegions, onDrag, onStop } = useContext(BoardContext)


  const [currentHex, setCurrentHex] = useState({})
  const [position, setPosition] = useState({
    initial: true,
    left: counterData.position.left,
    top: counterData.position.top,
    currentHex: HexCommand.OFFBOARD,
  })
  const handleClick = (e) => {
    const unit = counterData.units[0]
    // temp
    const side = unit.side
    if (side === GlobalUnitsModel.Side.US) {
      if (counterData.location === GlobalUnitsModel.AirBox.OFFBOARD) {
        // if naval strike group - use CSF else use Midway
        // determine this from first air unit
        console.log("Controller = ", controller)
        const csfLocation = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
        console.log("CSF LOCATION: ", csfLocation)

        setCurrentHex(csfLocation)
        const usRegion = allHexesWithinDistance(csfLocation.currentHex, 2, true)
        setUSMapRegions(usRegion)
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
  }

  const handleDrop = (event) => {
    // let from = { currentHex: position.currentHex }
    let from = HexCommand.OFFBOARD
    let to = { currentHex }
    if (side === "US") {
      const hex = { q: currentUSHex.q, r: currentUSHex.r }
      console.log("TARGET HEX = ", hex)

      let isThere = USMapRegions && USMapRegions.find((h) => h.q === hex.q && h.r === hex.r)
      if (!isThere) {
        console.log("NO WAY JOSE")
        return
      } else {
        // ??
        console.log(
          `Strike Unit ${counterData.name} moves to q:${hex.q}, r:${hex.r} => row: ${currentUSHex.row}, col: ${currentUSHex.col}`
        )
        console.log("set left to ", currentUSHex.x)
        console.log("set top to ", currentUSHex.y)

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
          from = { currentHex: position.currentHex}
        }
        to = { currentHex: currentUSHex }
      }
    } else {
      // let isThere = jpRegions && jpRegions.find((h) => h.q === hex.q && h.r === hex.r)
      // if (!isThere) {
      //   return
      // }
      // GlobalGameState.jpFleetPlaced = true
      // GlobalGameState.jpFleetMoved = true
    }

    // let from = { currentHex: position.currentHex }
    // let to = { currentHex }
    // if (position.initial) {
    //   from = HexCommand.OFFBOARD
    // }

    // controller.viewEventHandler({
    //   type: Controller.EventTypes.FLEET_SETUP,
    //   data: {
    //     initial: position.initial,
    //     id,
    //     from,
    //     to,
    //     side,
    //   },
    // })

    controller.viewEventHandler({
      type: Controller.EventTypes.STRIKE_GROUP_MOVE,
      data: {
        initial: position.initial,
        counterData,
        from,
        to,
        side,
        loading
      },
    })
  }
  const zx = side === GlobalUnitsModel.Side.JAPAN ? 93 : 11

  //   console.log("counter data=", counterData)
  return (
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
        onMouseEnter={onDrag}
        onMouseLeave={onStop}
        draggabble="true"
        onDragStart={onDrag}
        onDragEnd={handleDrop}
        onClick={(e) => handleClick(e)}
        // onContextMenu={(e) => handleRightClick(e)}
        zIndex={side === GlobalUnitsModel.Side.JAPAN ? 91 : 11}
      />
    </div>
  )
  //   });
}

export default StrikeCounter
