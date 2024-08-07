import React, { useState, useContext } from "react"
import "../../board.css"
import HexCommand from "../../../commands/HexCommand"
import Controller from "../../../controller/Controller"
import GlobalGameState from "../../../model/GlobalGameState"
import { BoardContext } from "../../../App"

function FleetCounter({ id, currentHex, counterData, usRegions, jpRegions, enabled, side }) {
  const { controller, onDrag, onStop, fleetUnitUpdate } = useContext(BoardContext)
  const [position, setPosition] = useState({
    initial: true,
    left: counterData.position.left,
    top: counterData.position.top,
    currentHex: {},
  })
  let hex = {}
  if (fleetUnitUpdate) {
    hex = fleetUnitUpdate.position.currentHex
  }

  // if (fleetUnitUpdate) {
  //   console.log("GOT AN UPDATE FOR FLEET ",fleetUnitUpdate.name, " - moving to ",hex )
  // }
  // This code for the test mode fleet unit updates
  if (
    fleetUnitUpdate &&
    counterData.name === fleetUnitUpdate.name &&
    (position.currentHex.q !== hex.q || position.currentHex.r !== hex.r)
  ) {
    console.log("I am ", fleetUnitUpdate.name, " -> FLEET UNIT UPDATE, move to ", hex.q + ",", hex.r)
    setPosition({
      initial: false,
      left: hex.x + counterData.position.left + counterData.offsets.x,
      top: hex.y + counterData.position.top + counterData.offsets.y,
      currentHex: hex,
    })

    let from = {
      currentHex: position.currentHex,
    }
    // console.log("************ from = ", from)

    let to = { currentHex: hex }
    if (position.initial) {
      from = HexCommand.OFFBOARD
    }
    // console.log("*** To = ", to.currentHex.row, ", ", to.currentHex.col)

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

    console.log(
      `Fleet Unit ${counterData.name} moves to q:${hex.q}, r:${hex.r} => x:${currentHex.x},y:${currentHex.y}, row: ${currentHex.row}, col: ${currentHex.col}`
    )

    console.log("currenthex.x =", currentHex.x)
    console.log("currentHex.y =", currentHex.y)

    console.log("counterData.position.left=", counterData.position.left)
    console.log("counterData.position.top=", counterData.position.top)

    console.log("counterData.offsets.x=",counterData.offsets.x)
    console.log("counterData.offsets.y=",counterData.offsets.y)

    console.log("SET left to ", currentHex.x + counterData.position.left + counterData.offsets.x)
    console.log("SET top to ", currentHex.y + counterData.position.top + counterData.offsets.y)

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

  const handleClick = (event) => {
    console.log("You clicked on a fleet counter!")
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
          }}
          onMouseEnter={onDrag}
          onMouseLeave={onStop}
          onDragEnd={handleDrop}
          // onClick={handleClick}
        />
      )}
    </div>
  )
}

export default FleetCounter
