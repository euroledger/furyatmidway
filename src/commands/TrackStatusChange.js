import Command from "./Command"

class TrackStatusChange extends Command {
  constructor(commandType, track, level) {
    super(commandType)
    this.track = track
    this.level = level
  }
  execute() {}

  toString() {
    return `${this.commandType} Track ${this.track} now at level ${this.level}`
  }
}

export default TrackStatusChange
