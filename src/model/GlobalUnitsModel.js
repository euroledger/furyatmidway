import FleetUnit from "./FleetUnit";

export default class GlobalUnitsModel {

    static Carrier = {
        AKAGI: "Akagi",
        KAGA: "Kaga",
        HIRYU: "Hiryu",
        SORYU: "Soryu",
        ENTERPRISE: "Enterprise",
        HORNET: "Hornet",
        YORKTOWN: "Yorktown"
    }
    static AirBox = {
        OFFBOARD: "OFFBOARD",
        JP_CD1_CAP: "1CD CAP",
        JP_CD1_CAP_RETURN2: "CD1 CAP RETURNING (2)",

        JP_AKAGI_CAP_RETURN1: "AKAGI CAP RETURNING (1)",
        JP_KAGA_CAP_RETURN1: "KAGA CAP RETURNING (1)",

        JP_AKAGI_HANGER: "AKAGI HANGAR",
        JP_AKAGI_FLIGHT_DECK: "AKAGI FLIGHT DECK",
        JP_KAGA_HANGER: "KAGA HANGAR",
        JP_KAGA_FLIGHT_DECK: "KAGA FLIGHT DECK",

        JP_CD2_CAP: "2CD CAP",
        JP_CD2_CAP_RETURN2: "CD2 CAP RETURNING (2)",

        JP_HIRYU_CAP_RETURN1: "HIRYU CAP RETURNING (1)",
        JP_SORYU_CAP_RETURN1: "SORYU CAP RETURNING (1)",

        JP_HIRYU_HANGER: "HIRYU HANGAR",
        JP_HIRYU_FLIGHT_DECK: "HIRYU FLIGHT DECK",
        JP_SORYU_HANGER: "SORYU HANGAR",
        JP_SORYU_FLIGHT_DECK: "SORYU FLIGHT DECK",
    }

    static Side = {
        JAPAN: "Japan",
        US:    "US"
    }

    static TaskForce = {
        CARRIER_DIV_1: "CarrierDiv1",
        CARRIER_DIV_2: "CarrierDiv2",
        TASK_FORCE_16: "TaskForce16",
        TASK_FORCE_17: "TaskForce17"
    }

    static jpFleetUnits = new Map()
    static usFleetUnits = new Map()
    static jpAirUnits = new Map()
    static usAirUnits = new Map()


    static unitMap = new Map();

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

}
