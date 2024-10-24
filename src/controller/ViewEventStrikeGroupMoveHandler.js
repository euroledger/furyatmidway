import GlobalGameState from "../model/GlobalGameState"
import COMMAND_TYPE from "../commands/COMMAND_TYPE"
import HexCommand from "../commands/HexCommand"
import GlobalUnitsModel from "../model/GlobalUnitsModel"

class ViewEventStrikeGroupMoveHandler {
  constructor(controller) {
    this.controller = controller
  }
  handleEvent(event) {
    const { initial, counterData, from, to, side, loading, moved, attacked, setCardNumber } = event.data

    // add strike group to map holding name -> current Hex
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

      if (this.controller.checkForAirAttack(to, side)) {
        this.controller.setAirOpAttacked(counterData)

        if (GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_ATTACK) {
          if (this.controller.japanHandContainsCard(9)) {
            GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
            setCardNumber(() => 9)
          } else {
            GlobalGameState.gamePhase = GlobalGameState.PHASE.CAP_INTERCEPTION
          }
          GlobalGameState.taskForceTarget = GlobalUnitsModel.TaskForce.MIDWAY
        } else {
          if (this.controller.japanHandContainsCard(11)) {
            GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
            setCardNumber(() => 11)
          } else {
            GlobalGameState.gamePhase = GlobalGameState.PHASE.TARGET_DETERMINATION
          }
        }

        // @TODO we may need a global state reset function that
        // gets invoked before each air strike move
        this.controller.resetTargetMap()
        GlobalGameState.carrierTarget1 = ""
        GlobalGameState.carrierTarget2 = ""
        counterData.attacked = true
        GlobalGameState.attackingStrikeGroup = counterData
      }
    } else {
      counterData.moved = moved
      counterData.attacked = attacked
    }
  }
}
export default ViewEventStrikeGroupMoveHandler
