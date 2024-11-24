import React, { useContext } from "react"
import DragAndDropSmall from "./DragAndDropSmall"
import "../board.css"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import { BoardContext } from "../../App"
import JapanOffMapFleetBoxOffsets from "./JapanOffMapFleetBoxOffsets"

function JapanOffMapFleetDropZones({ handleDragEnter, handleDragLeave }) {
  const { enabledJapanFleetBoxes } = useContext(BoardContext)

  if (!enabledJapanFleetBoxes) {
    return []
  }

  const japanZones = (
    <DragAndDropSmall
      key={0}
      name="US Fleet Box"
      handleDragEnter={handleDragEnter}
      handleDragLeave={handleDragLeave}
      zones={JapanOffMapFleetBoxOffsets}
      enabled={true}
      side={GlobalUnitsModel.Side.JAPAN}
      dc="drag-drop-zone-fleet zone2 bg-japan"
    ></DragAndDropSmall>
  )
  return <>{japanZones}</>
}

export default JapanOffMapFleetDropZones
