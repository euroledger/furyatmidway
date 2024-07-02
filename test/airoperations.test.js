import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import AirOperationsModel from "../src/model/AirOperationsModel"
import GlobalGameState from "../src/model/GlobalGameState"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import { handleAirUnitMoves } from "../src/controller/AirOperationsHandler"

describe("Air Operations tests", () => {
  let controller
  let counters

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)
    const kaf1 = counters.get("Kaga-A6M-2b-1")
    const kaf2 = counters.get("Kaga-A6M-2b-2")
    const kdb = counters.get("Kaga-D3A-1")
    const ktb = counters.get("Kaga-B5N-2")

    const aaf1 = counters.get("Akagi-A6M-2b-1")
    const aaf2 = counters.get("Akagi-A6M-2b-2")
    const adb = counters.get("Akagi-D3A-1")
    const atb = counters.get("Akagi-B5N-2")

    const haf1 = counters.get("Hiryu-A6M-2b-1")
    const haf2 = counters.get("Hiryu-A6M-2b-2")
    const hdb = counters.get("Hiryu-D3A-1")
    const htb = counters.get("Hiryu-B5N-2")

    const saf1 = counters.get("Soryu-A6M-2b-1")
    const saf2 = counters.get("Soryu-A6M-2b-2")
    const sdb = counters.get("Soryu-D3A-1")
    const stb = counters.get("Soryu-B5N-2")

    // CAR DIV 1
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 0, aaf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 1, kaf1)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK, 0, kdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK, 1, ktb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK, 0, adb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK, 1, atb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_HANGAR, 0, aaf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_HANGAR, 1, kaf2)

    //  CAR DIV 2
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_RETURN1, 0, haf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_RETURN1, 1, saf1)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_CAP_RETURN, 0, haf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_CAP_RETURN, 1, saf2)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK, 0, hdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK, 1, htb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_SORYU_HANGAR, 0, sdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK, 1, stb)

    // TF 16
    const ef1 = counters.get("Enterprise-F4F4-1")
    const ef2 = counters.get("Enterprise-F4F4-2")
    const edb1 = counters.get("Enterprise-SBD3-1")
    const edb2= counters.get("Enterprise-SBD3-2")
    const etb = counters.get("Enterprise-TBD1")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 0, edb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_CAP, 1, ef1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_CAP, 2, ef2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 3, etb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR, 4, edb2)
  })

  test("Initiative Determination", () => {
    GlobalGameState.airOperationPoints.japan = 2
    GlobalGameState.airOperationPoints.us = 3

    let sideWithInitiative = controller.determineInitiative(1, 4)
    expect(sideWithInitiative).toEqual(GlobalUnitsModel.Side.US)

    sideWithInitiative = controller.determineInitiative(4, 1)
    expect(sideWithInitiative).toEqual(GlobalUnitsModel.Side.JAPAN)

    sideWithInitiative = controller.determineInitiative(3, 2)
    expect(sideWithInitiative).toEqual(GlobalUnitsModel.Side.US)

    GlobalGameState.airOperationPoints.japan = 2
    GlobalGameState.airOperationPoints.us = 2
    sideWithInitiative = controller.determineInitiative(3, 2)
    expect(sideWithInitiative).toEqual(GlobalUnitsModel.Side.JAPAN)

    sideWithInitiative = controller.determineInitiative(2, 2)
    expect(sideWithInitiative).toBeNull()

    GlobalGameState.airOperationPoints.japan = 0
    GlobalGameState.airOperationPoints.us = 2
    sideWithInitiative = controller.determineInitiative(5, 2)
    expect(sideWithInitiative).toEqual(GlobalUnitsModel.Side.US)

    GlobalGameState.airOperationPoints.japan = 1
    GlobalGameState.airOperationPoints.us = 0
    sideWithInitiative = controller.determineInitiative(5, 2)
    expect(sideWithInitiative).toEqual(GlobalUnitsModel.Side.JAPAN)
  })

  test("Air Box Processing for All US units (air and carrier)", () => {
    const ef1 = counters.get("Enterprise-F4F4-1")
    const ef2 = counters.get("Enterprise-F4F4-2")
    const edb1 = counters.get("Enterprise-SBD3-1")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 0, edb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 1, ef1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 2, ef2)
    const unitsInUSReturn1Box = controller.getAllUnitsInBoxes(GlobalUnitsModel.Side.US, "RETURN1")

    expect(unitsInUSReturn1Box.length).toEqual(3)
  })

  test("Japanese Carrier Status", () => {
    const carrier = controller.getJapanFleetUnit(GlobalUnitsModel.Carrier.AKAGI)
    expect(carrier.hits).toEqual(0)
    expect(carrier.isSunk).toEqual(false)

    const taskForce = controller.getTaskForceForCarrier(GlobalUnitsModel.Carrier.AKAGI, GlobalUnitsModel.Side.JAPAN)
    expect(taskForce).toEqual(GlobalUnitsModel.TaskForce.CARRIER_DIV_1)

    const units = controller.getAllCarriersInTaskForce(taskForce, GlobalUnitsModel.Side.JAPAN)
    expect(units.length).toEqual(2)

    const otherCarrierinTF = controller.getOtherCarrierInTF(GlobalUnitsModel.Carrier.AKAGI, GlobalUnitsModel.Side.JAPAN)
    expect(otherCarrierinTF.length).toEqual(1)
    expect(otherCarrierinTF[0].name).toEqual(GlobalUnitsModel.Carrier.KAGA)

    const model = new AirOperationsModel()
    let box = model.getAirBoxForNamedShip(GlobalUnitsModel.Side.JAPAN, "Akagi", "FLIGHT")
    expect(Object.keys(box).length).toEqual(1)

    box = model.getAirBoxForNamedShip(GlobalUnitsModel.Side.JAPAN, "Akagi", "HANGAR")
    expect(Object.keys(box).length).toEqual(1)

    const numUnitsOnCarrier = controller.numUnitsOnCarrier("Akagi", GlobalUnitsModel.Side.JAPAN)
    expect(numUnitsOnCarrier).toEqual(4)
  })

  // Add US Carrier test here
  test("US Carrier Status", () => {
    const carrier = controller.getUSFleetUnit(GlobalUnitsModel.Carrier.ENTERPRISE)
    expect(carrier.hits).toEqual(0)
    expect(carrier.isSunk).toEqual(false)

    const taskForce = controller.getTaskForceForCarrier(GlobalUnitsModel.Carrier.ENTERPRISE, GlobalUnitsModel.Side.US)
    expect(taskForce).toEqual(GlobalUnitsModel.TaskForce.TASK_FORCE_16)

    const units = controller.getAllCarriersInTaskForce(taskForce, GlobalUnitsModel.Side.US)
    expect(units.length).toEqual(2)

    const otherCarrierinTF = controller.getOtherCarrierInTF(
      GlobalUnitsModel.Carrier.ENTERPRISE,
      GlobalUnitsModel.Side.US
    )
    expect(otherCarrierinTF.length).toEqual(1)
    expect(otherCarrierinTF[0].name).toEqual(GlobalUnitsModel.Carrier.HORNET)

    const numUnitsOnCarrier = controller.numUnitsOnCarrier("Enterprise", GlobalUnitsModel.Side.US)
    expect(numUnitsOnCarrier).toEqual(3)
  })

  test("Create Lists of Valid Destination Boxes for each Japan Air Unit", () => {
    handleAirUnitMoves(controller, GlobalUnitsModel.Side.JAPAN)

    const destinations = controller.getValidAirUnitDestinations("Soryu-A6M-2b-1")

    const { carrier, box } = destinations[0]
    expect(destinations.length).toEqual(1)
    expect(carrier).toEqual("Soryu")
    expect(box).toEqual("HANGAR")

    const model = new AirOperationsModel()
    let boxName = model.getAirBoxForNamedShip(GlobalUnitsModel.Side.JAPAN, carrier, box)

    // note we need to send the box object value not key
    const b = Object.values(boxName)[0]
    expect(Object.values(boxName).length).toEqual(1)

    const units = controller.getAllAirUnitsInBox(b)
    expect(units.length).toEqual(1)
  })
})
