import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import { handleAirUnitMoves } from "../src/controller/AirOperationsHandler"
import { createFleetMove } from "./testUtils"
import GlobalGameState from "../src/model/GlobalGameState"

describe("Air Operations tests for air units in Return 2 boxes", () => {
  let controller
  let counters
  let kaf1, aaf1, haf1, saf1
  let ef1, hf1, yf1, mf1

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)

    // set CSF to prevent null exception
    createFleetMove(controller, 7, 1, "CSF", GlobalUnitsModel.Side.US) // G-4

    kaf1 = counters.get("Kaga-A6M-2b-1")
    aaf1 = counters.get("Akagi-A6M-2b-1")

    haf1 = counters.get("Hiryu-A6M-2b-1")
    saf1 = counters.get("Soryu-A6M-2b-1")
    // CAR DIV 1
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 0, aaf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 1, kaf1)

    //  CAR DIV 2
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_CAP, 0, haf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_CAP, 1, saf1)

    ef1 = counters.get("Enterprise-F4F4-1")
    hf1 = counters.get("Hornet-F4F4-1")

    yf1 = counters.get("Yorktown-F4F4-1")

    mf1 = counters.get("Midway-F4F3")

    // TF16
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_CAP, 0, ef1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_CAP, 1, hf1)

    // TF17
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF17_CAP, 0, yf1)

    // MIDWAY
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_MIDWAY_CAP, 0, mf1)

    GlobalGameState.airAttacksComplete = true
  })

  test("Create Lists of Valid Destination Boxes for each Japan Air Unit in CAP Boxes", () => {
    handleAirUnitMoves(controller, GlobalUnitsModel.Side.JAPAN)

    let capReturnBox = controller.getCapReturnBoxForAirUnit(kaf1, GlobalUnitsModel.Side.JAPAN)
    expect(capReturnBox).toEqual(GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN)

    capReturnBox = controller.getCapReturnBoxForAirUnit(haf1, GlobalUnitsModel.Side.JAPAN)
    expect(capReturnBox).toEqual(GlobalUnitsModel.AirBox.JP_CD2_CAP_RETURN)
  })

  test("Create Lists of Valid Destination Boxes for each US Air Units in CAP Boxes", () => {
    handleAirUnitMoves(controller, GlobalUnitsModel.Side.US)

    let destinations = controller.getValidAirUnitDestinations(ef1.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_TF16_CAP_RETURN)

    destinations = controller.getValidAirUnitDestinations(hf1.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_TF16_CAP_RETURN)

    destinations = controller.getValidAirUnitDestinations(yf1.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_TF17_CAP_RETURN)

    destinations = controller.getValidAirUnitDestinations(mf1.name)
    expect(destinations.length).toEqual(1)
    expect(destinations[0]).toEqual(GlobalUnitsModel.AirBox.US_MIDWAY_CAP_RETURN)
  })
})
