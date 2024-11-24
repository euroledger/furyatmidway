import React from "react"
import "../board.css"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"

function DragAndDropSmall({ name, handleDragEnter, handleDragLeave, zones, enabled, side, dc }) {
  const onDragOver = (e) => {
    e.stopPropagation()
    e.preventDefault()
  }
  const defaultDragLeave = (e, index, name) => {
    if (handleDragLeave !== undefined) {
      handleDragLeave()
    }
  }
  const myZones = zones.map((p, index) => {
    if (!enabled) {
      return <></>
    }

    const zI = side === GlobalUnitsModel.Side.JAPAN ? 92 : 10

    let dropClass = dc

    if (dc === undefined) {
      dropClass =
        side === GlobalUnitsModel.Side.JAPAN
          ? `drag-drop-zone-small zone2 bg-japan`
          : "drag-drop-zone-small zone2 bg-us"
    }

    return (
      <div
        key={index}
        className={dropClass}
        style={{
          left: p.left + "%",
          top: p.top + "%",
          zIndex: zI,
        }}
        onDragEnter={(e) => handleDragEnter(e, index, name)}
        onDragOver={onDragOver}
        onDragLeave={(e) => defaultDragLeave(e, index, name)}
      ></div>
    )
  })
  return <>{myZones}</>
}

export default DragAndDropSmall
