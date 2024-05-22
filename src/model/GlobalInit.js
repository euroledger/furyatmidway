import loadCounters from "../Loader";
import Controller from "../controller/Controller";

export default class GlobalInit {
  static controller = new Controller()
  static counters = loadCounters(this.controller)
}
