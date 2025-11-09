import GlobalUnitsModel from "./GlobalUnitsModel"

export default class GlobalGameState {
  static DELAY = 10
  static replay = false

  static PHASE = {
    ERROR: "ERROR",
    JAPAN_SETUP: "Japan Setup",
    JAPAN_CARD_DRAW: "Japan Card Draw",
    US_SETUP_FLEET: "US Setup (Naval)",
    US_SETUP_AIR: "US Setup (Air)",
    US_CARD_DRAW: "US Card Draw",
    BOTH_CARD_DRAW: "Draw Cards",
    US_DRAWS_ONE_CARD: "US Card Draw Phase",
    JAPAN_DRAWS_ONE_CARD: "Japan Card Draw Phase",
    CARD_PLAY: "Possible Card Play",
    CARD_RESPONSE: "Response to Card Play", // eg AI having to select step losses for a human played card
    JAPAN_MIDWAY: "IJN Midway Attack Declaration",
    US_FLEET_MOVEMENT_PLANNING: "US Fleet Movement Planning",
    US_DMCV_FLEET_MOVEMENT_PLANNING: "US DMCV Fleet Movement Planning",
    JAPAN_FLEET_MOVEMENT: "IJN Fleet Movement",
    JAPAN_DMCV_FLEET_MOVEMENT: "IJN DMCV Fleet Movement",
    MIDWAY_ATTACK: "Midway Attack Phase",
    US_FLEET_MOVEMENT: "US Fleet Movement",
    RETREAT_US_FLEET: "Fleets in Same Hex",
    NIGHT_BATTLES_1: "Surface Sea Battle CSF",
    NIGHT_BATTLES_2: "Surface Sea Battle DMCV",
    NIGHT_AIR_OPERATIONS_JAPAN: "Night Air Operations (Japan)",
    NIGHT_AIR_OPERATIONS_US: "Night Air Operations (US)",
    AIR_SEARCH: "Search Phase",
    INITIATIVE_DETERMINATION: "Initiative Determination",
    AIR_OPERATIONS: "Air Operations Phase",
    CAP_RETURN: "CAP Air Units Return",
    END_OF_AIR_OPERATION: "Air Operations Tidy Up",
    END_OF_TURN: "End of Turn",
    END_OF_GAME: "End of Game",
    MIDWAY_INVASION: "Midway Invasion",
    TARGET_DETERMINATION: "Target Determination Phase",
    CAP_INTERCEPTION: "CAP Interception Phase",
    AIR_ATTACK_1: "Attack Resolution Phase (1)",
    AIR_ATTACK_2: "Attack Resolution Phase (2)",
    ATTACK_DAMAGE_RESOLUTION: "Damage on Aircraft Carriers",
    MIDWAY_DAMAGE_RESOLUTION: "Damage to Midway Base",
    CAP_DAMAGE_ALLOCATION: "CAP Damage Allocation Phase",
    ESCORT_COUNTERATTACK: "Escort Fighter Counterattack Phase",
    ESCORT_DAMAGE_ALLOCATION: "Escort Damage Allocation Phase",
    AAA_DAMAGE_ALLOCATION: "AAA Fire Damage Allocation Phase",
    ANTI_AIRCRAFT_FIRE: "Anti-Aircraft (AAA) Fire Phase",
    ATTACK_TARGET_SELECTION: "Carrier Target Selection",
    FLEET_TARGET_SELECTION: "Fleet Target Selection",
  }

  static nextActionButtonDisabled = false
  static usSetUpComplete = false

  static SETUP_MESSAGES = [
    "Place Akagi Air Units",
    "Place Kaga Air Units",
    "Place Hiryu Air Units",
    "Place Soryu Air Units",
    "Draw 3 x Japan Cards",
    "Place US CSF Fleet Unit",
    "Place Enterprise Air Units",
    "Place Hornet Air Units",
    "Place Yorktown Air Units",
    "Place Midway Air Units",
    "Draw 2 x US Cards",
  ]

  static JAPAN_CARRIERS = [
    GlobalUnitsModel.Carrier.AKAGI,
    GlobalUnitsModel.Carrier.KAGA,
    GlobalUnitsModel.Carrier.HIRYU,
    GlobalUnitsModel.Carrier.SORYU,
  ]

  static US_CARRIERS = [
    GlobalUnitsModel.Carrier.ENTERPRISE,
    GlobalUnitsModel.Carrier.HORNET,
    GlobalUnitsModel.Carrier.YORKTOWN,
    GlobalUnitsModel.Carrier.MIDWAY,
  ]

