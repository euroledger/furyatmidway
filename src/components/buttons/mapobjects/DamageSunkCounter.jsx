import React, { useState } from "react"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import JapanAirBoxOffsets from "../../draganddrop/JapanAirBoxOffsets"
import USAirBoxOffsets from "../../draganddrop/USAirBoxOffsets"
import "../../board.css"
import "./counter.css"
import HexCommand from "../../../commands/HexCommand"
import GlobalGameState from "../../../model/GlobalGameState"

function DamageSunkCounter({ counterData, markerUpdate }) {
  const [position, setPosition] = useState({
    left: -10000,
    top: -10000,
    side: ""
  })

  if (markerUpdate.box === "") {
    return
  }
  if (counterData.name === markerUpdate.name) {
    if (markerUpdate.box === HexCommand.OFFBOARD) {
      return
    }
    const airZones =
      markerUpdate.side === GlobalUnitsModel.Side.JAPAN
        ? JapanAirBoxOffsets.find((o) => o.name === markerUpdate.box)
        : USAirBoxOffsets.find((o) => o.name === markerUpdate.box)

    if (!airZones) {
      return
    }

    const offsets = airZones.offsets[markerUpdate.index]

    if (position.left !== offsets.left + "%") {
      setPosition(() => ({
        left: offsets.left + "%",
        top: offsets.top - 0.2 + "%",
        side: markerUpdate.side
      }))
    }
  }
  const hide = position.side === GlobalUnitsModel.Side.US && GlobalGameState.hideCounters
  
  return (
    <div>
      <input
        hidden={hide}
        type="image"
        src={counterData.image}
        name="marker"
        style={{
          position: "absolute",
          width: counterData.width,
          left: position.left,
          top: position.top,
          zIndex: 100,
        }}
        id="marker"
      />
    </div>
  )
}

export default DamageSunkCounter
