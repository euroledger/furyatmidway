import Controller from "../src/controller/Controller"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import loadCounters from "../src/CounterLoader"

describe("Controller tests", () => {
  let controller
  let counters

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)
  })

  test("Check US air units can be added, retrieved and removed to/from model", () => {
    // get air unit from data store
    const af = counters.get("Enterprise-F4F4-1")

    // add this air unit to the CAP box
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_CAP, 0, af)

    // return all air units in this box, make sure we get back the same air unit (only)
    let airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_TF16_CAP)

    expect(airUnits.length).toEqual(1)
    expect(airUnits[0].name).toEqual("Enterprise-F4F4-1")

    controller.removeAirUnitFromBox(GlobalUnitsModel.AirBox.US_TF16_CAP, 0)
    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_TF16_CAP)
    expect(airUnits.length).toEqual(0)
  })

  test("Test to see if US air unit is present in a particular box", () => {
    const af = counters.get("Hornet-F4F4-1")
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_CAP, 0, af)

    let found = controller.isAirUnitInBox(GlobalUnitsModel.AirBox.US_TF16_CAP, "Hornet-F4F4-1")
    expect(found).toEqual(true)

    found = controller.isAirUnitInBox(GlobalUnitsModel.AirBox.US_TF16_CAP,"Hornet-F4F4-2")
    expect(found).toEqual(false)
  })

  test("Initial placement of US air units off board", () => {
    const af1 = counters.get("Hornet-F4F4-1")
    const af2 = counters.get("Hornet-F4F4-2")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.OFFBOARD, 0, af1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.OFFBOARD, 0, af2)

    let location = controller.getAirUnitLocation("Hornet-F4F4-1")
    expect(location.boxName).toEqual(GlobalUnitsModel.AirBox.OFFBOARD)

    location = controller.getAirUnitLocation("Hornet-F4F4-2")
    expect(location.boxName).toEqual(GlobalUnitsModel.AirBox.OFFBOARD)
  })

  test("Test the air unit location (box name and index)", () => {
    const af = counters.get("Yorktown-F4F4-1")
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF17_CAP, 2, af)

    const { boxName, boxIndex } = controller.getAirUnitLocation("Yorktown-F4F4-1")

    expect(boxName).toEqual(GlobalUnitsModel.AirBox.US_TF17_CAP)
    expect(boxIndex).toEqual(2)
  })

  test("Move an air unit from OFFBOARD to the CAP box to the CAP returning box", () => {
    const af1 = counters.get("Yorktown-F4F4-1")
    const af2 = counters.get("Yorktown-F4F4-2")

    // loader adds units to OFFBOARD during load process

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF17_CAP, 2, af1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF17_CAP, 3, af2)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF17_RETURN2, 0, af1)

    let location = controller.getAirUnitLocation("Yorktown-F4F4-1")
    expect(location.boxName).toEqual(GlobalUnitsModel.AirBox.US_TF17_RETURN2)
    expect(location.boxIndex).toEqual(0)

    location = controller.getAirUnitLocation("Yorktown-F4F4-2")
    expect(location.boxName).toEqual(GlobalUnitsModel.AirBox.US_TF17_CAP)
    expect(location.boxIndex).toEqual(3)

    let airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_TF17_CAP)
    expect(airUnits.length).toEqual(1)
  })

  test("US Air units for carrier", () => {
    const airUnits = controller.getAirUnitsForUSCarrier("Enterprise")
    expect(airUnits.length).toEqual(5)

    expect(airUnits[0].name).toEqual("Enterprise-F4F4-1")
    expect(airUnits[1].name).toEqual("Enterprise-F4F4-2")
    expect(airUnits[2].name).toEqual("Enterprise-TBD1")
    expect(airUnits[3].name).toEqual("Enterprise-SBD3-1")
    expect(airUnits[4].name).toEqual("Enterprise-SBD3-2")
  })

  test("Move air unit event in view event handler", () => {
    const af1 = counters.get("Yorktown-F4F4-1")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF17_CAP, 2, af1)

    let location = controller.getAirUnitLocation("Yorktown-F4F4-1")
    expect(location.boxName).toEqual(GlobalUnitsModel.AirBox.US_TF17_CAP)
    expect(location.boxIndex).toEqual(2)

    const counterData = counters.get("Yorktown-F4F4-1")
    controller.viewEventHandler({
      type: Controller.EventTypes.AIR_UNIT_SETUP,
      data: {
        name: GlobalUnitsModel.AirBox.US_TF17_CAP,
        counterData,
        index: 2,
        side: GlobalUnitsModel.Side.US
      },
    })
    const airUnitsDeployed = controller.getUSAirUnitsDeployed(counterData.carrier)
    expect(airUnitsDeployed.length).toEqual(1)
  })

  test("Can filter box names by carrier", () => {
    let boxes = controller.getBoxesForUSCarrier(GlobalUnitsModel.Carrier.ENTERPRISE, true)
    expect(boxes.length).toEqual(7)
    boxes = controller.getBoxesForUSCarrier(GlobalUnitsModel.Carrier.HORNET, true)
    expect(boxes.length).toEqual(7)
    boxes = controller.getBoxesForUSCarrier(GlobalUnitsModel.Carrier.YORKTOWN, true)
    expect(boxes.length).toEqual(7)
    boxes = controller.getBoxesForUSCarrier(GlobalUnitsModel.Carrier.MIDWAY, true)
    expect(boxes.length).toEqual(6)

    boxes = controller.getBoxesForUSCarrier(GlobalUnitsModel.Carrier.ENTERPRISE, false)
    expect(boxes.length).toEqual(4)
    boxes = controller.getBoxesForUSCarrier(GlobalUnitsModel.Carrier.HORNET, false)
    expect(boxes.length).toEqual(4)
    boxes = controller.getBoxesForUSCarrier(GlobalUnitsModel.Carrier.YORKTOWN, false)
    expect(boxes.length).toEqual(4)
    boxes = controller.getBoxesForUSCarrier(GlobalUnitsModel.Carrier.MIDWAY, false)
    expect(boxes.length).toEqual(3)
  })

  test("Get the carrier for a US air unit", () => {
    let carrier = controller.getCarrierForAirUnit("Yorktown-F4F4-1")
    expect(carrier).toEqual(GlobalUnitsModel.Carrier.YORKTOWN)

    carrier = controller.getCarrierForAirUnit("Hornet-F4F4-1")
    expect(carrier).toEqual(GlobalUnitsModel.Carrier.HORNET)

    carrier = controller.getCarrierForAirUnit("Enterprise-F4F4-1")
    expect(carrier).toEqual(GlobalUnitsModel.Carrier.ENTERPRISE)

    carrier = controller.getCarrierForAirUnit("Midway-F4F3")
    expect(carrier).toEqual(GlobalUnitsModel.Carrier.MIDWAY)
  })

})
