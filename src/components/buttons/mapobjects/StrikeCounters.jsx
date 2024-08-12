import React, { useState } from "react"

import "../../board.css"
import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import StrikeCounter from "./StrikeCounter"
import StrikeGroupPopUp from "./StrikeGroupPopUp"

function StrikeCounters({ controller, currentMouseHex, setCurrentMouseHex, counterData, currentUSHex, currentJapanHex }) {

  const [showPopup, setShowPopup] = useState(false)

  const [popUpPosition, setPopUpPosition] = useState({})

  const [strikeGroupsAtLocation, setstrikeGroupsAtLocation] = useState([])

  const counters = Array.from(counterData.values())

  const [hex, setHex] = useState(currentMouseHex)

  const strikeUnits = counters.filter((unit) => unit.constructor.name === "StrikeGroupUnit")

  function setStrikeGroupPopup(side, show, hex) {

    if (show === false || hex === undefined) {
      console.log("1 SET POP UP FALSE hex =", hex)
      setShowPopup(false)
      return
    }
    const hexy = hex
    setHex(() => hex)

    const groups = controller.getAllStrikeGroupsInLocation(hexy, side)
    setstrikeGroupsAtLocation(() => groups)
    if (groups.length > 0) {
      console.log("SET POP UP TRUE")

      setShowPopup(true)
      setPopUpPosition(() => hexy.currentHex)
    } else {
      console.log("2 SET POP UP FALSE groups.length = ", groups.length)

      setShowPopup(false)
    }

    setCurrentMouseHex({})
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
        setStrikeGroupPopup={setStrikeGroupPopup}
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
        <StrikeGroupPopUp strikeGroup={strikeGroupsAtLocation} popUpPosition={popUpPosition} hex={hex}></StrikeGroupPopUp>
      )}
    </>
  )
}

export default StrikeCounters
