import loadCounters from "../Loader";
import Controller from "../controller/Controller";
import buildModels from "../model/UnitModel"

export default class GlobalInit {
  static controller = new Controller()
  static counters = loadCounters(this.controller)

  static {
    buildModels()
  }
}
