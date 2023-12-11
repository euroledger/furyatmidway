import FleetUnit from "./FleetUnit";

export default class GlobalUnits {
 
    static japan = 0;
    static us = 1;

    static jpFleetUnits = [
        new FleetUnit("1AF", false),
        new FleetUnit("MIF", false),
        new FleetUnit("DMCV", true)
    ]

    static usFleetUnits = [
        new FleetUnit("CSF", false),
        new FleetUnit("DMCV", true),
    ]
  }
  