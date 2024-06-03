import Controller from "../src/controller/Controller"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import loadCounters from "../src/CounterLoader"
import calcRandomTestData from "../src/AirUnitTestData"
import { airUnitData } from "../src/AirUnitTestData"

describe("Controller tests", () => {
  let controller
  let counters

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)
  })

  test("Check air units can be added, retrieved and removed to/from model", () => {
    // get air unit from data store
    const af = counters.get("Akagi-A6M-2b-2")

    // add this air unit to the CAP box
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 0, af)

    // return all air units in this box, make sure we get back the same air unit (only)
    let airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_CD1_CAP)

    expect(airUnits.length).toEqual(1)
    expect(airUnits[0].name).toEqual("Akagi-A6M-2b-2")

    controller.removeAirUnitFromBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 0)
    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_CD1_CAP)
    expect(airUnits.length).toEqual(0)
  })

  test("Test to see if air unit is present in a particular box", () => {
    const af = counters.get("Akagi-A6M-2b-2")
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 0, af)

    let found = controller.isAirUnitInBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, "Akagi-A6M-2b-2")
    expect(found).toEqual(true)

    found = controller.isAirUnitInBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, "Akagi-A6M-2b-1")
    expect(found).toEqual(false)
  })

  test("Initial placement of air units off board", () => {
    const af1 = counters.get("Akagi-A6M-2b-1")
    const af2 = counters.get("Akagi-A6M-2b-2")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.OFFBOARD, 0, af1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.OFFBOARD, 0, af2)

    let location = controller.getAirUnitLocation("Akagi-A6M-2b-1")
    expect(location.boxName).toEqual(GlobalUnitsModel.AirBox.OFFBOARD)

    location = controller.getAirUnitLocation("Akagi-A6M-2b-2")
    expect(location.boxName).toEqual(GlobalUnitsModel.AirBox.OFFBOARD)
  })

  test("Test the air unit location (box name and index)", () => {
    const af = counters.get("Akagi-A6M-2b-2")
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 2, af)

    const { boxName, boxIndex } = controller.getAirUnitLocation("Akagi-A6M-2b-2")

    expect(boxName).toEqual(GlobalUnitsModel.AirBox.JP_CD1_CAP)
    expect(boxIndex).toEqual(2)
  })

  test("Move an air unit from OFFBOARD to the CAP box to the CAP returning box", () => {
    const af1 = counters.get("Akagi-A6M-2b-1")
    const af2 = counters.get("Akagi-A6M-2b-2")

    // loader adds units to OFFBOARD during load process

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 2, af1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 3, af2)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN2, 0, af1)

    let location = controller.getAirUnitLocation("Akagi-A6M-2b-1")
    expect(location.boxName).toEqual(GlobalUnitsModel.AirBox.JP_CD1_RETURN2)
    expect(location.boxIndex).toEqual(0)

    location = controller.getAirUnitLocation("Akagi-A6M-2b-2")
    expect(location.boxName).toEqual(GlobalUnitsModel.AirBox.JP_CD1_CAP)
    expect(location.boxIndex).toEqual(3)

    let airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_CD1_CAP)
    expect(airUnits.length).toEqual(1)
  })

  test("Air units for carrier", () => {
    const airUnits = controller.getAirUnitsForCarrier("Akagi")
    expect(airUnits.length).toEqual(4)

    expect(airUnits[0].name).toEqual("Akagi-A6M-2b-1")
    expect(airUnits[1].name).toEqual("Akagi-A6M-2b-2")
    expect(airUnits[2].name).toEqual("Akagi-D3A-1")
    expect(airUnits[3].name).toEqual("Akagi-B5N-2")
  })

  test("Move air unit event in view event handler", () => {
    const af1 = counters.get("Akagi-A6M-2b-1")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 2, af1)

    let location = controller.getAirUnitLocation("Akagi-A6M-2b-1")
    expect(location.boxName).toEqual(GlobalUnitsModel.AirBox.JP_CD1_CAP)
    expect(location.boxIndex).toEqual(2)

    const counterData = counters.get("Akagi-A6M-2b-1")
    controller.viewEventHandler({
      type: Controller.EventTypes.AIR_UNIT_SETUP,
      data: {
        name: GlobalUnitsModel.AirBox.JP_CD1_CAP,
        counterData,
        index: 2,
      },
    })
    const airUnitsDeployed = controller.getAirUnitsDeployed(counterData.carrier)
    expect(airUnitsDeployed.length).toEqual(1)
  })

  test("Can filter box names by carrier", () => {
    let boxes = controller.getBoxesForCarrier(GlobalUnitsModel.Carrier.AKAGI, true)
    expect(boxes.length).toEqual(6)
    boxes = controller.getBoxesForCarrier(GlobalUnitsModel.Carrier.KAGA, true)
    expect(boxes.length).toEqual(6)
    boxes = controller.getBoxesForCarrier(GlobalUnitsModel.Carrier.HIRYU, true)
    expect(boxes.length).toEqual(6)
    boxes = controller.getBoxesForCarrier(GlobalUnitsModel.Carrier.SORYU, true)
    expect(boxes.length).toEqual(6)

    boxes = controller.getBoxesForCarrier(GlobalUnitsModel.Carrier.AKAGI, false)
    expect(boxes.length).toEqual(3)
    boxes = controller.getBoxesForCarrier(GlobalUnitsModel.Carrier.KAGA, false)
    expect(boxes.length).toEqual(3)
    boxes = controller.getBoxesForCarrier(GlobalUnitsModel.Carrier.HIRYU, false)
    expect(boxes.length).toEqual(3)
    boxes = controller.getBoxesForCarrier(GlobalUnitsModel.Carrier.SORYU, false)
    expect(boxes.length).toEqual(3)
  })

  test("Get the carrier for an air unit", () => {
    let carrier = controller.getCarrierForAirUnit("Akagi-A6M-2b-1")
    expect(carrier).toEqual(GlobalUnitsModel.Carrier.AKAGI)

    carrier = controller.getCarrierForAirUnit("Kaga-A6M-2b-1")
    expect(carrier).toEqual(GlobalUnitsModel.Carrier.KAGA)

    carrier = controller.getCarrierForAirUnit("Hiryu-A6M-2b-1")
    expect(carrier).toEqual(GlobalUnitsModel.Carrier.HIRYU)

    carrier = controller.getCarrierForAirUnit("Soryu-A6M-2b-1")
    expect(carrier).toEqual(GlobalUnitsModel.Carrier.SORYU)
  })

})
