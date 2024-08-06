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
    const from = boxName === GlobalUnitsModel.AirBox.OFFBOARD ? "OFFBOARD" : boxName + " - box " + boxIndex
    const to = `${name} - box ${index}`

    this.controller.addAirUnitToBox(name, index, counterData)
    let command = new MoveCommand(COMMAND_TYPE.MOVE, counterData.longName, from, to)

    if (name.includes("STRIKE")) {
      const strikeBox =
        side === GlobalUnitsModel.Side.JAPAN
          ? GlobalUnitsModel.jpStrikeGroups.get(name)
          : GlobalUnitsModel.usStrikeGroups.get(name)
      // Add unit to list of units for the strike group
      strikeBox.units.push(counterData)
    }

    if (from.includes("STRIKE")) {
      // unit has moved from strike box - remove
      const strikeBox =
        side === GlobalUnitsModel.Side.JAPAN
          ? GlobalUnitsModel.jpStrikeGroups.get(boxName)
          : GlobalUnitsModel.usStrikeGroups.get(boxName)
      // remove unit from list of units for the strike group
      strikeBox.units = strikeBox.units.filter((unit) => unit.name !== counterData.name)
    }

    if (!loading) {
      counterData.aircraftUnit.moved = true
    }
    GlobalGameState.log(`Command: ${command.toString()}`)
  }
}
export default ViewEventAirUnitMoveHandler
