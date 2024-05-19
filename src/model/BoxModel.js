import GlobalUnitsModel from "./GlobalUnitsModel"

export default class BoxModels {
    // data structures for each box on the map

    // eg CAP boxes, hangar boxes
    constructor() {
        this.japanDiv1CapBoxes = new Array(4)
        this.japanDiv2CapBoxes = new Array(4)
        this.offboard = new Array()

        // map of air unit boxes, each item is a zone within the air box represented
        // as an array. Each element in th array may or may not contain an air unit
        this.boxMap = new Map()
        this.boxMap.set(GlobalUnitsModel.AirBoxes.OFFBOARD, this.offboard)
        this.boxMap.set(GlobalUnitsModel.AirBoxes.JP_CD_CAP1, this.japanDiv1CapBoxes)
        // map of air unit -> location
        // This maps the name of an air unit to its location (ie box name, index)
        this.airUnitLocationMap = new Map()
    }

    getBoxMapObject = (key) => {
        return this.boxMap.get(key)
    }

    addAirUnitToBox = (boxName, index, value) => {
        const box = this.boxMap.get(boxName)
        if (!box) {
            return null
        }
        if (boxName === GlobalUnitsModel.AirBoxes.OFFBOARD) {
            box.push(value)
        } else {
            box[index] = value
        }

        this.addAirUnitLocationToMap(value.name, boxName, index)
    }

    addAirUnitLocationToMap = (airUnitName, boxName, boxIndex) => {
        this.airUnitLocationMap.set(airUnitName, { boxName, boxIndex })
    }

    getAirUnitLocation = (airUnitName) => {
        return this.airUnitLocationMap.get(airUnitName)
    }

    removeAirUnitFromBox = (boxName, index) => {
        const box = this.boxMap.get(boxName)
        if (!box) {
            return null
        }
        box[index] = undefined
    }

    getAllAirUnitsInBox = (boxName) => {
        const box = this.boxMap.get(boxName)
        if (!box) {
            return null
        }
        return Array.from(box.values()).filter(n => n)
    }

    isAirUnitInBox = (boxName, name) => {
        const units = this.getAllAirUnitsInBox(boxName)
        const found = units.find(unit => unit.name === name)
        return found != undefined ? true : false
    }
}