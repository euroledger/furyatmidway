import React, { useState } from "react"

import "../../board.css"
import GlobalGameState from "../../../model/GlobalGameState"
import StrikeCounter from "./StrikeCounter"
import StrikeGroupPopUp from "./StrikeGroupPopUp"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"

function StrikeCounters({
  controller,
  currentMouseHex,
  setCurrentMouseHex,
  counterData,
  currentUSHex,
  currentJapanHex,
}) {
  const [showPopup, setShowPopup] = useState(false)

  const [popUpPosition, setPopUpPosition] = useState({})

  const [strikeGroupsAtLocation, setstrikeGroupsAtLocation] = useState([])

  const counters = Array.from(counterData.values())

  const [hex, setHex] = useState(currentMouseHex)
  const [side, setSide] = useState("")

  const strikeUnits = counters.filter((unit) => unit.constructor.name === "StrikeGroupUnit")

  function setStrikeGroupPopup(side, show, hex) {
    if (show === false || hex === undefined) {
      setShowPopup(false)
      return
    }
    const hexy = hex
    setHex(() => hex)
    setSide(() => side)
    const groups = controller.getAllStrikeGroupsInLocation(hexy, side)
    setstrikeGroupsAtLocation(() => groups)

    const fleets = controller.getAllFleetsInLocation(hexy, side)
    console.log("FLEETS =", fleets)

    if (groups.length > 0) {
      setShowPopup(true)
      setPopUpPosition(() => hexy.currentHex)
    } else {
      setShowPopup(false)
    }

    setCurrentMouseHex({})
  }
  const sgCounters = strikeUnits.map((strikeGroupUnit) => {
    if (
      (GlobalGameState.gamePhase !== GlobalGameState.PHASE.AIR_OPERATIONS &&
        GlobalGameState.gamePhase !== GlobalGameState.PHASE.AIR_SEARCH) ||
      controller.getAirUnitsInStrikeGroups(strikeGroupUnit.box).length === 0
    ) {
      return
    }

    // determine how many counters already in this hex
    // if any, set index to pass in to counter -> this will be used for zIndex and offset

    const location = strikeGroupUnit.side === GlobalUnitsModel.Side.US ? currentUSHex : currentJapanHex
    let index = 0
    let hex = {
      currentHex: location,
    }
    const groups = controller.getAllStrikeGroupsInLocation(hex, strikeGroupUnit.side)
    index = groups.length
    return (
      <StrikeCounter
        setStrikeGroupPopup={setStrikeGroupPopup}
        counterData={strikeGroupUnit}
        side={strikeGroupUnit.side}
        currentUSHex={currentUSHex}
        currentJapanHex={currentJapanHex}
        index={index}
      ></StrikeCounter>
    )
  })
  return (
    <>
      {sgCounters}
      {showPopup && (
        <StrikeGroupPopUp
          strikeGroup={strikeGroupsAtLocation}
          side={side}
          popUpPosition={popUpPosition}
          hex={hex}
        ></StrikeGroupPopUp>
      )}
    </>
  )
}

export default StrikeCounters
