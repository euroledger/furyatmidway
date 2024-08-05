import "../../board.css"
import GlobalGameState from "../../../model/GlobalGameState"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import StrikeCounter from "./StrikeCounter"

function StrikeCounters({ controller, onDrag, onStop, counterData }) {
  const counters = Array.from(counterData.values())

  const strikeUnits = counters.filter((unit) => unit.constructor.name === "StrikeGroupUnit")

  const sgCounters = strikeUnits.map((strikeGroupUnit) => {
    let currHex
    if (strikeGroupUnit.side === GlobalUnitsModel.Side.JAPAN) {
    } else {
      // only display this counter if we are US in the Air Operations phase and there
      // is at least one air unit in this strike group
      if (GlobalGameState.gamePhase !== GlobalGameState.PHASE.AIR_OPERATIONS || strikeGroupUnit.units.length === 0) {
        return
      } else {
        currHex = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
      }
    }

    return (
      <StrikeCounter currentHex={currHex} counterData={strikeGroupUnit} side={strikeGroupUnit.side}></StrikeCounter>
    )
  })

  return <>{sgCounters}</>
}

export default StrikeCounters
