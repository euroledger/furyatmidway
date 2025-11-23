import GlobalGameState from "../model/GlobalGameState"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import MoveCommand from "../commands/MoveCommand"
import COMMAND_TYPE from "../commands/COMMAND_TYPE"
import { determineAllUnitsDeployedForCarrier } from "./AirUnitSetupHandler"

class ViewEventAirUnitSetupHandler {
  constructor(controller) {
    this.controller = controller
  }
  handleEvent(event) {
    // event contains type and data
    const { counterData, name, index, side } = event.data

    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.CAP_RETURN) {
      counterData.border = undefined
    }
    const { boxName, boxIndex } = this.controller.getAirUnitLocation(counterData.name)
    const from = boxName === GlobalUnitsModel.AirBox.OFFBOARD ? "OFFBOARD" : boxName + " - box " + boxIndex
    const to = `${name} - box ${index}`

    this.controller.addAirUnitToBox(name, index, counterData)
    let command = new MoveCommand(COMMAND_TYPE.MOVE_AIR_UNIT, counterData.longName, from, to)
    determineAllUnitsDeployedForCarrier(this.controller, side, counterData.carrier)

    GlobalGameState.log(`${command.toString()}`)
  }
}
export default ViewEventAirUnitSetupHandler
