import GlobalGameState from "../model/GlobalGameState"
import COMMAND_TYPE from "../commands/COMMAND_TYPE"
import DiceCommand from "../commands/DiceCommand"
import CarrierDamageCommand from "../commands/CarrierDamageCommand"
import MidwayDamageCommand from "../commands/MidwayDamageCommand"

class ViewEventCarrierDamageHandler {
  constructor(controller) {
    this.controller = controller
  }

  handleCarrierDamageEvent(event) {
    // data: {
    //   target: GlobalGameState.currentCarrierAttackTarget,
    //   side: sideBeingAttacked,
    //   roll: GlobalGameState.carrierDamageRoll,
    //   bowDamage,
    //   sternDamage,
    //   isSunk
    // },
    const { target, side, roll, damage } = event.data

    if (roll !== undefined) {
      let command = new DiceCommand(event.type, null, null, roll, side, null, target)
      GlobalGameState.log(`${command.toString()}`)
    }
    if (damage.sunk) {
      let command = new CarrierDamageCommand(COMMAND_TYPE.CARRIER_SUNK, side, target)
      GlobalGameState.log(`${command.toString()}`)
    } else {
      if (damage.bow) {
        let command = new CarrierDamageCommand(COMMAND_TYPE.CARRIER_DAMAGE_BOW, side, target)
        GlobalGameState.log(`${command.toString()}`)
      }
      if (damage.stern) {
        let command = new CarrierDamageCommand(COMMAND_TYPE.CARRIER_DAMAGE_STERN, side, target)
        GlobalGameState.log(`${command.toString()}`)
      }
    }
  }

  handleMidwayDamageEvent(event) {
    const { target, side, roll, damage } = event.data
    if (roll !== undefined) {
      let command = new DiceCommand(event.type, null, null, roll, side, null, target)
      GlobalGameState.log(`${command.toString()}`)
    }
    if (damage.destroyed) {
      let command = new MidwayDamageCommand(COMMAND_TYPE.MIDWAY_BASE_DESTROYED, "Midway Base Destroyed")
      GlobalGameState.log(`${command.toString()}`)
    } else {
      if (damage.box0) {
        let command = new MidwayDamageCommand(COMMAND_TYPE.MIDWAY_DAMAGE_BOX, "Box 1 Damaged")
        GlobalGameState.log(`${command.toString()}`)
      }
      if (damage.box1) {
        let command = new MidwayDamageCommand(COMMAND_TYPE.MIDWAY_DAMAGE_BOX, "Box 2 Damaged")
        GlobalGameState.log(`${command.toString()}`)
      }
      if (damage.box2) {
        let command = new MidwayDamageCommand(COMMAND_TYPE.MIDWAY_DAMAGE_BOX, "Box 3 Damaged")
        GlobalGameState.log(`${command.toString()}`)
      }
    }
  }
}
export default ViewEventCarrierDamageHandler
