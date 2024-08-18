import React, { useState, useContext } from "react"
import GlobalGameState from "../../model/GlobalGameState"
import "./button.css"
import AOPOffsets from "../draganddrop/AopBoxOffsets"
import { BoardContext } from "../../App"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"
export const AOP_MARKER_SIDE = {
  JAPAN: "japan",
  US: "us",
}

function AOPMarkerButton({ image, side, initialPosition, getZone, zIndex, incrementZIndex }) {
  const { onDrag, onStop } = useContext(BoardContext)

  const [position, setPosition] = useState(initialPosition)

  const [japanOps, setJapanOps] = useState(0)
  const [usOps, setUsOps] = useState(0)

  // ensure that if the buttons are not in the same space
  // they revert to their default (centred) position

  if (
    GlobalGameState.airOperationPoints["japan"] != GlobalGameState.airOperationPoints["us"] &&
    position.top != AOPOffsets[0].top + 0.4 &&
    position.left != AOPOffsets[0].left + 0.3
  ) {
    setPosition({
      ...position,
      left: AOPOffsets[GlobalGameState.airOperationPoints[side]].left + 0.3,
      top: AOPOffsets[0].top + 0.4,
    })
  } else {
    if (side.toUpperCase() === GlobalUnitsModel.Side.JAPAN.toUpperCase() && japanOps !== GlobalGameState.airOperationPoints[side]) {
      setJapanOps(GlobalGameState.airOperationPoints[side])
      let leftOffset = 0
      let topOffset = 0
      if (GlobalGameState.airOperationPoints["japan"] === GlobalGameState.airOperationPoints["us"]) {
        leftOffset = 0.5
        topOffset = 0.5
        incrementZIndex(side, 10)
        zIndex += 5
      } else {
        incrementZIndex(side, 0)
      }
      setPosition({
        ...position,
        left: AOPOffsets[GlobalGameState.airOperationPoints[side]].left + leftOffset,
        top: AOPOffsets[GlobalGameState.airOperationPoints[side]].top + 1.5 - topOffset,
      })
    }
    if (side.toUpperCase() === GlobalUnitsModel.Side.US.toUpperCase() && usOps !== GlobalGameState.airOperationPoints[side]) {
      setUsOps(GlobalGameState.airOperationPoints[side])
      let leftOffset = 0
      let topOffset = 0
      if (GlobalGameState.airOperationPoints["japan"] === GlobalGameState.airOperationPoints["us"]) {
        leftOffset = 0.5
        topOffset = 0.5
        incrementZIndex(side, 10)
        zIndex += 5
      } else {
        incrementZIndex(side, 0)
      }

      setPosition({
        ...position,
        left: AOPOffsets[GlobalGameState.airOperationPoints[side]].left + 0.9 + leftOffset,
        top: AOPOffsets[GlobalGameState.airOperationPoints[side]].top + 0.3 - topOffset,
      })
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()

    GlobalGameState.airOperationPoints[side] = getZone()

    const sideStr = side === "us" ? "US" : "Japan"
    GlobalGameState.log(`${sideStr} Air Operations Points set to ${getZone()}`)

    let leftOffset = 0
    let topOffset = 0
    if (GlobalGameState.airOperationPoints["japan"] === GlobalGameState.airOperationPoints["us"]) {
      leftOffset = 0.5
      topOffset = 0.5
      incrementZIndex(side, 10)
      zIndex += 5
    } else {
      incrementZIndex(side, 0)
    }

    setPosition({
      ...position,
      left: AOPOffsets[getZone()].left + 0.3 + leftOffset,
      top: AOPOffsets[getZone()].top + 0.4 - topOffset,
    })
  }

  const z = zIndex[side] + 5
  return (
    <>
      <div>
        <input
          type="image"
          src={image}
          name="saveForm"
          className={"button-pos"}
          style={{
            position: "absolute",
            width: "2.8%",
            left: `${position.left}%`,
            top: `${position.top}%`,
            zIndex: z,
          }}
          id="saveForm"
          onMouseEnter={onDrag}
          onMouseLeave={onStop}
          draggabble="true"
          onDragStart={onDrag}
          onDragEnd={handleDrop}
        />
      </div>
    </>
  )
}

export default AOPMarkerButton
