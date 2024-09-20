import loadCounters from "../CounterLoader";
import loadCards from "../CardLoader";
import Controller from "../controller/Controller";

export default class GlobalInit {
  static controller = new Controller()
  static counters = loadCounters(this.controller)
  static cards = loadCards()
}
