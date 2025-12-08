import GlobalGameState from "../model/GlobalGameState"
import Command from "./Command"

class MIFHitsCommand extends Command {
  constructor(commandType, side, hits) {
    super(commandType)
    this.side = side
    this.hits = hits
  }
  execute() {}

  toString() {
    let mif = GlobalGameState.midwayInvasionLevel
    return `${this.commandType} Hits: ${this.hits}, Midway Invasion Force now ${mif}`
  }
}

export default MIFHitsCommand
