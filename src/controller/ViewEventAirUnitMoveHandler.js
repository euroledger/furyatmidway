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
      // console.log("UNIT", counterData.name, "moving to", name)
      // console.log("AND IT WAS LAUNCHED FROM", boxName)
      counterData.launchedFrom = boxName
    }
    this.controller.addAirUnitToBox(name, index, counterData)
    let command = new MoveCommand(COMMAND_TYPE.MOVE_AIR_UNIT, counterData.longName, from, to)

    if (!loading && counterData.side === GlobalGameState.sideWithInitiative) {
      // CAP returns don't set to moved = true
      // if this is Night Air Operations and the destination is the hangar - do not set to moved as they
      // can move again
      if (
        (GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_JAPAN ||
          GlobalGameState.gamePhase === GlobalGameState.PHASE.NIGHT_AIR_OPERATIONS_US) &&
        to.includes("HANGAR")
      ) {
      } else {
        counterData.aircraftUnit.moved = true
      }
    }
    counterData.border = undefined
    GlobalGameState.log(`${command.toString()}`)
  }
}
export default ViewEventAirUnitMoveHandler
