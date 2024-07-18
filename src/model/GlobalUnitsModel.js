export default class GlobalUnitsModel {
  static Carrier = {
    AKAGI: "Akagi",
    KAGA: "Kaga",
    HIRYU: "Hiryu",
    SORYU: "Soryu",
    ENTERPRISE: "Enterprise",
    HORNET: "Hornet",
    YORKTOWN: "Yorktown",
    MIDWAY: "Midway",
  }

  static AirBox = {
    OFFBOARD: "OFFBOARD",
    JP_CD1_CAP: "CD1 CAP",
    JP_CD1_CAP_RETURN: "CD1 CAP RETURNING",
    JP_CD1_RETURN2: "CD1 RETURNING (2)",
    JP_CD1_RETURN1: "CD1 RETURNING (1)",

    JP_AKAGI_HANGAR: "AKAGI HANGAR",
    JP_AKAGI_FLIGHT_DECK: "AKAGI FLIGHT DECK",
    JP_KAGA_HANGAR: "KAGA HANGAR",
    JP_KAGA_FLIGHT_DECK: "KAGA FLIGHT DECK",

    JP_CD2_CAP_RETURN: "CD2 CAP RETURNING",
    JP_CD2_CAP: "CD2 CAP",
    JP_CD2_RETURN2: "CD2 RETURNING (2)",
    JP_CD2_RETURN1: "CD2 RETURNING (1)",

    JP_HIRYU_HANGAR: "HIRYU HANGAR",
    JP_HIRYU_FLIGHT_DECK: "HIRYU FLIGHT DECK",
    JP_SORYU_HANGAR: "SORYU HANGAR",
    JP_SORYU_FLIGHT_DECK: "SORYU FLIGHT DECK",

    US_TF16_CAP: "TF16 CAP",
    US_TF16_CAP_RETURN: "TF16 CAP RETURNING",
    US_TF16_RETURN2: "TF16 RETURNING (2)",
    US_TF16_RETURN1: "TF16 RETURNING (1)",

    US_ENTERPRISE_HANGAR: "ENTERPRISE HANGAR",
    US_ENTERPRISE_FLIGHT_DECK: "ENTERPRISE FLIGHT DECK",
    US_HORNET_HANGAR: "HORNET HANGAR",
    US_HORNET_FLIGHT_DECK: "HORNET FLIGHT DECK",

    US_YORKTOWN_HANGAR: "YORKTOWN HANGAR",
    US_YORKTOWN_FLIGHT_DECK: "YORKTOWN FLIGHT DECK",
    US_MIDWAY_HANGAR: "MIDWAY HANGAR",
    US_MIDWAY_FLIGHT_DECK: "MIDWAY FLIGHT DECK",

    US_TF17_CAP: "TF17 CAP",
    US_TF17_CAP_RETURN: "TF17 CAP RETURNING",
    US_TF17_RETURN2: "TF17 RETURNING (2)",
    US_TF17_RETURN1: "TF17 RETURNING (1)",

    US_MIDWAY_CAP: "MIDWAY CAP",
    US_MIDWAY_CAP_RETURN: "MIDWAY CAP RETURNING",
    US_MIDWAY_RETURN2: "MIDWAY RETURNING (2)",
    US_MIDWAY_RETURN1: "MIDWAY RETURNING (1)",
  }

  static Side = {
    JAPAN: "Japan",
    US: "US",
    BOTH: "Both", // for cards
  }

  static TaskForce = {
    CARRIER_DIV_1: "CD1",
    CARRIER_DIV_2: "CD2",
    TASK_FORCE_16: "TF16",
    TASK_FORCE_17: "TF17",
    MIDWAY: "MIDWAY",
  }

  static SearchValue = {
    JP_AF: 6,
    US_CSF: 7,
    US_MIDWAY: 8,
  }

  static BoxOptions = {
    RETURN_1: "Return 1",
    RETURN_2: "Return 2",
    CAP: "CAP",
    FLIGHT_DECK: "Flight Deck",
    HANGAR: "Hangar",
    STRIKE_GROUP: "Strike Group",
  }

  // only used for testing counter load as far as I can see
  static jpFleetUnits = new Map()
  static usFleetUnits = new Map()
  static jpAirUnits = new Map()
  static usAirUnits = new Map()

  static carrierSideMap = new Map()

  static cards = new Array()

  static jpCards = new Array()
  static usCards = new Array()

  static unitMap = new Map()

  static japanTaskForceMap = new Map()
  static usTaskForceMap = new Map()

  static carrierDiv1Map = new Map()
  static carrierDiv2Map = new Map()
  static taskForce16Map = new Map()
  static taskForce17Map = new Map()

  static akagiMap = new Map()
  static kagaMap = new Map()
  static hiryuMap = new Map()
  static soryuMap = new Map()

  static enterpriseMap = new Map()
  static hornetMap = new Map()
  static yorktownMap = new Map()
  static midwayMap = new Map()
}
