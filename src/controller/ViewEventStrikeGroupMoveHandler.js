import GlobalGameState from "../model/GlobalGameState"
import COMMAND_TYPE from "../commands/COMMAND_TYPE"
import HexCommand from "../commands/HexCommand"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import { setUpAirAttack } from "./AirAttackHandler"
class ViewEventStrikeGroupMoveHandler {
  constructor(controller) {
    this.controller = controller
  }
  handleEvent(event) {
    const { initial, counterData, from, to, side, loading, moved, attacked } = event.data

    // add strike group to map holding name -> current Hex
    console.log("SET SG LOCATION,", counterData.name)
    this.controller.setStrikeGroupLocation(counterData.name, to, side)

    if (side === GlobalUnitsModel.Side.JAPAN) {
      const box = GlobalUnitsModel.jpStrikeGroups.get(counterData.box)
      box.location = to
      GlobalUnitsModel.jpStrikeGroups.set(counterData.box, box)
    } else {
      const box = GlobalUnitsModel.usStrikeGroups.get(counterData.box)
      box.location = to
      GlobalUnitsModel.usStrikeGroups.set(counterData.box, box)
    }

    let cmdType = COMMAND_TYPE.MOVE_STRIKE_GROUP
    if (initial) {
      cmdType = COMMAND_TYPE.PLACE
    }
    let command = new HexCommand(cmdType, counterData.longName, from, to, side)

    GlobalGameState.log(`${command.toString()}`)

    if (!loading) {
      counterData.moved = true
      if (counterData.airOpMoved === undefined) {
        this.controller.setAirOpMoved(counterData)
      }
    } else {
      counterData.moved = moved
      counterData.attacked = attacked
    }
  }
}
export default ViewEventStrikeGroupMoveHandler
