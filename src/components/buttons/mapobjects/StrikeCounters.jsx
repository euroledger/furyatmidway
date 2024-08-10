import React, { useState } from "react"

import "../../board.css"
import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import StrikeCounter from "./StrikeCounter"

function StrikeCounters({ controller, onDrag, onStop, counterData, currentUSHex, currentJapanHex }) {
  const [showPopup, setShowPopup] = useState(false)

  const counters = Array.from(counterData.values())

  const strikeUnits = counters.filter((unit) => unit.constructor.name === "StrikeGroupUnit")

  function getStrikeGroupsAtLocation(side) {
    const hex = {
      currentHex: side === GlobalUnitsModel.Side.JAPAN ? currentJapanHex : currentUSHex,
    }
    console.log("CURRENT HEX = ", hex)
    const strikeGroupsAtLocation = controller.getAllStrikeGroupsInLocation(hex, side)

    console.log("Num Strike Groups =", strikeGroupsAtLocation.length)
    if (strikeGroupsAtLocation.length > 1) {
      setShowPopup(true)
    } else {
      setShowPopup(false)
    }
  }
  const sgCounters = strikeUnits.map((strikeGroupUnit) => {
    if (
      GlobalGameState.gamePhase !== GlobalGameState.PHASE.AIR_OPERATIONS ||
      controller.getAirUnitsInStrikeGroups(strikeGroupUnit.box).length === 0
    ) {
      return
    }

    return (
      <StrikeCounter
        getStrikeGroupsAtLocation={getStrikeGroupsAtLocation}
        counterData={strikeGroupUnit}
        side={strikeGroupUnit.side}
        currentUSHex={currentUSHex}
        currentJapanHex={currentJapanHex}
      ></StrikeCounter>
    )
  })

  return (
    <>
      {sgCounters}
      {showPopup && (
        <div
          style={{
            position: "absolute",
            left: 620,
            top: 200,
            zIndex: 100,
            width: "200px",
            height: "100px",
            background: "white",
            borderRadius: "4px",
            border: "3px solid #060000",
          }}
        ></div>
      )}
    </>
  )
}

export default StrikeCounters
