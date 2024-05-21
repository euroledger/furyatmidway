import GlobalUnitsModel from "./GlobalUnitsModel"

export default class BoxModels {
    // data structures for each box on the map

    // eg CAP boxes, hangar boxes
    constructor() {
        this.japanDiv1CapBoxes = new Array(4)
        this.japanDiv2CapBoxes = new Array(4)
        this.japanDiv1CapReturn = new Array(1)
        this.japanDiv2CapReturn = new Array(1)

        this.offboard = new Array()

        this.japanCarrierMap = new Map() // key = carrier name, value = array of air units
        this.japanCarrierMap.set("Akagi", new Array())
        this.japanCarrierMap.set("Kaga", new Array())
        this.japanCarrierMap.set("Hiryu", new Array())
        this.japanCarrierMap.set("Soryu", new Array())
        

        // map of air unit boxes, each item is a zone within the air box represented
        // as an array. Each element in th array may or may not contain an air unit
        this.boxMap = new Map()
        this.boxMap.set(GlobalUnitsModel.AirBoxes.OFFBOARD, this.offboard)
        this.boxMap.set(GlobalUnitsModel.AirBoxes.JP_CD_CAP1, this.japanDiv1CapBoxes)
        this.boxMap.set(GlobalUnitsModel.AirBoxes.JP_CAP_RETURN1, this.japanDiv1CapReturn)

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
        // remove from previous location
        const prevLocation = this.getAirUnitLocation(value.name)

        if (prevLocation != undefined) {
            this.removeAirUnitFromBox(prevLocation.boxName, prevLocation.boxIndex)
        }
        if (boxName === GlobalUnitsModel.AirBoxes.OFFBOARD) {
            box.push(value)
        } else {
            box[index] = value
        }

        this.setAirUnitLocation(value.name, boxName, index)
    }

    setAirUnitLocation = (airUnitName, boxName, boxIndex) => {
        this.airUnitLocationMap.set(airUnitName, { boxName, boxIndex })
    }

    getAirUnitLocation = (airUnitName) => {
        const loc = this.airUnitLocationMap.get(airUnitName)
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

    getAirUnitInBox = (boxName, index) => {
        const box = this.boxMap.get(boxName)
        if (!box) {
            return null
        }
        console.log("box[index] = ", box[index])
        return box[index]
    }

    isAirUnitInBox = (boxName, name) => {
        const units = this.getAllAirUnitsInBox(boxName)
        const found = units.find(unit => unit.name === name)
        return found != undefined ? true : false
    }

    addAirUnitToCarrier(carrier, value) {
        const airUnitsArray = this.japanCarrierMap.get(carrier)
        airUnitsArray.push(value)
        this.japanCarrierMap.set(carrier, airUnitsArray)
    }

    getAirUnitsForCarrier(carrier) {
        return this.japanCarrierMap.get(carrier)
    }

    getAirUnitsDeployed(carrier) {
        const airUnitsArray = this.japanCarrierMap.get(carrier)
        return airUnitsArray.filter((airUnit) => this.getAirUnitLocation(airUnit.name).boxName != GlobalUnitsModel.AirBoxes.OFFBOARD)
    }
}