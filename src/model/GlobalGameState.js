import GlobalUnitsModel from './GlobalUnitsModel';

export default class GlobalGameState {

  static PHASE = {
    JAPAN_SETUP: "Japan Setup",
    JAPAN_CARD_DRAW: "Japan Card Draw",
    US_SETUP_FLEET: "US Setup (Naval)",
    US_SETUP_AIR: "US Setup (Air)",
    US_CARD_DRAW: "US Card Draw",
    BOTH_CARD_DRAW: "Draw Cards",
    JAPAN_MIDWAY: "Japan Midway Attack Declaration",
    US_FLEET_MOVEMENT_PLANNING: "US Fleet Movement Planning",
    JAPAN_FLEET_MOVEMENT: "IJN Fleet Movement",
    MIDWAY_ATTACK: "Midway Attack Phase",
    US_FLEET_MOVEMENT: "US Fleet Movement",
    AIR_SEARCH: "Search Phase",
    AIR_OPERATIONS: "Air Operations Phase"
  }

  static usSetUpComplete = false

  static SETUP_MESSAGES = [
    'Place Akagi Air Units',
    'Place Kaga Air Units',
    'Place Hiryu Air Units',
    'Place Soryu Air Units',
    'Draw 3 x Japan Cards',
    'Place US CSF Fleet Unit',
    'Place Enterprise Air Units',
    'Place Hornet Air Units',
    'Place Yorktown Air Units',
    'Place Midway Air Units',
    'Draw 2 x US Cards'
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
    GlobalUnitsModel.Carrier.YORKTOWN,
    GlobalUnitsModel.Carrier.MIDWAY,
  ]

  static gameTurn = 1;

  static currentCarrier = 0
  static currentCarrierDivision = 1

  static currentTaskForce = 1
  
  static airOperationPoints = {
    japan: 0,
    us: 0,
  };

  static stateHandler = () => {};

  static dieRolls = new Array()
  
  static midwayInvasionLevel = 5;

  static midwayGarrisonLevel = 6;

  static midwayAttackDeclaration = false

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

  static usFleetPlaced = false
  static usFleetMoved = false
  static jpFleetPlaced = false
  static jpFleetMoved = false

  static phaseCompleted = false

  static updateGlobalState = () => {
    this.stateHandler();
  }

  static log = (message) => {
    this.logItems.push(message);
    this.stateHandler();
  };

  static logItems = ["Logging begin..."];

  // static gamePhase = this.PHASE.US_SETUP_AIR // tmp: put back to Japan
  static gamePhase = this.PHASE.JAPAN_SETUP // tmp: put back to Japan

  // static setupPhase = 6; // tmp put back to 0
  static setupPhase = 0; // tmp put back to 0

  static getJapanCarrier = () => {
    return this.JAPAN_CARRIERS[this.setupPhase]
  }

  static getUSCarrier = () => {
    return this.US_CARRIERS[this.setupPhase - 6]
  }


  static getSetupMessage = () => {
    return this.SETUP_MESSAGES[this.setupPhase]
  }
}
