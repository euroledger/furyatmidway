import GlobalGameState from "../model/GlobalGameState"
import COMMAND_TYPE from "../commands/COMMAND_TYPE";
import DiceCommand from "../commands/DiceCommand";
import CarrierDamageCommand from "../commands/CarrierDamageCommand";


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

    console.log("CARRIER DAMAGE EVENT, damage=", damage)
    if (roll !== undefined) {
      let command = new DiceCommand(event.type, null, null, roll, side, null, target)
      GlobalGameState.log(`${command.toString()}`)
    } 
    if (damage.sunk) {
      let command = new CarrierDamageCommand(side, target, COMMAND_TYPE.CARRIER_SUNK)
      GlobalGameState.log(`${command.toString()}`)
    } else {
      if (damage.bow) {
        let command = new CarrierDamageCommand(side, target, COMMAND_TYPE.CARRIER_DAMAGE_BOW)
        GlobalGameState.log(`${command.toString()}`)
      }
      if (damage.stern) {
        let command = new CarrierDamageCommand(side, target, COMMAND_TYPE.CARRIER_DAMAGE_STERN)
        GlobalGameState.log(`${command.toString()}`)
      }
    } 
  
  }
}
export default ViewEventCarrierDamageHandler
