import GlobalUnitsModel from './GlobalUnitsModel';

export default class GlobalGameState {

  static PHASE = {
    JAPAN_SETUP: "Japan Setup",
    JAPAN_CARD_DRAW: "Japan Card Draw",
    US_SETUP: "US Setup",
    US_CARD_DRAW: "US Card Draw"
  }


  static SETUP_MESSAGES = [
    'Place Akagi Air Units',
    'Place Kaga Air Units',
    'Place Hiryu Air Units',
    'Place Soryu Air Units',
    'Draw 3 x Japan Cards',
    'Place US CSF Fleet Unit',
    'Place Enterprise Air Units',
    'Place Hornet Air Units',
    'Place Yorkton Air Units',
    'Draw 3 x US Cards'
  ]

  static JAPAN_CARRIERS = [
    GlobalUnitsModel.Carrier.AKAGI,
    GlobalUnitsModel.Carrier.KAGA,
    GlobalUnitsModel.Carrier.HIRYU,
    GlobalUnitsModel.Carrier.SORYU
  ]

  static US_CARRIERS = [
    GlobalUnitsModel.Carrier.ENTERPRISE,
    GlobalUnitsModel.Carrier.HORNET,
    GlobalUnitsModel.Carrier.YORKTOWN
  ]

  static gameTurn = 1;

  static currentCarrier = 0
  static currentCarrierDivision = 1

  static airOperationPoints = {
    japan: 0,
    us: 0,
  };

  static stateHandler = () => {};

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

  static jpCardsDrawn = false
  static usCardsDrawn = false

  static phaseCompleted = false

  static updateGlobalState = () => {
    this.stateHandler();
  }

  static log = (message) => {
    this.logItems.push(message);
    this.stateHandler();
  };

  static logItems = ["Logging begin..."];

  static gamePhase = this.PHASE.JAPAN_SETUP
  static setupPhase = 0;

  static getJapanCarrier = () => {
    return this.JAPAN_CARRIERS[this.setupPhase]
  }

  static getUSCarrier = () => {
    return this.US_CARRIERS[this.setupPhase -5]
  }

  static getSetupMessage = () => {
    return this.SETUP_MESSAGES[this.setupPhase]
  }
}
