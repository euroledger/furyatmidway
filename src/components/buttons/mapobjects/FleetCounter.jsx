import React, { useState } from "react"
import "../../board.css"
import GlobalGameState from "../../../model/GlobalGameState"
import HexCommand from "../../../commands/HexCommand"
import COMMAND_TYPE from "../../../commands/COMMAND_TYPE"
import Controller from "../../../controller/Controller"


function FleetCounter({ controller, onDrag, onStop, id, currentHex, counterData, usRegions, enabled }) {
  const [position, setPosition] = useState({
    initial: true,
    left: counterData.position.left,
    top: counterData.position.top,
    currentHex: {},
  })

  const handleDrop = (event) => {

    const hex = ({q: currentHex.q, r: currentHex.r})
    let isThere = usRegions && usRegions.find((h) => h.q === hex.q && h.r === hex.r)

    if (!isThere) {
      return
    }

    setPosition({
      initial: false,
      left: currentHex.x + counterData.position.left + counterData.offsets.x,
      top: currentHex.y + counterData.position.top + counterData.offsets.y,
      currentHex,
    })

    let command = new HexCommand(COMMAND_TYPE.MOVE, id, { currentHex: position.currentHex }, { currentHex })
    if (position.initial) {
      command = new HexCommand(COMMAND_TYPE.PLACE, id, HexCommand.OFFBOARD, { currentHex })
    }

    controller.viewEventHandler({
      type: Controller.EventTypes.FLEET_SETUP,
      data: {
        // name: airUnitUpdate.boxName,
        // counterData,
        // index: airUnitUpdate.index,
      },
    })
    GlobalGameState.phaseCompleted = true

    GlobalGameState.log(`Command: ${command.toString()}`)
    // GlobalGameState.log(`${counterData.longName} moves to ${currentHex.row}-${currentHex.col}`)
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
          onClick={handleClick}
        />
      )}
    </div>
  )
  //   });
}

export default FleetCounter
