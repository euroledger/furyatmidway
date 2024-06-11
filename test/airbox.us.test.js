import Controller from "../src/controller/Controller"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import loadCounters from "../src/CounterLoader"

describe("US Air Box tests", () => {
  let controller
  let counters

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)
  })

  test("check US TF16 air units can be added to various carrier air boxes", () => {
    // get all Enterprise air units from data store
    const ef1 = counters.get("Enterprise-F4F4-1")
    const ef2 = counters.get("Enterprise-F4F4-2")
    const edb1 = counters.get("Enterprise-SBD3-1")
    const edb2 = counters.get("Enterprise-SBD3-2")
    const etb = counters.get("Enterprise-TBD1")

    const hf1 = counters.get("Hornet-F4F4-1")
    const hf2 = counters.get("Hornet-F4F4-2")
    const hdb1 = counters.get("Hornet-SBD3-1")
    const hdb2 = counters.get("Hornet-SBD3-2")
    const htb = counters.get("Hornet-TBD1")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_CAP, 0, ef1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_CAP, 1, hf1)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_CAP_RETURN, 0, ef2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_CAP_RETURN, 1, hf2)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGER, 0, edb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, 1, etb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_HORNET_HANGER, 0, hdb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK, 1, htb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1, 0, edb2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN2, 1, hdb2)

    // return all air units in these boxes, make sure we get back the same air unit (only)
    let airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_TF16_CAP)

    expect(airUnits.length).toEqual(2)
    expect(airUnits[0].name).toEqual("Enterprise-F4F4-1")
    expect(airUnits[1].name).toEqual("Hornet-F4F4-1")

    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_TF16_CAP_RETURN)

    expect(airUnits.length).toEqual(2)
    expect(airUnits[0].name).toEqual("Enterprise-F4F4-2")
    expect(airUnits[1].name).toEqual("Hornet-F4F4-2")

    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGER)
    expect(airUnits.length).toEqual(1)
    expect(airUnits[0].name).toEqual("Enterprise-SBD3-1")

    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_HORNET_HANGER)
    expect(airUnits.length).toEqual(1)
    expect(airUnits[0].name).toEqual("Hornet-SBD3-1")

    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1)

    expect(airUnits.length).toEqual(1)
    expect(airUnits[0].name).toEqual("Enterprise-SBD3-2")

    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_TF16_RETURN2)

    expect(airUnits.length).toEqual(1)
    expect(airUnits[0].name).toEqual("Hornet-SBD3-2")
  })

  test("check US TF17 air units can be added to various carrier air boxes", () => {
    // get all Enterprise air units from data store
    const yf1 = counters.get("Yorktown-F4F4-1")
    const yf2 = counters.get("Yorktown-F4F4-2")
    const ydb1 = counters.get("Yorktown-SBD3-1")
    const ydb2 = counters.get("Yorktown-SBD3-2")
    const ytb = counters.get("Yorktown-TBD1")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF17_CAP, 0, yf1)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF17_CAP_RETURN, 0, yf2)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_YORKTOWN_HANGER, 0, ydb1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_YORKTOWN_FLIGHT_DECK, 1, ytb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF17_RETURN1, 0, ydb2)

    // return all air units in these boxes, make sure we get back the same air unit (only)
    let airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_TF17_CAP)
    expect(airUnits.length).toEqual(1)
    expect(airUnits[0].name).toEqual("Yorktown-F4F4-1")

    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_TF17_CAP_RETURN)
    expect(airUnits.length).toEqual(1)
    expect(airUnits[0].name).toEqual("Yorktown-F4F4-2")

    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_YORKTOWN_HANGER)
    expect(airUnits.length).toEqual(1)
    expect(airUnits[0].name).toEqual("Yorktown-SBD3-1")

    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_YORKTOWN_FLIGHT_DECK)
    expect(airUnits.length).toEqual(1)
    expect(airUnits[0].name).toEqual("Yorktown-TBD1")

    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_TF17_RETURN1)
    expect(airUnits.length).toEqual(1)
    expect(airUnits[0].name).toEqual("Yorktown-SBD3-2")
  })

  // test("check US Midway air units can be added to various carrier air boxes", () => {
  // })

  // test("Check indexes of filled Japan air boxes", () => {
  //   const haf1 = counters.get("Hiryu-A6M-2b-1")
  //   const haf2 = counters.get("Hiryu-A6M-2b-2")
  //   const hdb = counters.get("Hiryu-D3A-1")
  //   const htb = counters.get("Hiryu-B5N-2")
  //   const stb = counters.get("Soryu-B5N-2")

  //   controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, 0, hdb)
  //   controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, 1, haf1)
  //   controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, 2, haf2)
  //   let zone = controller.getFirstAvailableZone(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, GlobalUnitsModel.Side.JAPAN)
  //   expect(zone).toEqual(3)

  //   controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, 3, htb)
  //   controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, 4, stb)
  //   zone = controller.getFirstAvailableZone(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, GlobalUnitsModel.Side.JAPAN)
  //   expect(zone).toEqual(-1)
  // })

  // test("Add Japanese air units to box using next available slot", () => {
  //   let numZones = controller.getNumberZonesInBox(GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN)
  //   expect(numZones).toEqual(4)

  //   numZones = controller.getNumberZonesInBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1)
  //   expect(numZones).toEqual(6)

  //   const haf1 = counters.get("Hiryu-A6M-2b-1")
  //   const haf2 = counters.get("Hiryu-A6M-2b-2")
  //   const hdb = counters.get("Hiryu-D3A-1")
  //   const htb = counters.get("Hiryu-B5N-2")
  //   const stb = counters.get("Soryu-B5N-2")

  //   controller.addAirUnitToBoxUsingNextFreeSlot(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, hdb)
  //   controller.addAirUnitToBoxUsingNextFreeSlot(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, haf1)
  //   controller.addAirUnitToBoxUsingNextFreeSlot(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, haf2)
  //   let zone = controller.getFirstAvailableZone(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER)
  //   expect(zone).toEqual(3)

  //   const units = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER)
  //   expect(units.length).toEqual(3)
  // })

  // test("Free slots can be determined from the state of a Japanese box", () => {
  //   const haf1 = counters.get("Hiryu-A6M-2b-1")
  //   const haf2 = counters.get("Hiryu-A6M-2b-2")
  //   const hdb = counters.get("Hiryu-D3A-1")

  //   controller.addAirUnitToBoxUsingNextFreeSlot(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, hdb)
  //   controller.addAirUnitToBoxUsingNextFreeSlot(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, haf1)
  //   controller.addAirUnitToBoxUsingNextFreeSlot(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, haf2)

  //   let slots = controller.getAllFreeZonesInBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER)
  //   expect(slots.length).toEqual(2)

  //   controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_RETURN1, 2, haf1)
  //   controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_RETURN1, 4, haf2)
  //   slots = controller.getAllFreeZonesInBox(GlobalUnitsModel.AirBox.JP_CD2_RETURN1)
  //   expect(slots.length).toEqual(4)
  //   expect(slots).toEqual([ 0, 1, 3, 5 ])
  // })
})
