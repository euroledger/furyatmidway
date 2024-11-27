import React, { useState } from "react"
import "../board.css"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import JapanReorganizationBoxOffsets from "../draganddrop/JapanReorganizationBoxOffsets"
import USReorganizationBoxOffsets from "../draganddrop/USReorganizationBoxOffsets"
import { moveAirUnitToEliminatedBox } from "../../DiceHandler"

function Reorgaziza({
  controller,
  zones,
  enabled,
  side,
  dc,
  reorgUnits,
}) {

  const [elim, setElim] = useState(false)

  const handleClick = (unit, index) => {
    if (elim) {
      return // already done
    }
    unit.steps = 0
    moveAirUnitToEliminatedBox(controller, unit)

    // QUACK @TODO log event here -> FLIP unit to full strength

    setElim(true)
    // get first air unit other than this one and flip it to full strength
    for (let i = 0; i < reorgUnits.length; i++) {
      const airUnit = reorgUnits[i]
      if (i !== index) {
        airUnit.aircraftUnit.steps = 2
        const newImage = airUnit.image.replace("back", "front")
        airUnit.image = newImage
        break
      }
    }
  }

  const airUnitCounters = reorgUnits.map((unit, index) => {
    if (unit.steps === 0) {
      return
    }
    let left, top
    if (side === GlobalUnitsModel.Side.JAPAN) {
      left = JapanReorganizationBoxOffsets[index].left + 0.2 + "%"
      top = JapanReorganizationBoxOffsets[index].top + 0.2 + "%"
    }
    if (side === GlobalUnitsModel.Side.US) {
      left = USReorganizationBoxOffsets[index].left + 0.2 + "%"
      top = USReorganizationBoxOffsets[index].top + 0.2 + "%"
    }
    return (
      <div>
        <input
          type="image"
          src={unit.image}
          style={{
            position: "absolute",
            width: 27,
            height: 27,
            left,
            top,
            zIndex: 101,
          }}
          id="popupcounter"
          onClick={(e) => handleClick(unit, index)}
        />
      </div>
    )
  })

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
      ></div>
    )
  })
  return (
    <>
      {myZones} {airUnitCounters}
    </>
  )
}

export default Reorgaziza
