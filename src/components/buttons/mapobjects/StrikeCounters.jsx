import "../../board.css"
import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import StrikeCounter from "./StrikeCounter"

function StrikeCounters({ controller, onDrag, onStop, counterData, currentUSHex, currentJapanHex }) {
  const counters = Array.from(counterData.values())

  const strikeUnits = counters.filter((unit) => unit.constructor.name === "StrikeGroupUnit")

  const sgCounters = strikeUnits.map((strikeGroupUnit) => {
    if (strikeGroupUnit.side === GlobalUnitsModel.Side.JAPAN) {

      if (GlobalGameState.gamePhase !== GlobalGameState.PHASE.AIR_OPERATIONS || strikeGroupUnit.units.length === 0) {
        return
      } 

    } else {
      // only display this counter if we are US in the Air Operations phase and there
      // is at least one air unit in this strike group

      if (GlobalGameState.gamePhase !== GlobalGameState.PHASE.AIR_OPERATIONS || strikeGroupUnit.units.length === 0) {
        return
      } 
    }

    return (
      <StrikeCounter
        counterData={strikeGroupUnit}
        side={strikeGroupUnit.side}
        currentUSHex={currentUSHex}
        currentJapanHex={currentJapanHex}
      ></StrikeCounter>
    )
  })

  return <>{sgCounters}</>
}

export default StrikeCounters
