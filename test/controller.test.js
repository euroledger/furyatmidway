
import Controller from '../src/controller/Controller'
import GlobalUnitsModel from '../src/model/GlobalUnitsModel';
import loadCounters from "../src/Loader";

describe('Controller tests', () => {
    let controller;
    let counters

    beforeEach(() => {
        controller = new Controller()
        counters = loadCounters(controller);
    });

    test("check air units can be added, retrieved and removed to/from model", () => {
        // get air unit from data store
        const af = counters.get("Akagi-A6M-2b-2");

        // add this air unit to the CAP box
        controller.addAirUnitToBox(GlobalUnitsModel.AirBoxes.JP_CD_CAP1, 0, af)

        // return all air units in this box, make sure we get back the same air unit (only)
        let airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBoxes.JP_CD_CAP1)

        expect(airUnits.length).toBe(1)
        expect(airUnits[0].name).toBe("Akagi-A6M-2b-2")

        controller.removeAirUnitFromBox(GlobalUnitsModel.AirBoxes.JP_CD_CAP1, 0)
        airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBoxes.JP_CD_CAP1)
        expect(airUnits.length).toBe(0)
    });

    test("Test to see if air unit is present in a particular box", () => {
        const af = counters.get("Akagi-A6M-2b-2");
        controller.addAirUnitToBox(GlobalUnitsModel.AirBoxes.JP_CD_CAP1, 0, af)

        let found = controller.isAirUnitInBox(GlobalUnitsModel.AirBoxes.JP_CD_CAP1, "Akagi-A6M-2b-2")
        expect(found).toBe(true)

        found = controller.isAirUnitInBox(GlobalUnitsModel.AirBoxes.JP_CD_CAP1, "Akagi-A6M-2b-1")
        expect(found).toBe(false)
    });

    test("Initial placement of air units off board", () => {
        const af1 = counters.get("Akagi-A6M-2b-1");
        const af2 = counters.get("Akagi-A6M-2b-2");

        controller.addAirUnitToBox(GlobalUnitsModel.AirBoxes.OFFBOARD, 0, af1)
        controller.addAirUnitToBox(GlobalUnitsModel.AirBoxes.OFFBOARD, 0, af2)

        let location = controller.getAirUnitLocation("Akagi-A6M-2b-1")
        expect(location.boxName).toBe(GlobalUnitsModel.AirBoxes.OFFBOARD)

        location = controller.getAirUnitLocation("Akagi-A6M-2b-2")
        expect(location.boxName).toBe(GlobalUnitsModel.AirBoxes.OFFBOARD)
    });

    test("Test the air unit location (box name and index", () => {
        const af = counters.get("Akagi-A6M-2b-2");
        controller.addAirUnitToBox(GlobalUnitsModel.AirBoxes.JP_CD_CAP1, 2, af)

        const { boxName, boxIndex } = controller.getAirUnitLocation("Akagi-A6M-2b-2")

        expect(boxName).toBe(GlobalUnitsModel.AirBoxes.JP_CD_CAP1)
        expect(boxIndex).toBe(2)
    });

    test("Move an air unit from OFFBOARD to the CAP box to the CAP returning box", () => {
        const af1 = counters.get("Akagi-A6M-2b-1");
        const af2 = counters.get("Akagi-A6M-2b-2");

        // loader adds units to OFFBOARD during load process

        controller.addAirUnitToBox(GlobalUnitsModel.AirBoxes.JP_CD_CAP1, 2, af1)
        controller.addAirUnitToBox(GlobalUnitsModel.AirBoxes.JP_CD_CAP1, 3, af2)

        controller.addAirUnitToBox(GlobalUnitsModel.AirBoxes.JP_CAP_RETURN1, 0, af1)

        let location = controller.getAirUnitLocation("Akagi-A6M-2b-1")
        expect(location.boxName).toBe(GlobalUnitsModel.AirBoxes.JP_CAP_RETURN1)
        expect(location.boxIndex).toBe(0)

        location = controller.getAirUnitLocation("Akagi-A6M-2b-2")
        expect(location.boxName).toBe(GlobalUnitsModel.AirBoxes.JP_CD_CAP1)
        expect(location.boxIndex).toBe(3)

        let airUnits = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBoxes.JP_CD_CAP1)
        expect(airUnits.length).toBe(1)
    });

    test("Air Units for Carrier", () => {
        const airUnits = controller.getAirUnitsForCarrier("Akagi")
        expect(airUnits.length).toBe(4)

        expect(airUnits[0].name).toBe("Akagi-A6M-2b-1")
        expect(airUnits[1].name).toBe("Akagi-A6M-2b-2")
        expect(airUnits[2].name).toBe("Akagi-D3A-1")
        expect(airUnits[3].name).toBe("Akagi-B5N-2")
    });
});