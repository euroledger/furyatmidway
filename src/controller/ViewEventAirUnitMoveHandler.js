import GlobalGameState from "../model/GlobalGameState"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import MoveCommand from "../commands/MoveCommand"
import COMMAND_TYPE from "../commands/COMMAND_TYPE"

class ViewEventAirUnitMoveHandler {
  constructor(controller) {
    this.controller = controller
  }
  handleEvent(event) {
    // event contains type and data
    const { counterData, name, index, side, loading } = event.data

    const { boxName, boxIndex } = this.controller.getAirUnitLocation(counterData.name)

    let from = boxName + " - box " + boxIndex
    if (boxName === GlobalUnitsModel.AirBox.OFFBOARD) {
      from = "OFFBOARD"
    } else if (boxName === GlobalUnitsModel.AirBox.JP_ELIMINATED) {
      from = "JAPAN ELIMINATED"
    } else if (boxName === GlobalUnitsModel.AirBox.US_ELIMINATED) {
      from = "US ELIMINATED"
    }
    // let from = boxName === GlobalUnitsModel.AirBox.OFFBOARD ? "OFFBOARD" : boxName + " - box " + boxIndex

    const to =
      name === GlobalUnitsModel.AirBox.JP_ELIMINATED || name === GlobalUnitsModel.AirBox.US_ELIMINATED
        ? name
        : `${name} - box ${index}`

    if (name.includes("STRIKE BOX")) {
      counterData.launchedFrom = boxName
    }

    // if unit lands on a carrier other than its parent, reset its parent
    // this can happen if parent carrier is sunk or damaged

    // NEEDS TO BE TESTED
    if (name.includes("FLIGHT_DECK") || name.includes("HANGAR")) {
      const carrierMovingTo = this.controller.getCarrierForAirBox(name)
      if (carrierMovingTo !== counterData.carrier) {
        counterData.carrier = carrierMovingTo
      }
    }

    console.log("DEBUG ADD AIR UNIT", counterData.name, "TO BOX", name)
    this.controller.addAirUnitToBox(name, index, counterData)
    let command = new MoveCommand(COMMAND_TYPE.MOVE_AIR_UNIT, counterData.longName, from, to)

    if (!loading && counterData.side === GlobalGameState.sideWithInitiative) {
      // CAP returns don't set to moved = true
      // if this is Night Air Operations and the destination is the hangar - do not set to moved as they
      // can move again

      // if this is Night Air Operations and the destination is return2 - as this the rare edge case
      // of a unit stuck at sea from previous turns
      if (
        (GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_JAPAN ||
          GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_US) &&
        (to.includes("RETURNING (2)") || to.includes("RETURNING (1)"))

        
      ) {
        // do nothing
      } else {
        if (
          (GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_JAPAN ||
            GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_US) &&
          to.includes("HANGAR")
        ) {
          // do nothing
        } else {
          counterData.aircraftUnit.moved = true
          counterData.aircraftUnit.turnMoved = GlobalGameState.gameTurn
        }
      }
    }
    console.log("DEBUG >>>>>>>>>>>> SET BORDER TO UNDEFINED:", counterData.name)
    counterData.border = undefined
    GlobalGameState.log(`${command.toString()}`)
  }
}
export default ViewEventAirUnitMoveHandler
