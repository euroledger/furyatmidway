import React, { useContext } from "react"
import DragAndDropSmall from "./DragAndDropSmall"
import "../board.css"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import { BoardContext } from "../../App"
import USOffMapFleetBoxOffsets from "./USOffMapFleetBoxOffsets"

function USOffMapFleetDropZones({ handleDragEnter, handleDragLeave }) {
  const { enabledUSFleetBoxes } = useContext(BoardContext)

  if (!enabledUSFleetBoxes) {
    return []
  }

  const usZones = (
    <DragAndDropSmall
      key={0}
      name="US Fleet Box"
      handleDragEnter={handleDragEnter}
      handleDragLeave={handleDragLeave}
      zones={USOffMapFleetBoxOffsets}
      enabled={true}
      side={GlobalUnitsModel.Side.US}
      dc="drag-drop-zone-fleet zone2 bg-us"
    ></DragAndDropSmall>
  )
  return <>{usZones}</>
}

export default USOffMapFleetDropZones
