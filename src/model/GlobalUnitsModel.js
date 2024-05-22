import FleetUnit from "./FleetUnit";

export default class GlobalUnitsModel {

    static Carrier = {
        AKAGI: "Akagi",
        KAGA: "Kaga",
        HIRYU: "Hiryu",
        SORYU: "Soryu",
    }
    static AirBox = {
        OFFBOARD: "OFFBOARD",
        JP_CD_CAP1: "1CD CAP",
        JP_CAP_RETURN1: "1CD CAP RETURNING",
        JP_1CD_HANGER: "1CD HANGAR",
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

}
