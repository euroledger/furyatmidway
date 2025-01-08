import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import { createFleetMove } from "./TestUtils"
import { distanceBetweenHexes } from "../src/components/HexUtils"

describe("Numeric Evaluation Of State of Each Side's Naval and Air Power", () => {
  let controller
  let counters
  let ef1, ef2, edb1, edb2, etb, hf1, hf2, hdb1, hdb2, htb
  let mf1, mf2, mdb, mdb2, mtb, mhb1, mhb2
  let yf1, yf2, ydb1, ydb2, ytb

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)

    controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HORNET, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.MIDWAY, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.KAGA, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HIRYU, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.SORYU, 0)

    yf1 = counters.get("Yorktown-F4F4-1")
    yf2 = counters.get("Yorktown-F4F4-2")
    ydb1 = counters.get("Yorktown-SBD3-1")
    ydb2 = counters.get("Yorktown-SBD3-2")
    ytb = counters.get("Yorktown-TBD1")

    ef1 = counters.get("Enterprise-F4F4-1")
    ef2 = counters.get("Enterprise-F4F4-2")
    edb1 = counters.get("Enterprise-SBD3-1")
    edb2 = counters.get("Enterprise-SBD3-2")
    etb = counters.get("Enterprise-TBD1")

    hf1 = counters.get("Hornet-F4F4-1")
    hf2 = counters.get("Hornet-F4F4-2")
    hdb1 = counters.get("Hornet-SBD3-1")
    hdb2 = counters.get("Hornet-SBD3-2")
    htb = counters.get("Hornet-TBD1")

    mf1 = counters.get("Midway-F4F3")
    mf2 = counters.get("Midway-F2A-3")
    mdb = counters.get("Midway-SBD-2")
    mdb2 = counters.get("Midway-SB2U-3")
    mtb = counters.get("Midway-TBF-1")
    mhb1 = counters.get("Midway-B26-B")
  })

  test("US Carrier Remaining Strength", () => {
    // measures remaining undamaged Flight Deck boxes
    let strength = controller.getFleetStrength(GlobalUnitsModel.Side.US)
    expect(strength).toEqual(12)

    let strengthAsArray = controller.getFleetStrengthAsArray(GlobalUnitsModel.Side.US)
    expect(strengthAsArray).toEqual([3, 3, 3, 3])

    controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 1)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HORNET, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.MIDWAY, 2)

    // Remaining Flight Deck Capacity = 2 + 3 + 0 + 1 = 6
    strength = controller.getFleetStrength(GlobalUnitsModel.Side.US)
    expect(strength).toEqual(6)

    strengthAsArray = controller.getFleetStrengthAsArray(GlobalUnitsModel.Side.US)
    expect(strengthAsArray).toEqual([2, 3, 0, 1])

    controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HORNET, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.MIDWAY, 3)

    strength = controller.getFleetStrength(GlobalUnitsModel.Side.US)
    expect(strength).toEqual(0)

    strengthAsArray = controller.getFleetStrengthAsArray(GlobalUnitsModel.Side.US)
    expect(strengthAsArray).toEqual([0, 0, 0, 0])
  })

  test("Japan Carrier Remaining Strength", () => {
    // measures remaining undamaged Flight Deck boxes
    let strength = controller.getFleetStrength(GlobalUnitsModel.Side.JAPAN)
    expect(strength).toEqual(12)

    let strengthAsArray = controller.getFleetStrengthAsArray(GlobalUnitsModel.Side.JAPAN)
    expect(strengthAsArray).toEqual([3, 3, 3, 3])

    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 1)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.KAGA, 0)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HIRYU, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.SORYU, 2)

    // Remaining Flight Deck Capacity = 1 + 2 + 0 + 0 = 3
    strength = controller.getFleetStrength(GlobalUnitsModel.Side.JAPAN)
    expect(strength).toEqual(6)

    strengthAsArray = controller.getFleetStrengthAsArray(GlobalUnitsModel.Side.JAPAN)
    expect(strengthAsArray).toEqual([2, 3, 0, 1])

    controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.KAGA, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.HIRYU, 3)
    controller.setCarrierHits(GlobalUnitsModel.Carrier.SORYU, 3)

    strength = controller.getFleetStrength(GlobalUnitsModel.Side.JAPAN)
    expect(strength).toEqual(0)

    strengthAsArray = controller.getFleetStrengthAsArray(GlobalUnitsModel.Side.JAPAN)
    expect(strengthAsArray).toEqual([0, 0, 0, 0])
  })

  test("US Air Units Remaining Strength", () => {
    let strength = controller.getAirStrength(GlobalUnitsModel.Side.US)
    expect(strength).toEqual(38)

    let strengthAsArray = controller.getAirStrengthAsArray(GlobalUnitsModel.Side.US)
    expect(strengthAsArray).toEqual([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 1, 1, 1])
  })

  test("US Air Units Remaining Strength", () => {
    let strength = controller.getAirStrength(GlobalUnitsModel.Side.JAPAN)
    expect(strength).toEqual(32)

    let strengthAsArray = controller.getAirStrengthAsArray(GlobalUnitsModel.Side.JAPAN)
    expect(strengthAsArray).toEqual([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2])
  })

  test("Variables Used in Air Operations - US", () => {
    createFleetMove(controller, 1, 3, "1AF", GlobalUnitsModel.Side.JAPAN) // A,3
    createFleetMove(controller, 7, 1, "CSF", GlobalUnitsModel.Side.US) // G,4

    const locationCSF = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
    const location1AF = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
    const distanceBetweenCSFand1AF = distanceBetweenHexes(locationCSF.currentHex, location1AF.currentHex)
    expect(distanceBetweenCSFand1AF).toEqual(6)

    const distanceBetweenMidwayand1AF = distanceBetweenHexes(Controller.MIDWAY_HEX.currentHex, location1AF.currentHex)
    expect(distanceBetweenMidwayand1AF).toEqual(5)
  })
})
