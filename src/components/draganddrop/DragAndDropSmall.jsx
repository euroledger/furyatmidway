import React from "react"
import "../board.css"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import GlobalGameState from "../../model/GlobalGameState"

function DragAndDropSmall({ name, handleDragEnter, zones, enabled, side }) {
  const onDragOver = (e) => {
    e.stopPropagation()
    e.preventDefault()
  }
  const myZones = zones.map((p, index) => {
    if (!enabled) {
      return <></>
    }

    const zI = side === GlobalUnitsModel.Side.JAPAN ? 92 : 10

    const dropClass =
      side === GlobalUnitsModel.Side.JAPAN ? `drag-drop-zone-small zone2 bg-japan` : "drag-drop-zone-small zone2 bg-us"
    return (
      <div
        key={index}
        class={dropClass}
        style={{
          left: p.left + "%",
          top: p.top + "%",
          zIndex: zI

        }}
        onDragEnter={(e) => handleDragEnter(e, index, name)}
        onDragOver={onDragOver}
      ></div>
    )
  })
  return <>{myZones}</>
}

export default DragAndDropSmall
