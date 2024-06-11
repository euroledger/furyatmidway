import Controller from "../src/controller/Controller"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"
import loadCounters from "../src/CounterLoader"

describe("Japan Air Box tests", () => {
  let controller
  let counters

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)
  })

  test("check Japanese CD1 air units can be added to various carrier air boxes", () => {
    // get all Akagi air units from data store
    const kaf1 = counters.get("Kaga-A6M-2b-1")
    const kaf2 = counters.get("Kaga-A6M-2b-2")
    const kdb = counters.get("Kaga-D3A-1")
    const ktb = counters.get("Kaga-B5N-2")

    const aaf1 = counters.get("Akagi-A6M-2b-1")
    const aaf2 = counters.get("Akagi-A6M-2b-2")
    const adb = counters.get("Akagi-D3A-1")
    const atb = counters.get("Akagi-B5N-2")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 0, aaf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP, 1, kaf1)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN, 0, aaf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN, 1, kaf2)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_HANGER, 0, kdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_HANGER, 1, ktb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, 0, adb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN2, 1, atb)

    // return all air units in these boxes, make sure we get back the same air unit (only)
    let airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_CD1_CAP)

    expect(airUnits.length).toEqual(2)
    expect(airUnits[0].name).toEqual("Akagi-A6M-2b-1")
    expect(airUnits[1].name).toEqual("Kaga-A6M-2b-1")

    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN)

    expect(airUnits.length).toEqual(2)
    expect(airUnits[0].name).toEqual("Akagi-A6M-2b-2")
    expect(airUnits[1].name).toEqual("Kaga-A6M-2b-2")

    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_KAGA_HANGER)

    expect(airUnits.length).toEqual(2)
    expect(airUnits[0].name).toEqual("Kaga-D3A-1")
    expect(airUnits[1].name).toEqual("Kaga-B5N-2")

    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1)

    expect(airUnits.length).toEqual(1)
    expect(airUnits[0].name).toEqual("Akagi-D3A-1")

    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN2)

    expect(airUnits.length).toEqual(1)
    expect(airUnits[0].name).toEqual("Akagi-B5N-2")
  })

  test("check Japanese CD2 air units can be added to various carrier air boxes", () => {
    // get all Akagi air units from data store
    const haf1 = counters.get("Hiryu-A6M-2b-1")
    const haf2 = counters.get("Hiryu-A6M-2b-2")
    const hdb = counters.get("Hiryu-D3A-1")
    const htb = counters.get("Hiryu-B5N-2")

    const saf1 = counters.get("Soryu-A6M-2b-1")
    const saf2 = counters.get("Soryu-A6M-2b-2")
    const sdb = counters.get("Soryu-D3A-1")
    const stb = counters.get("Soryu-B5N-2")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_CAP, 0, haf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_CAP, 1, saf1)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_CAP_RETURN, 0, haf2)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_CAP_RETURN, 1, saf2)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, 0, hdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, 1, htb)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_RETURN1, 0, sdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_RETURN2, 1, stb)

    // return all air units in these boxes, make sure we get back the same air unit (only)
    let airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_CD2_CAP)

    expect(airUnits.length).toEqual(2)
    expect(airUnits[0].name).toEqual("Hiryu-A6M-2b-1")
    expect(airUnits[1].name).toEqual("Soryu-A6M-2b-1")

    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_CD2_CAP_RETURN)

    expect(airUnits.length).toEqual(2)
    expect(airUnits[0].name).toEqual("Hiryu-A6M-2b-2")
    expect(airUnits[1].name).toEqual("Soryu-A6M-2b-2")

    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER)

    expect(airUnits.length).toEqual(2)
    expect(airUnits[0].name).toEqual("Hiryu-D3A-1")
    expect(airUnits[1].name).toEqual("Hiryu-B5N-2")

    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_CD2_RETURN1)

    expect(airUnits.length).toEqual(1)
    expect(airUnits[0].name).toEqual("Soryu-D3A-1")

    airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_CD2_RETURN2)

    expect(airUnits.length).toEqual(1)
    expect(airUnits[0].name).toEqual("Soryu-B5N-2")
  })

  test("Check indexes of filled Japan air boxes", () => {
    const haf1 = counters.get("Hiryu-A6M-2b-1")
    const haf2 = counters.get("Hiryu-A6M-2b-2")
    const hdb = counters.get("Hiryu-D3A-1")
    const htb = counters.get("Hiryu-B5N-2")
    const stb = counters.get("Soryu-B5N-2")

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, 0, hdb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, 1, haf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, 2, haf2)
    let zone = controller.getFirstAvailableZone(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, GlobalUnitsModel.Side.JAPAN)
    expect(zone).toEqual(3)

    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, 3, htb)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, 4, stb)
    zone = controller.getFirstAvailableZone(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, GlobalUnitsModel.Side.JAPAN)
    expect(zone).toEqual(-1)
  })

  test("Add Japanese air units to box using next available slot", () => {
    let numZones = controller.getNumberZonesInBox(GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN)
    expect(numZones).toEqual(4)

    numZones = controller.getNumberZonesInBox(GlobalUnitsModel.AirBox.JP_CD1_RETURN1)
    expect(numZones).toEqual(6)

    const haf1 = counters.get("Hiryu-A6M-2b-1")
    const haf2 = counters.get("Hiryu-A6M-2b-2")
    const hdb = counters.get("Hiryu-D3A-1")
    const htb = counters.get("Hiryu-B5N-2")
    const stb = counters.get("Soryu-B5N-2")

    controller.addAirUnitToBoxUsingNextFreeSlot(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, hdb)
    controller.addAirUnitToBoxUsingNextFreeSlot(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, haf1)
    controller.addAirUnitToBoxUsingNextFreeSlot(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, haf2)
    let zone = controller.getFirstAvailableZone(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER)
    expect(zone).toEqual(3)

    const units = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER)
    expect(units.length).toEqual(3)
  })

  test("Free slots can be determined from the state of a Japanese box", () => {
    const haf1 = counters.get("Hiryu-A6M-2b-1")
    const haf2 = counters.get("Hiryu-A6M-2b-2")
    const hdb = counters.get("Hiryu-D3A-1")

    controller.addAirUnitToBoxUsingNextFreeSlot(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, hdb)
    controller.addAirUnitToBoxUsingNextFreeSlot(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, haf1)
    controller.addAirUnitToBoxUsingNextFreeSlot(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, haf2)

    let slots = controller.getAllFreeZonesInBox(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER)
    expect(slots.length).toEqual(2)


    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_RETURN1, 2, haf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_CD2_RETURN1, 4, haf2)
    slots = controller.getAllFreeZonesInBox(GlobalUnitsModel.AirBox.JP_CD2_RETURN1)
    expect(slots.length).toEqual(4)
    expect(slots).toEqual([ 0, 1, 3, 5 ])
  })
})
