import loadCounters from "../CounterLoader";
import loadCards from "../CardLoader";
import Controller from "../controller/Controller";
import buildModels from "../model/UnitModel"

export default class GlobalInit {
  static controller = new Controller()
  static counters = loadCounters(this.controller)
  static cards = loadCards()

  static {
    buildModels()
  }
}
