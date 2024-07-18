import React, { useContext } from "react";
import DragAndDropSmall from "./DragAndDropSmall"
import USAirBoxOffsets from "./USAirBoxOffsets"
import "../board.css"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import { BoardContext } from "../../App";

function USCarrierDropZones({ handleDragEnter  }) {
  const { enabledUSBoxes } = useContext(BoardContext)

  const usZones = USAirBoxOffsets.flatMap((box, index) => {
    
    if (!enabledUSBoxes.includes(box.name)) {
      return []
    }

    return (
      <DragAndDropSmall
        key={index}
        name={box.name}
        handleDragEnter={handleDragEnter}
        zones={box.offsets}
        enabled={true}
        side={GlobalUnitsModel.Side.US}
      ></DragAndDropSmall>
    )
  })
  return <>{usZones}</>
}

export default USCarrierDropZones
