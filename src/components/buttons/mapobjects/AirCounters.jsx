import React, { useContext } from "react"
import "../../board.css"
import AirCounter from "./AirCounter"
import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import { BoardContext } from "../../../App"

function AirCounters({ controller, onDrag, onStop, getAirBox, setAirBox, counterData, airUnitUpdate, setAlertShow }) {
  const { loading } = useContext(BoardContext)
  const counters = Array.from(counterData.values())

  const airunits = counters.filter((unit) => unit.constructor.name === "AirUnit")

  const airCounters = airunits.map((airUnit) => {
    const location = controller.getAirUnitLocation(airUnit.name)

    if (
      location.boxName === GlobalUnitsModel.AirBox.JP_ELIMINATED ||
      location.boxName === GlobalUnitsModel.AirBox.US_ELIMINATED
    ) {
      return
    }
    if (airUnit.side === GlobalUnitsModel.Side.JAPAN) {
      const carrierIndex = GlobalGameState.JAPAN_CARRIERS.indexOf(airUnit.carrier)
      if (
        carrierIndex > GlobalGameState.currentCarrier &&
        GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_SETUP
      ) {
        return
      }
    } else {
      const carrierIndex = GlobalGameState.US_CARRIERS.indexOf(airUnit.carrier)
      if (
        !GlobalGameState.usSetUpComplete &&
        (carrierIndex > GlobalGameState.currentCarrier ||
          (GlobalGameState.gamePhase !== GlobalGameState.PHASE.US_SETUP_AIR && GlobalGameState.gamePhase !== "LOADING"))
      ) {
        return
      }
    }
    return (
      <AirCounter
        controller={controller}
        key={airUnit.name}
        onDrag={onDrag}
        onStop={onStop}
        counterData={airUnit}
        getAirBox={getAirBox}
        setAirBox={setAirBox}
        airUnitUpdate={airUnitUpdate}
        setAlertShow={setAlertShow}
        side={airUnit.side}
      ></AirCounter>
    )
  })

  return <>{airCounters}</>
}

export default AirCounters
