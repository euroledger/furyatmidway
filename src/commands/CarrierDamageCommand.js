import Command from "./Command"

class CarrierDamageCommand extends Command {
  constructor(commandType, side, damage) {
    super(commandType)
    this.side = side
    this.damage = damage
  }
  execute() {}

  toString() {
    return `${this.commandType} ${this.side} Damage: ${this.damage}`
  }
}

export default CarrierDamageCommand
