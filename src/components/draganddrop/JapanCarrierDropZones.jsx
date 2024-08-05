import React, { useContext } from "react";
import DragAndDropSmall from "./DragAndDropSmall"
import JapanAirBoxOffsets from "./JapanAirBoxOffsets"
import "../board.css"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import { BoardContext } from "../../App"

function JapanCarrierDropZones({ handleDragEnter }) {
  const { enabledJapanBoxes } = useContext(BoardContext)

  const japanZones = JapanAirBoxOffsets.flatMap((box, index) => {
    
    if (!enabledJapanBoxes || !enabledJapanBoxes.includes(box.name)) {
      return []
    }

    return (
      <DragAndDropSmall
        key={index}
        name={box.name}
        handleDragEnter={handleDragEnter}
        zones={box.offsets}
        enabled={true}
        side={GlobalUnitsModel.Side.JAPAN}
      ></DragAndDropSmall>
    )
  })
  return <>{japanZones}</>
}

export default JapanCarrierDropZones
