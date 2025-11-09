import Command from "./Command"

class CarrierDamageCommand extends Command {
  constructor(commandType, side, damage) {
    super(commandType)
    this.side = side
    this.damage = damage
  }
  execute() {}

  toString() {
    return `${this.commandType} ${this.side} Damage to Carrier ${this.damage}`
  }
}

export default CarrierDamageCommand
