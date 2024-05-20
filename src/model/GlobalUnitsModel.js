import FleetUnit from "./FleetUnit";

export default class GlobalUnitsModel {

    static japanCarriers = {
        AKAGI: "Akagi",
        KAGA: "Kaga",
        HIRYU: "Hiryu",
        SORYU: "Soryu",
    }
    static AirBoxes = {
        OFFBOARD: "OFFBOARD",
        JP_CD_CAP1: "1CD CAP",
        JP_CAP_RETURN1: "1CD CAP RETURNING",
        JP_1CD_HANGER: "1CD HANGAR",
    }

    static japan = 0;
    static us = 1;

    static jpFleetUnits = new Map()
    static usFleetUnits = new Map()
    static jpAirUnits = new Map()
}
