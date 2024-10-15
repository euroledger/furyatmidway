import React, { useState } from "react"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import JapanAirBoxOffsets from "../../draganddrop/JapanAirBoxOffsets"
import USAirBoxOffsets from "../../draganddrop/USAirBoxOffsets"
import "../../board.css"
import "./counter.css"

function DamageSunkCounter({ counterData, markerUpdate }) {
  const [position, setPosition] = useState({
    left: "",
    top: "",
  })

  if (markerUpdate.box === "") {
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

  if (counterData.name === markerUpdate.name && position.left !== offsets.left  + "%") {
    // console.log("I am ", counterData.name, " -> MARKER UPDATE = ", markerUpdate, "offsets=", offsets)

    setPosition(() => ({
      left: offsets.left + "%",
      top: offsets.top - 0.2 + "%",
    }))
  }

  return (
    <div>
      <input
        type="image"
        src={counterData.image}
        name="marker"
        style={{
          position: "absolute",
          width: counterData.width,
          left: position.left,
          top: position.top,
          zIndex: 100
        }}
        id="marker"
      />
    </div>
  )
}

export default DamageSunkCounter
