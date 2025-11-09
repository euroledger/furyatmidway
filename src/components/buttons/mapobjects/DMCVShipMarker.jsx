import React, { useState, useContext } from "react"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { BoardContext } from "../../../App"
import JapanAirBoxOffsets from "../../draganddrop/JapanAirBoxOffsets"
import USAirBoxOffsets from "../../draganddrop/USAirBoxOffsets"
import "../../board.css"
import "./counter.css"
import GlobalInit from "../../../model/GlobalInit"
import GlobalGameState from "../../../model/GlobalGameState"

function DMCVShipMarker({ counterData }) {
  const { dmcvShipMarkerUpdate } = useContext(BoardContext)

  const [position, setPosition] = useState({
    left: -100,
    top: -100,
    side: "",
  })

  if (dmcvShipMarkerUpdate.box === "") {
    return
  }

  const airZones =
    dmcvShipMarkerUpdate.side === GlobalUnitsModel.Side.JAPAN
      ? JapanAirBoxOffsets.find((o) => o.name === dmcvShipMarkerUpdate.box)
      : USAirBoxOffsets.find((o) => o.name === dmcvShipMarkerUpdate.box)

  if (!airZones) {
    return
  }
  const offsets = airZones.offsets[dmcvShipMarkerUpdate.index]

  if (counterData.name === dmcvShipMarkerUpdate.name && position.left !== offsets.left + "%") {
    // console.log("I am ", counterData.name, " -> MARKER UPDATE = ", dmcvShipMarkerUpdate, "offsets=", offsets)

    setPosition(() => ({
      left: offsets.left + "%",
      top: offsets.top - 0.2 + "%",
      side: dmcvShipMarkerUpdate.side,
    }))
  }
  let disp = "block"
  if (
    counterData.name === dmcvShipMarkerUpdate.name &&
    dmcvShipMarkerUpdate.carrier !== undefined &&
    GlobalInit.controller.isSunk(dmcvShipMarkerUpdate.carrier, true)
  ) {
    disp = "none"
  }

  const hide = position.side === GlobalUnitsModel.Side.US && GlobalGameState.hideCounters

  // if (counterData.image.includes("japan")) {
  //   console.log(">>>>>>>>>>>>>>>>>>>>>> counterData.image->", counterData.image)
  //   console.log(">>>>>>>>>>>>>>>>>>>>>> position->", position.left, position.top)
  //   console.log(">>>>>>>>>>>>>>>>>>>>>> GlobalGameState.usDMCVCarrier->", GlobalGameState.jpDMCVCarrier)
  // }

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
          display: disp,
        }}
        id="marker"
      />
    </div>
  )
}

export default DMCVShipMarker
