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
    INITIATIVE_DETERMINATION: "Initiative Determination",
    AIR_OPERATIONS: "Air Operations Phase",
    END_OF_AIR_OPERATION: "Air Operations Tidy Up",
    TARGET_DETERMINATION: "Target Determination Phase",
    CAP_INTERCEPTION:"CAP Interception Phase",
    AIR_ATTACK_1: "Attack Resolution Phase (1)",
    AIR_ATTACK_2: "Attack Resolution Phase (2)",
    ATTACK_DAMAGE_RESOLUTION: "Damage on Aircraft Carriers",
    MIDWAY_DAMAGE_RESOLUTION: "Damage to Midway Base",
    CAP_DAMAGE_ALLOCATION: "CAP Damage Allocation Phase",
    ESCORT_COUNTERATTACK: "Escort Fighter Counterattack Phase",
    ESCORT_DAMAGE_ALLOCATION: "Escort Damage Allocation Phase",
    AAA_DAMAGE_ALLOCATION: "AAA Fire Damage Allocation Phase",
    ANTI_AIRCRAFT_FIRE: "Anti-Aircraft (AAA) Fire Phase",
    ATTACK_TARGET_SELECTION: "Target Selection"
  }

  static nextActionButtonDisabled=false
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
  
  static eliminatedAirUnits = new Array()
  static orphanedAirUnits = new Array()

  static midwayAirOpsCompleted = 0
  
  static airOperationPoints = {
    japan: 0,
    us: 0,
  }

  static taskForceTarget = ""
  static currentCarrierAttackTarget=""

  static attackingStrikeGroup= undefined
  
  // Can attack both carriers in a task force
  static carrierTarget1=""
  static carrierTarget2=""

  
  static stateHandler = () => {};

  static dieRolls = new Array()

  static carrierHitsDetermined = false
  
  static midwayInvasionLevel = 5;

  static midwayGarrisonLevel = 6;

  static midwayAttackDeclaration = false

  static totalMidwayHits = 0
  static midwayHits = 0
  static midwayHitsThisAttack = 0
  static midwayBox0Damaged = false
  static midwayBox1Damaged = false
  static midwayBox2Damaged = false

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

  static sideWithInitiative = ""
  static allStrikeUnitsReturned = false

  static updateGlobalState = () => {
    this.stateHandler();
  }

  static loading = false

  static log = (message) => {
    this.logItems.push(message);
    this.stateHandler();
  };

  static logItems = ["Logging begin..."];

  // static gamePhase = this.PHASE.US_SETUP_AIR // tmp: put back to Japan
  static gamePhase = this.PHASE.JAPAN_SETUP // tmp: put back to Japan

  // static setupPhase = 6; // tmp put back to 0
  static setupPhase = 0; // tmp put back to 0

  static isFirstAirOp = true

  static airOpJapan = 0 // count which air op this is
  static airOpUS = 0
  
  static airAttacksComplete = false; // set to true after all air attacks - triggers CAP return etc

  static capHits = undefined
  static fighterHits = undefined
  static attackingStepsRemaining = undefined
  static antiaircraftHits = undefined

  static carrierAttackHits = undefined
  static carrierAttackHitsThisAttack = undefined

  static carrierDamageRoll = undefined

  static damageThisAttack = undefined

  static midwayAirOp = 1 // can be two air ops in Midway attack

  static nextAvailableDamageMarker = 0
  static nextAvailableSunkMarker = 0
  
  static SearchValue = {
    JP_AF: 6,
    US_CSF: 7,
    US_MIDWAY: 8,
  }

  static getJapanCarrier = () => {
    return this.JAPAN_CARRIERS[this.setupPhase]
  }

  static getUSCarrier = () => {
    return this.US_CARRIERS[this.setupPhase - 6]
  }


  static getSetupMessage = () => {
    return this.SETUP_MESSAGES[this.setupPhase]
  }

  // TEST STATES
  static testTarget = undefined
  static rollDice = undefined
  static closePanel = undefined
  static testCapSelection = undefined
  static testStepLossSelection = undefined
  static testCarrierSelection = undefined
}
