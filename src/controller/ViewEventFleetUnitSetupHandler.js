import GlobalGameState from "../model/GlobalGameState"
import COMMAND_TYPE from "../commands/COMMAND_TYPE"
import HexCommand from "../commands/HexCommand"
import MoveOffMapCommand from "../commands/MoveOffMapCommand"
import GlobalUnitsModel from "../model/GlobalUnitsModel"

class ViewEventFleetUnitSetupHandler {
  constructor(controller) {
    this.controller = controller
    this.lastMsg = ""
  }
  handleEvent(event) {
    // event contains type and data
    const { initial, id, from, to, side, box } = event.data

    // to = currentHex
    // add fleet unit to map holding name -> current Hex

    if (to.boxName === HexCommand.FLEET_BOX) {
      let to = {
        boxName: HexCommand.FLEET_BOX,
        boxIndex: box
      }

      this.controller.setFleetUnitLocation(id, to, side)
      if (side === GlobalUnitsModel.Side.US && id.includes("CSF")) {
        if (!this.controller.allCarriersSunkorDMCV(side)) {
          GlobalGameState.CSFLeftMap = true
        }
      } else {
        if (!this.controller.allCarriersSunkorDMCV(side) && id.includes("1AF")) {
          GlobalGameState.AF1LeftMap = true
        }
      }
    } else {
      this.controller.setFleetUnitLocation(id, to, side)
    }
  
    if (id.includes("MAP")) {
      // no need to log fleet movements on the other side's map (for now)
      return
    }
    let cmdType = COMMAND_TYPE.MOVE_FLEET_UNIT

    if (to.boxName === HexCommand.FLEET_BOX) {
      let command = new MoveOffMapCommand(cmdType, side, id, box)
      GlobalGameState.log(`${command.toString()}`)
      return
    }

    if (initial) {
      cmdType = COMMAND_TYPE.PLACE
    }
    let command = new HexCommand(cmdType, id, from, to, side, box)

    // hack to avoid duplicate messages
    if (command.toString() !== this.lastMsg) {
      GlobalGameState.log(`${command.toString()}`)
      this.lastMsg = command.toString()
    }
  }
}
export default ViewEventFleetUnitSetupHandler