  static hideCounters = true

  static hide = (counterData) => {
    return GlobalGameState.hideCounters && counterData.side === GlobalUnitsModel.Side.US
  }
  
  static alertSent = false 
  
  static gameTurn = 1
  static winner = ""

  static currentCarrier = 0
  static currentCarrierDivision = 1

  static currentTaskForce = 1

  static eliminatedAirUnits = new Array()
  static orphanedAirUnits = new Array()

  static midwayAirOpsCompleted = 0
  static midwayAttackResolved = false
  static airOperationPoints = {
    japan: 0,
    us: 0,
  }

  static taskForceTarget = ""
  static currentCarrierAttackTarget = ""
  static fleetTarget = ""

  static jpDMCVCarrier = ""
  static usDMCVCarrier = ""

  static attackingStrikeGroup = ""

  static distanceBetweenCarrierFleets = undefined
  static initial1AFLocation = undefined // location of 1AF at start of movement phase
  static initialMIFLocation = undefined // location of IJN MIF at start of movement phase
  static initialDMCVLocation = undefined // location of IJN DMCV at start of movement phase

  static previousPosition = undefined // last position of US fleet prior to movement

  static usCVsSunk = 0
  static japanCVsSunk = 0
  static midwayControl = GlobalUnitsModel.Side.US

  static usVPs = 0
  static japanVPs = 0

  // Can attack both carriers in a task force
  static carrierTarget1 = ""
  static carrierTarget2 = ""

  static stateHandler = () => {}

  static doneCapSelection = false
  static dieRolls = new Array()

  static carrierHitsDetermined = false

  static midwayInvasionLevel = 5
  static midwayGarrisonLevel = 6
  static nextMidwayInvasionRoll = GlobalUnitsModel.Side.JAPAN
  static midwayAttackDeclaration = false

  static totalMidwayHits = 0
  static midwayHits = 0
  static midwayHitsThisAttack = 0
  static midwayBox0Damaged = false
  static midwayBox1Damaged = false
  static midwayBox2Damaged = false

  static midwayAttackGroup = ""

  static jpSeaBattleHits = 0
  static usSeaBattleHits = 0

  static turnText = [
    "June 4, 1942 Morning",
    "June 4, 1942 Afternoon",
    "June 4, 1942 Evening",
    "June 5, 1942 Night",
    "June 5, 1942 Morning",
    "June 5, 1942 Afternoon",
    "June 5, 1942 Evening",
  ]

  static jpCardsDrawn = false
  static usCardsDrawn = false

  static cardsChecked = new Array()
  static dmcvChecked = undefined

  static usFleetPlaced = false
  static usFleetMoved = false
  static jpFleetPlaced = false
  static jpFleetMoved = false

  static jpDMCVFleetPlaced = false
  static usDMCVFleetPlaced = false
  static jpDMCVFleetMoved = false
  static usDMCVFleetMoved = false

  static mifFleetPlaced = false
  static mifFleetMoved = false

  static CSFLeftMap = false
  static AF1LeftMap = false

  static phaseCompleted = false

  static sideWithInitiative = ""
  static allStrikeUnitsReturned = false

  static elitePilots = false
  static semperFi = false

  static updateGlobalState = () => {
    this.stateHandler()
  }

  static retreatFleet = ""
  static loading = false

  static log = (message) => {
    this.logItems.push(message)
    this.stateHandler()
  }

  static logItems = ["Logging begin..."]

  static gamePhase = ""
  static temporaryGamePhase = ""
  static onlycap = false

  // static setupPhase = 6; // tmp put back to 0
  static setupPhase = 0 // tmp put back to 0

  static isFirstAirOp = true

  static airOpJapan = 0 // count which air op this is
  static airOpUS = 0

  static airAttacksComplete = false // set to true after all air attacks - triggers CAP return etc

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

  static allUSCarriersSunk = false
  static allJapanCarriersSunk = false

  static fleetSpeed = 2
  static dmcvFleetSpeed = 1

  static JP_AF = 6
  static US_CSF = 7
  static US_MIDWAY = 8

  static getJapanCarrier = () => {
    return this.JAPAN_CARRIERS[this.setupPhase]
  }

  static getUSCarrier = () => {
    return this.US_CARRIERS[this.setupPhase - 6]
  }

  static usPlayerType = -1
  static jpPlayerType = -1

  static currentPlayer = GlobalUnitsModel.Side.JAPAN

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
