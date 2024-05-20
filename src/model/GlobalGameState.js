import loadCounters from "../Loader";
import Controller from "../controller/Controller";
import GlobalUnitsModel from './GlobalUnitsModel';

export default class GlobalGameState {

  static PHASE = {
    SETUP: 1,
    MOVE: 2
  }

  static SETUP_MESSAGES = [
    'Place Akagi Air Units',
    'Place Kaga Air Units',
    'Place Hiryu Air Units',
    'Place Soryu Air Units'
  ]

  static JAPAN_CARRIERS = [
    GlobalUnitsModel.japanCarriers.AKAGI,
    GlobalUnitsModel.japanCarriers.KAGA,
    GlobalUnitsModel.japanCarriers.HIRYU,
    GlobalUnitsModel.japanCarriers.SORYU,
  ]

  static gameTurn = 1;

  static currentCarrier = 0

  static airOperationPoints = {
    japan: 0,
    us: 0,
  };

  static stateHandler;

  static midwayInvasionLevel = 5;

  static midwayGarrisonLevel = 6;

  static turnText = [
    "June 4, 1942 Morning",
    "June 4, 1942 Afternoon",
    "June 4, 1942 Evening",
    "June 5, 1942 Night",
    "June 5, 1942 Morning",
    "June 5, 1942 Afternoon",
    "June 5, 1942 Evening",
  ];

  static log = (message) => {
    this.logItems.push(message);
    this.stateHandler();
  };

  static logItems = ["Logging begin..."];

  static gamePhase = this.PHASE.SETUP
  static setupPhase = 0;

  static getCarrier = () => {
    console.log("FUCKING OIN HERE>................carriers = ", this.JAPAN_CARRIERS)
    console.log("PISS FUCK     GlobalUnitsModel.AKAGI = ", GlobalUnitsModel.japanCarriers.AKAGI)

    return this.JAPAN_CARRIERS[this.setupPhase]
  }

  static getSetupMessage = () => {
    return this.SETUP_MESSAGES[this.setupPhase]
  }
  static controller = new Controller()
  static counters = loadCounters(this.controller)
}
