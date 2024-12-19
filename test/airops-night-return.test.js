import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import { setValidDestinationBoxesNightOperations } from "../src/controller/AirOperationsHandler"
import { createFleetMove } from "./TestUtils"

describe("Air Operations tests for air units in Return 2 boxes", () => {
  let controller
  let counters
  let kaf1, aaf1, haf1, saf1
  let kaf2, aaf2, haf2, saf2

  let kdb, ktb, hdb, htb
  let ef1, ef2, edb1, edb2, etb
  let hf1, hf2, hdb1, hdb2, htb1
  let yf1, yf2, ydb1, ydb2, ytb

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)

    // set CSF to prevent null exception
    createFleetMove(controller, 7, 1, "CSF", GlobalUnitsModel.Side.US) // G-4

    kaf1 = counters.get("Kaga-A6M-2b-1")
    aaf1 = counters.get("Akagi-A6M-2b-1")

    haf1 = counters.get("Hiryu-A6M-2b-1")
    saf1 = counters.get("Soryu-A6M-2b-1")

    kaf2 = counters.get("Kaga-A6M-2b-2")
    aaf2 = counters.get("Akagi-A6M-2b-2")

    haf2 = counters.get("Hiryu-A6M-2b-2")
    saf2 = counters.get("Soryu-A6M-2b-2")

    kdb = counters.get("Kaga-D3A-1")
    ktb = counters.get("Kaga-B5N-2")

    hdb = counters.get("Hiryu-D3A-1")
    htb = counters.get("Hiryu-B5N-2")

    ef1 = counters.get("Enterprise-F4F4-1")
    ef2 = counters.get("Enterprise-F4F4-2")
    edb1 = counters.get("Enterprise-SBD3-1")
    edb2 = counters.get("Enterprise-SBD3-2")
    etb = counters.get("Enterprise-TBD1")

    hf1 = counters.get("Hornet-F4F4-1")
    hf2 = counters.get("Hornet-F4F4-2")
    hdb1 = counters.get("Hornet-SBD3-1")
    hdb2 = counters.get("Hornet-SBD3-2")
    htb1 = counters.get("Hornet-TBD1")

    yf1 = counters.get("Yorktown-F4F4-1")
    yf2 = counters.get("Yorktown-F4F4-2")
    ydb1 = counters.get("Yorktown-SBD3-1")
    ydb2 = counters.get("Yorktown-SBD3-2")
    ytb = counters.get("Yorktown-TBD1")

    // CAR DIV 1
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 0, aaf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 1, kaf1)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN2, 0, aaf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN2, 1, kaf2)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 0, kdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 1, ktb)

    //  CAR DIV 2
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_CAP, 0, haf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_CAP, 1, saf2)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_RETURN2, 0, haf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_RETURN2, 1, saf1)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_RETURN1, 0, hdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_RETURN1, 1, htb)

    // // TF16
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_CAP, 0, ef1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_CAP, 1, hf1)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN2, 0, ef2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN2, 1, hf2)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 0, edb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 1, edb2)

    // // TF17
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF17_CAP, 0, yf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF17_CAP, 1, yf2)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF17_RETURN2, 0, ydb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF17_RETURN2, 1, ydb2)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF17_RETURN1, 0, ytb)
    // // MIDWAY
    // controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_MIDWAY_RETURN2, 0, mf1)
  })

  test("Night Operataions: Create Lists of Valid Destination Boxes for each Japan Air Unit", () => {
    let airUnits = controller.getAllAirUnitsInReturn1Boxes(GlobalUnitsModel.Side.JAPAN)
    expect(airUnits.length).toEqual(4)

    airUnits = controller.getAllAirUnitsInReturn2Boxes(GlobalUnitsModel.Side.JAPAN)
    expect(airUnits.length).toEqual(4)

    airUnits = controller.getAllAirUnitsInCAPBoxes(GlobalUnitsModel.Side.JAPAN)
    expect(airUnits.length).toEqual(4)

    // Test destinations for unit in RETURN2 BOX (CD1)
    setValidDestinationBoxesNightOperations(controller, aaf2.name, GlobalUnitsModel.Side.JAPAN)
    let destinations = controller.getValidAirUnitDestinations(aaf2.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.JP_CD1_RETURN1)

    // Test destinations for unit in RETURN2 BOX (CD2)
    setValidDestinationBoxesNightOperations(controller, haf1.name, GlobalUnitsModel.Side.JAPAN)
    destinations = controller.getValidAirUnitDestinations(haf1.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.JP_CD2_RETURN1)

    // Test destinations for unit in RETURN1 BOX (CD1)
    setValidDestinationBoxesNightOperations(controller, kdb.name, GlobalUnitsModel.Side.JAPAN)
    destinations = controller.getValidAirUnitDestinations(kdb.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.JP_KAGA_HANGAR)

    // Test destinations for unit in RETURN1 BOX (CD2)
    setValidDestinationBoxesNightOperations(controller, htb.name, GlobalUnitsModel.Side.JAPAN)
    destinations = controller.getValidAirUnitDestinations(htb.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR)

    // Test destinations for unit in CAP BOX (CD2)
    setValidDestinationBoxesNightOperations(controller, aaf1.name, GlobalUnitsModel.Side.JAPAN)
    destinations = controller.getValidAirUnitDestinations(aaf1.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.JP_AKAGI_HANGAR)
  })

  test("Night Operataions: Create Lists of Valid Destination Boxes for each Japan Air Unit, Parent Carrier Sunk", () => {

    // Akagi Air Unit is in CAP Box - AKAGI sunk, must go to Kaga
    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 3)
    setValidDestinationBoxesNightOperations(controller, aaf1.name, GlobalUnitsModel.Side.JAPAN)
    let destinations = controller.getValidAirUnitDestinations(aaf1.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.JP_KAGA_HANGAR)
  })

  
  test("Night Operataions: Create Lists of Valid Destination Boxes for each Japan Air Unit, Parent Carrier Damaged", () => {

    // Akagi Air Unit is in CAP Box - AKAGI sunk, must go to Kaga
    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 2)
    setValidDestinationBoxesNightOperations(controller, aaf1.name, GlobalUnitsModel.Side.JAPAN)
    let destinations = controller.getValidAirUnitDestinations(aaf1.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.JP_KAGA_HANGAR)
  })

  test("Night Operataions: Create Lists of Valid Destination Boxes for each US Air Unit", () => {
    let airUnits = controller.getAllAirUnitsInReturn1Boxes(GlobalUnitsModel.Side.US)
    expect(airUnits.length).toEqual(3)

    airUnits = controller.getAllAirUnitsInReturn2Boxes(GlobalUnitsModel.Side.US)
    expect(airUnits.length).toEqual(4)

    airUnits = controller.getAllAirUnitsInCAPBoxes(GlobalUnitsModel.Side.US)
    expect(airUnits.length).toEqual(4)

    // Test destinations for unit in RETURN2 BOX (TF16)
    setValidDestinationBoxesNightOperations(controller, ef2.name, GlobalUnitsModel.Side.US)
    let destinations = controller.getValidAirUnitDestinations(ef2.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_TF16_RETURN1)

    // Test destinations for unit in RETURN2 BOX (TF17)
    setValidDestinationBoxesNightOperations(controller, ydb1.name, GlobalUnitsModel.Side.US)
    destinations = controller.getValidAirUnitDestinations(ydb1.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_TF17_RETURN1)

    // Test destinations for unit in RETURN1 BOX (TF16)
    setValidDestinationBoxesNightOperations(controller, edb1.name, GlobalUnitsModel.Side.US)
    destinations = controller.getValidAirUnitDestinations(edb1.name)
    expect(destinations.length).toEqual(2)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR)
    expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.US_HORNET_HANGAR)

    // Test destinations for unit in RETURN1 BOX (TF17)
    setValidDestinationBoxesNightOperations(controller, ytb.name, GlobalUnitsModel.Side.US)
    destinations = controller.getValidAirUnitDestinations(ytb.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_YORKTOWN_HANGAR)

    
    // Test destinations for unit in CAP BOX (TF16)
    setValidDestinationBoxesNightOperations(controller, ef1.name, GlobalUnitsModel.Side.US)
    destinations = controller.getValidAirUnitDestinations(ef1.name)
    expect(destinations.length).toEqual(2)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR)
    expect(destinations[1]).toEqual(GlobalUnitsModel.AirBox.US_HORNET_HANGAR)

    // Test destinations for unit in CAP BOX (TF17)
    setValidDestinationBoxesNightOperations(controller, yf1.name, GlobalUnitsModel.Side.US)
    destinations = controller.getValidAirUnitDestinations(yf1.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_YORKTOWN_HANGAR)
  })
  
  test("Night Operataions: Create Lists of Valid Destination Boxes for each US Air Unit, Parent Carrier Sunk", () => {

    // Enterprise Air Unit is in CAP Box - Enteprise is sunk, must go to Hornet
    controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 3)
    setValidDestinationBoxesNightOperations(controller, ef1.name, GlobalUnitsModel.Side.US)
    let destinations = controller.getValidAirUnitDestinations(ef1.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_HORNET_HANGAR)
  })

  
  test("Night Operataions: Create Lists of Valid Destination Boxes for each US Air Unit, Parent Carrier Damaged", () => {
    // Akagi Air Unit is in CAP Box - AKAGI sunk, must go to Kaga
    controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 2)
    setValidDestinationBoxesNightOperations(controller, ef1.name, GlobalUnitsModel.Side.US)
    let destinations = controller.getValidAirUnitDestinations(ef1.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_HORNET_HANGAR)
  })

  test("Night Operataions: Yorktown Sunk, TF17 CAP air units have no valid destination", () => {
    // Akagi Air Unit is in CAP Box - AKAGI sunk, must go to Kaga
    controller.setCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN, 3)
    setValidDestinationBoxesNightOperations(controller, yf1.name, GlobalUnitsModel.Side.US)
    let destinations = controller.getValidAirUnitDestinations(yf1.name)
    expect(destinations.length).toEqual(0)
  })
})
