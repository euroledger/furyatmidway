import React, { useContext, useState } from "react"
import "../../board.css"
import Controller from "../../../controller/Controller"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import GlobalGameState from "../../../model/GlobalGameState"
import { BoardContext } from "../../../App"
import "./counter.css"
import { setValidDestinationBoxes } from "../../../controller/AirOperationsHandler"

function StrikeCounter({currentHex, counterData, side, usRegions, jpRegions }) {
//   const { controller, onDrag, onStop, airUnitUpdate, setAlertShow, setEnabledUSBoxes, setEnabledJapanBoxes } =
//     useContext(BoardContext)
  const [position, setPosition] = useState({
    left: counterData.position.left,
    top: counterData.position.top,
  })

  const handleClick = (e) => {
    console.log("CLICK:", counterData.name)

    // @TODO get our current location
    // draw hexes around this location as drop zone
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
            borderRadius:"2px",
            border: "3px solid rgb(197,9,9)"
          },
        }}
        id="saveForm2"
        // onMouseEnter={onDrag}
        // onMouseLeave={onStop}
        // draggabble="true"
        // onDragStart={onDrag}
        // onDragEnd={handleDrop}
        onClick={(e) => handleClick(e)}
        // onContextMenu={(e) => handleRightClick(e)}
        zIndex={side === GlobalUnitsModel.Side.JAPAN ? 91 : 11}
      />
    </div>
  )
  //   });
}

export default StrikeCounter
