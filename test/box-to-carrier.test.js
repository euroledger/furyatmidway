import Controller from "../src/controller/Controller"
import loadCounters from "../src/CounterLoader"
import GlobalUnitsModel from "../src/model/GlobalUnitsModel"

describe("Air Operations tests for air units in Return 2 boxes", () => {
  let controller
  let counters
  let kaf1, aaf1, haf1, saf1
  let ef1, hf1, yf1, mf1

  beforeEach(() => {
    controller = new Controller()
    counters = loadCounters(controller)

    kaf1 = counters.get("Kaga-A6M-2b-1")
    aaf1 = counters.get("Akagi-A6M-2b-1")

    haf1 = counters.get("Hiryu-A6M-2b-1")
    saf1 = counters.get("Soryu-A6M-2b-1")
    // CAR DIV 1
    // Two units both on the flight deck Akagi unit on original, Kaga on other carrier of same division
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK, 0, aaf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK, 1, kaf1)

    //  CAR DIV 2
    // Two units now on carriers in the other division
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK, 0, haf1)
    controller.addAirUnitToBox(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK, 1, saf1)

    // ef1 = counters.get("Enterprise-F4F4-1")
    // hf1 = counters.get("Hornet-F4F4-1")

    // yf1 = counters.get("Yorktown-F4F4-1")

    // mf1 = counters.get("Midway-F4F3")

    // // TF16
    // controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN2, 0, ef1)
    // controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF16_RETURN2, 1, hf1)

    // // TF17
    // controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_TF17_RETURN2, 0, yf1)

    // // MIDWAY
    // controller.addAirUnitToBox(GlobalUnitsModel.AirBox.US_MIDWAY_RETURN2, 0, mf1)
  })

  test("Test carrier launched from is correct when unit is on a different carrier to iriginal parent", () => {
        const akagiUnit = controller.getCarrierAirUnitLaunchedFrom(aaf1.name)
        expect(akagiUnit).toEqual(GlobalUnitsModel.Carrier.AKAGI)

        const kagaUnit = controller.getCarrierAirUnitLaunchedFrom(kaf1.name)
        expect(kagaUnit).toEqual(GlobalUnitsModel.Carrier.AKAGI)

        const hiryuUnit = controller.getCarrierAirUnitLaunchedFrom(haf1.name)
        expect(hiryuUnit).toEqual(GlobalUnitsModel.Carrier.AKAGI)

        const soryuUnit = controller.getCarrierAirUnitLaunchedFrom(saf1.name)
        expect(soryuUnit).toEqual(GlobalUnitsModel.Carrier.KAGA)
  })

})
