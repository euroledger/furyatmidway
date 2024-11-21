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
    JP_AKAGI_DMCV: "AKAGI DMCV",
    JP_KAGA_HANGAR: "KAGA HANGAR",
    JP_KAGA_FLIGHT_DECK: "KAGA FLIGHT DECK",
    JP_KAGA_DMCV: "KAGA DMCV",

    JP_CD2_CAP_RETURN: "CD2 CAP RETURNING",
    JP_CD2_CAP: "CD2 CAP",
    JP_CD2_RETURN2: "CD2 RETURNING (2)",
    JP_CD2_RETURN1: "CD2 RETURNING (1)",

    JP_STRIKE_BOX_0: "JAPAN STRIKE BOX 0",
    JP_STRIKE_BOX_1: "JAPAN STRIKE BOX 1",
    JP_STRIKE_BOX_2: "JAPAN STRIKE BOX 2",
    JP_STRIKE_BOX_3: "JAPAN STRIKE BOX 3",
    JP_STRIKE_BOX_4: "JAPAN STRIKE BOX 4",
    JP_STRIKE_BOX_5: "JAPAN STRIKE BOX 5",
    JP_STRIKE_BOX_6: "JAPAN STRIKE BOX 6",

    JP_HIRYU_HANGAR: "HIRYU HANGAR",
    JP_HIRYU_FLIGHT_DECK: "HIRYU FLIGHT DECK",
    JP_HIRYU_DMCV: "HIRYU DMCV",

    JP_SORYU_HANGAR: "SORYU HANGAR",
    JP_SORYU_FLIGHT_DECK: "SORYU FLIGHT DECK",
    JP_SORYU_DMCV: "SORYU DMCV",

    US_TF16_CAP: "TF16 CAP",
    US_TF16_CAP_RETURN: "TF16 CAP RETURNING",
    US_TF16_RETURN2: "TF16 RETURNING (2)",
    US_TF16_RETURN1: "TF16 RETURNING (1)",

    US_ENTERPRISE_HANGAR: "ENTERPRISE HANGAR",
    US_ENTERPRISE_FLIGHT_DECK: "ENTERPRISE FLIGHT DECK",
    US_ENTERPRISE_DMCV: "ENTERPRISE DMCV",

    US_HORNET_HANGAR: "HORNET HANGAR",
    US_HORNET_FLIGHT_DECK: "HORNET FLIGHT DECK",
    US_HORNET_DMCV: "HORNET DMCV",

    US_YORKTOWN_HANGAR: "YORKTOWN HANGAR",
    US_YORKTOWN_FLIGHT_DECK: "YORKTOWN FLIGHT DECK",
    US_YORKTOWN_DMCV: "YORKTOWN DMCV",

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

    US_STRIKE_BOX_0: "US STRIKE BOX 0",
    US_STRIKE_BOX_1: "US STRIKE BOX 1",
    US_STRIKE_BOX_2: "US STRIKE BOX 2",
    US_STRIKE_BOX_3: "US STRIKE BOX 3",
    US_STRIKE_BOX_4: "US STRIKE BOX 4",
    US_STRIKE_BOX_5: "US STRIKE BOX 5",
    US_STRIKE_BOX_6: "US STRIKE BOX 6",

    JP_ELIMINATED: "JAPAN ELIMINATED BOX",
    US_ELIMINATED: "US ELIMINATED BOX",

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
    JAPAN_DMCV: "IJN DMCV",
    US_DMCV: "US DMCV",
    MIF: "MIF"
  }

  static jpFleetUnits = new Map()
  static usFleetUnits = new Map()
  static jpAirUnits = new Map()
  static usAirUnits = new Map()

  static damageMarkers = new Array()
  static sunkMarkers = new Array()

  static jpDMCVShipMarker = undefined
  static usDMCVShipMarker = undefined

  static jpStrikeGroups = new Map()
  static usStrikeGroups = new Map()

  static carrierSideMap = new Map()

  static cards = new Array()

  static jpCardsPlayed = new Array()
  static usCardsPlayed = new Array()

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
