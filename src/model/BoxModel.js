import GlobalUnitsModel from "./GlobalUnitsModel"

export default class BoxModels {
    // data structures for each box on the map

    // eg CAP boxes, hangar boxes
    constructor() {
        this.japanDiv1CapBoxes = new Array(4)
        this.japanDiv2CapBoxes = new Array(4)
        this.japanAkagiCapReturn1 = new Array(4)
        this.japanKagaCapReturn1 = new Array(4)
        this.japanAkagiCapReturn2 = new Array(4)
        this.japanKagaCapReturn2 = new Array(4)
        this.japanAkagiHangar = new Array(4)
        this.japanKagaHangar = new Array(4)
        this.japanAkagiFlightDeck = new Array(4)
        this.japanKagaFlightDeck = new Array(4)
        this.offboard = new Array()

        this.japanCarrierMap = new Map() // key = carrier name, value = array of air units
        this.japanCarrierMap.set(GlobalUnitsModel.Carrier.AKAGI, new Array())
        this.japanCarrierMap.set(GlobalUnitsModel.Carrier.KAGA, new Array())
        this.japanCarrierMap.set(GlobalUnitsModel.Carrier.HIRYU, new Array())
        this.japanCarrierMap.set(GlobalUnitsModel.Carrier.SORYU, new Array())
        
        // TODO
        // 1. map side -> TaskForceMap (contains two entries, one for each cardiv)
        //      "japan" -> taskForceMap
        // 2. within each TaskForceMap,
        //      "carDiv1" -> cardiv1Map
        //      "carDiv2" -> cardiv2Map
        // 3. within each CarDivMap (each contains two entries, one for each carrier)
        //          cardiv1:
        //              "akagi" -> akagiBoxMap
        //              "kaga"  -> kagaBoxMap
        //          cardiv2:
        //              "hiryu" -> hiryuBoxMap
        //              "soryu" -> soryuBoxMap
        //  4. within each CarrierMap (each contains 5 entries, one for each box)
        //              akagi:
        //                  "capBox"        -> [list of boxes]
        //                  "return1Box"    -> [list of boxes]
        //                  "return2Box"    -> [list of boxes]
        //                  "hangarBox"     -> [list of boxes]
        //                  "flightDeckBox" -> [list of boxes]
        //              
        //          ....etc.


        // map of air unit boxes, each item is a zone within the air box represented
        // as an array. Each element in th array may or may not contain an air unit
        this.boxMap = new Map()
        this.boxMap.set(GlobalUnitsModel.AirBox.OFFBOARD, this.offboard)
        this.boxMap.set(GlobalUnitsModel.AirBox.JP_CD1_CAP, this.japanDiv1CapBoxes)

        this.boxMap.set(GlobalUnitsModel.AirBox.JP_AKAGI_CAP_RETURN1, this.japanAkagiCapReturn1)
        this.boxMap.set(GlobalUnitsModel.AirBox.JP_AKAGI_CAP_RETURN2, this.japanAkagiCapReturn2)

        this.boxMap.set(GlobalUnitsModel.AirBox.JP_CAP_RETURN1, this.japanKagaCapReturn1)
        this.boxMap.set(GlobalUnitsModel.AirBox.JP_CAP_RETURN2, this.japanAkagiCapReturn2)


        this.boxMap.set(GlobalUnitsModel.AirBox.JP_AKAGI_HANGER, this.japanAkagiHangar)
        this.boxMap.set(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK, this.japanAkagiFlightDeck)

        this.boxMap.set(GlobalUnitsModel.AirBox.JP_KAGA_HANGER, this.japanKagaHangar)
        this.boxMap.set(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK, this.japanKagaFlightDeck)

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
            // console.log(` => Air Unit ${value.name}: remove from box ${prevLocation.boxName}`)
            this.removeAirUnitFromBox(prevLocation.boxName, prevLocation.boxIndex)
        }
        if (boxName === GlobalUnitsModel.AirBox.OFFBOARD) {
            box.push(value)
        } else {
            box[index] = value
        }

        // console.log(` => Air Unit ${value.name}: add to box ${boxName}`)

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
        return airUnitsArray.filter((airUnit) => this.getAirUnitLocation(airUnit.name).boxName != GlobalUnitsModel.AirBox.OFFBOARD)
    }
}