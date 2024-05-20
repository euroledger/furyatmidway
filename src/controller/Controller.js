import BoxModel from '../model/BoxModel'

// We should have a controller to propagate view changes to the model and
// vice versa

class Controller {
    constructor() {
        this.BoxModel = new BoxModel()
    }

    addAirUnitToBox = (boxName, index, value) => {
        this.BoxModel.addAirUnitToBox (boxName, index, value)
    }

    removeAirUnitFromBox = (boxName, index) => {
        this.BoxModel.removeAirUnitFromBox (boxName, index)
    }

    getAllAirUnitsInBox = (boxName) => {
        return this.BoxModel.getAllAirUnitsInBox(boxName)
    }

    getAirUnitInBox = (boxName, index) => {
        return this.BoxModel.getAirUnitInBox(boxName, index)
    }

    isAirUnitInBox = (boxName, airUnitName) => {
        return this.BoxModel.isAirUnitInBox(boxName, airUnitName)
    }

    getAirUnitLocation = (airUnitName) => {
        return this.BoxModel.getAirUnitLocation(airUnitName)
    }

    addAirUnitToCarrier(carrier, value) {
        this.BoxModel.addAirUnitToCarrier (carrier, value)
    }

    getAirUnitsForCarrier(carrier) {
       return this.BoxModel.getAirUnitsForCarrier (carrier)
    }
}

export default Controller