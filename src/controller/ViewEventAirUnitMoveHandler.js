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
    let from = boxName === GlobalUnitsModel.AirBox.OFFBOARD ? "OFFBOARD" : boxName + " - box " + boxIndex

    let idx = index
    // console.trace()
    if (idx === -1) {
      idx = this.controller.getFirstAvailableZone(name)
    }
    const to =
      name === GlobalUnitsModel.AirBox.JP_ELIMINATED || name === GlobalUnitsModel.AirBox.US_ELIMINATED
        ? name
        : `${name} - box ${idx}`

    this.controller.addAirUnitToBox(name, idx, counterData)
    let command = new MoveCommand(COMMAND_TYPE.MOVE_AIR_UNIT, counterData.longName, from, to)

    if (!loading) {
      counterData.aircraftUnit.moved = true
    }
    GlobalGameState.log(`${command.toString()}`)
  }
}
export default ViewEventAirUnitMoveHandler
