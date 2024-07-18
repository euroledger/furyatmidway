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

    const { boxName, boxIndex } = this.controller.getAirUnitLocation(counterData.name)
    const from = boxName === GlobalUnitsModel.AirBox.OFFBOARD ? "OFFBOARD" : boxName + " - box " + boxIndex
    const to = `${name} - box ${index}`

    // console.log(`Add air unit ${counte rData.name} to box ${name}, index ${index}`)
    this.controller.addAirUnitToBox(name, index, counterData)
    let command = new MoveCommand(COMMAND_TYPE.MOVE, counterData.longName, from, to)
    // console.log("Next free zone -> ", this.controller.getFirstAvailableZone(name))

    determineAllUnitsDeployedForCarrier(this.controller, side, counterData.carrier)
    GlobalGameState.log(`Command: ${command.toString()}`)
  }
}
export default ViewEventAirUnitSetupHandler
