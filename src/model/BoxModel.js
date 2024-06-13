import GlobalUnitsModel from "./GlobalUnitsModel"
import JapanAirBoxOffsets from "../components/draganddrop/JapanAirBoxOffsets"
import USAirBoxOffsets from "../components/draganddrop/USAirBoxOffsets"

export default class BoxModels {
  getNumberOfJapanZones(boxName) {
    const box = JapanAirBoxOffsets.filter((b) => b.name === boxName)
    return box[0].offsets.length
  }

  getNumberOfUSZones(boxName) {
    const box = USAirBoxOffsets.filter((b) => b.name === boxName)
    return box[0].offsets.length
  }
  // data structures for each box on the map

  // eg CAP boxes, hangar boxes
  constructor() {
    this.japanDiv1CapBoxes = new Array(this.getNumberOfJapanZones(GlobalUnitsModel.AirBox.JP_CD1_CAP))
    this.japanDiv2CapBoxes = new Array(this.getNumberOfJapanZones(GlobalUnitsModel.AirBox.JP_CD2_CAP))

    this.japanCD1Return1 = new Array(this.getNumberOfJapanZones(GlobalUnitsModel.AirBox.JP_CD1_RETURN1))
    this.japanCD1Return2 = new Array(this.getNumberOfJapanZones(GlobalUnitsModel.AirBox.JP_CD1_RETURN2))
    this.japanCD1CapReturn = new Array(this.getNumberOfJapanZones(GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN))

    this.japanAkagiHangar = new Array(this.getNumberOfJapanZones(GlobalUnitsModel.AirBox.JP_AKAGI_HANGER))
    this.japanKagaHangar = new Array(this.getNumberOfJapanZones(GlobalUnitsModel.AirBox.JP_KAGA_HANGER))
    this.japanAkagiFlightDeck = new Array(this.getNumberOfJapanZones(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK))
    this.japanKagaFlightDeck = new Array(this.getNumberOfJapanZones(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK))

    this.japanCD2Return1 = new Array(this.getNumberOfJapanZones(GlobalUnitsModel.AirBox.JP_CD2_RETURN1))
    this.japanCD2Return2 = new Array(this.getNumberOfJapanZones(GlobalUnitsModel.AirBox.JP_CD2_RETURN2))
    this.japanCD2CapReturn = new Array(this.getNumberOfJapanZones(GlobalUnitsModel.AirBox.JP_CD2_CAP_RETURN))

    this.japanHiryuHangar = new Array(this.getNumberOfJapanZones(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER))
    this.japanSoryuHangar = new Array(this.getNumberOfJapanZones(GlobalUnitsModel.AirBox.JP_SORYU_HANGER))
    this.japanHiryuFlightDeck = new Array(this.getNumberOfJapanZones(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK))
    this.japanSoryuFlightDeck = new Array(this.getNumberOfJapanZones(GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK))
    this.offboard = new Array()

    this.japanCarrierMap = new Map() // key = carrier name, value = array of air units
    this.japanCarrierMap.set(GlobalUnitsModel.Carrier.AKAGI, new Array())
    this.japanCarrierMap.set(GlobalUnitsModel.Carrier.KAGA, new Array())
    this.japanCarrierMap.set(GlobalUnitsModel.Carrier.HIRYU, new Array())
    this.japanCarrierMap.set(GlobalUnitsModel.Carrier.SORYU, new Array())

    // US Model
    this.usTF16CapBoxes = new Array(this.getNumberOfUSZones(GlobalUnitsModel.AirBox.US_TF16_CAP))
    this.usTF17CapBoxes = new Array(this.getNumberOfUSZones(GlobalUnitsModel.AirBox.US_TF17_CAP))
    this.usMidwayCapBoxes = new Array(this.getNumberOfUSZones(GlobalUnitsModel.AirBox.US_MIDWAY_CAP))

    this.usTF16Return1 = new Array(this.getNumberOfUSZones(GlobalUnitsModel.AirBox.US_TF16_RETURN1))
    this.usTF16Return2 = new Array(this.getNumberOfUSZones(GlobalUnitsModel.AirBox.US_TF16_RETURN2))
    this.usTF16CapReturn = new Array(this.getNumberOfUSZones(GlobalUnitsModel.AirBox.US_TF16_CAP_RETURN))

    this.usEnterpriseHangar = new Array(this.getNumberOfUSZones(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGER))
    this.usHornetHangar = new Array(this.getNumberOfUSZones(GlobalUnitsModel.AirBox.US_HORNET_HANGER))
    this.usEnterpriseFlightDeck = new Array(this.getNumberOfUSZones(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK))
    this.usHornetFlightDeck = new Array(this.getNumberOfUSZones(GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK))

    this.usTF17Return1 = new Array(this.getNumberOfUSZones(GlobalUnitsModel.AirBox.US_TF17_RETURN1))
    this.usTF17Return2 = new Array(this.getNumberOfUSZones(GlobalUnitsModel.AirBox.US_TF17_RETURN2))
    this.usTF17CapReturn = new Array(this.getNumberOfUSZones(GlobalUnitsModel.AirBox.US_TF17_CAP_RETURN))

    this.usMidwayReturn1 = new Array(this.getNumberOfUSZones(GlobalUnitsModel.AirBox.US_MIDWAY_RETURN1))
    this.usMidwayReturn2 = new Array(this.getNumberOfUSZones(GlobalUnitsModel.AirBox.US_MIDWAY_RETURN2))
    this.usMidwayCapReturn = new Array(this.getNumberOfUSZones(GlobalUnitsModel.AirBox.US_MIDWAY_CAP_RETURN))

    this.usYorktownHangar = new Array(this.getNumberOfUSZones(GlobalUnitsModel.AirBox.US_YORKTOWN_HANGER))
    this.usMidwayHangar = new Array(this.getNumberOfUSZones(GlobalUnitsModel.AirBox.US_MIDWAY_HANGER))
    this.usYorktownFlightDeck = new Array(this.getNumberOfUSZones(GlobalUnitsModel.AirBox.US_YORKTOWN_FLIGHT_DECK))
    this.usMidwayFlightDeck = new Array(this.getNumberOfUSZones(GlobalUnitsModel.AirBox.US_MIDWAY_FLIGHT_DECK))
    this.offboard = new Array()

    this.usCarrierMap = new Map() // key = carrier name, value = array of air units
    this.usCarrierMap.set(GlobalUnitsModel.Carrier.ENTERPRISE, new Array())
    this.usCarrierMap.set(GlobalUnitsModel.Carrier.HORNET, new Array())
    this.usCarrierMap.set(GlobalUnitsModel.Carrier.YORKTOWN, new Array())
    this.usCarrierMap.set(GlobalUnitsModel.Carrier.MIDWAY, new Array())

    // map of air unit boxes, each item is a zone within the air box represented
    // as an array. Each element in th array may or may not contain an air unit
    this.boxMap = new Map()
    this.boxMap.set(GlobalUnitsModel.AirBox.OFFBOARD, this.offboard)
    this.boxMap.set(GlobalUnitsModel.AirBox.JP_CD1_CAP, this.japanDiv1CapBoxes)
    this.boxMap.set(GlobalUnitsModel.AirBox.JP_CD2_CAP, this.japanDiv2CapBoxes)

    this.boxMap.set(GlobalUnitsModel.AirBox.JP_CD1_RETURN2, this.japanCD1Return2)
    this.boxMap.set(GlobalUnitsModel.AirBox.JP_CD1_RETURN1, this.japanCD1Return1)

    this.boxMap.set(GlobalUnitsModel.AirBox.JP_CD2_RETURN2, this.japanCD2Return2)
    this.boxMap.set(GlobalUnitsModel.AirBox.JP_CD2_RETURN1, this.japanCD2Return1)

    this.boxMap.set(GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN, this.japanCD1CapReturn)
    this.boxMap.set(GlobalUnitsModel.AirBox.JP_CD2_CAP_RETURN, this.japanCD2CapReturn)

    this.boxMap.set(GlobalUnitsModel.AirBox.JP_AKAGI_HANGER, this.japanAkagiHangar)
    this.boxMap.set(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK, this.japanAkagiFlightDeck)

    this.boxMap.set(GlobalUnitsModel.AirBox.JP_KAGA_HANGER, this.japanKagaHangar)
    this.boxMap.set(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK, this.japanKagaFlightDeck)

    this.boxMap.set(GlobalUnitsModel.AirBox.JP_HIRYU_HANGER, this.japanHiryuHangar)
    this.boxMap.set(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK, this.japanHiryuFlightDeck)

    this.boxMap.set(GlobalUnitsModel.AirBox.JP_SORYU_HANGER, this.japanSoryuHangar)
    this.boxMap.set(GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK, this.japanSoryuFlightDeck)

    // US BOX MAP
    this.boxMap.set(GlobalUnitsModel.AirBox.US_TF16_CAP, this.usTF16CapBoxes)
    this.boxMap.set(GlobalUnitsModel.AirBox.US_TF17_CAP, this.usTF17CapBoxes)
    this.boxMap.set(GlobalUnitsModel.AirBox.US_MIDWAY_CAP, this.usMidwayCapBoxes)

    this.boxMap.set(GlobalUnitsModel.AirBox.US_TF16_RETURN2, this.usTF16Return2)
    this.boxMap.set(GlobalUnitsModel.AirBox.US_TF16_RETURN1, this.usTF16Return1)

    this.boxMap.set(GlobalUnitsModel.AirBox.US_TF17_RETURN2, this.usTF17Return2)
    this.boxMap.set(GlobalUnitsModel.AirBox.US_TF17_RETURN1, this.usTF17Return1)

    this.boxMap.set(GlobalUnitsModel.AirBox.US_MIDWAY_RETURN2, this.usMidwayReturn2)
    this.boxMap.set(GlobalUnitsModel.AirBox.US_MIDWAY_RETURN1, this.usMidwayReturn1)

    this.boxMap.set(GlobalUnitsModel.AirBox.US_TF16_CAP_RETURN, this.usTF16CapReturn)
    this.boxMap.set(GlobalUnitsModel.AirBox.US_TF17_CAP_RETURN, this.usTF17CapReturn)
    this.boxMap.set(GlobalUnitsModel.AirBox.US_MIDWAY_CAP_RETURN, this.usMidwayCapReturn)

    this.boxMap.set(GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGER, this.usEnterpriseHangar)
    this.boxMap.set(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK, this.usEnterpriseFlightDeck)

    this.boxMap.set(GlobalUnitsModel.AirBox.US_HORNET_HANGER, this.usHornetHangar)
    this.boxMap.set(GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK, this.usHornetFlightDeck)

    this.boxMap.set(GlobalUnitsModel.AirBox.US_YORKTOWN_HANGER, this.usYorktownHangar)
    this.boxMap.set(GlobalUnitsModel.AirBox.US_YORKTOWN_FLIGHT_DECK, this.usYorktownFlightDeck)

    this.boxMap.set(GlobalUnitsModel.AirBox.US_MIDWAY_HANGER, this.usMidwayHangar)
    this.boxMap.set(GlobalUnitsModel.AirBox.US_MIDWAY_FLIGHT_DECK, this.usMidwayFlightDeck)

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
    return Array.from(box.values()).filter((n) => n)
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
    const found = units.find((unit) => unit.name === name)
    return found != undefined ? true : false
  }

  addAirUnitToJapaneseCarrier(carrier, value) {
    const airUnitsArray = this.japanCarrierMap.get(carrier)
    airUnitsArray.push(value)
    this.japanCarrierMap.set(carrier, airUnitsArray)
  }

  addAirUnitToUSCarrier(carrier, value) {
    const airUnitsArray = this.usCarrierMap.get(carrier)
    airUnitsArray.push(value)
    this.usCarrierMap.set(carrier, airUnitsArray)
  }

  getAirUnitsForJapaneseCarrier(carrier) {
    return this.japanCarrierMap.get(carrier)
  }

  getAirUnitsForUSCarrier(carrier) {
    return this.usCarrierMap.get(carrier)
  }

  getJapaneseAirUnitsDeployed(carrier) {
    const airUnitsArray = this.japanCarrierMap.get(carrier)
    return airUnitsArray.filter((airUnit) => {
      return this.getAirUnitLocation(airUnit.name).boxName != GlobalUnitsModel.AirBox.OFFBOARD
    })
  }

  getUSAirUnitsDeployed(carrier) {
    const airUnitsArray = this.usCarrierMap.get(carrier)
    return airUnitsArray.filter((airUnit) => {
      return this.getAirUnitLocation(airUnit.name).boxName != GlobalUnitsModel.AirBox.OFFBOARD
    })
  }

  getNumberOfZonesInBox(boxName) {
    const box = this.boxMap.get(boxName)
    if (!box) {
      return null
    }
    return box.length
  }

  getBoxNamesForJapaneseCarrier(carrier, includeReturnBoxes) {
    return includeReturnBoxes
      ? JapanAirBoxOffsets.filter((b) => b.carriers.includes(carrier)).map((bn) => bn.name)
      : JapanAirBoxOffsets.filter((b) => b.carriers.includes(carrier))
          .map((bn) => bn.name)
          .filter((n) => !n.includes("RETURN"))
  }

  getBoxNamesForUSCarrier(carrier, includeReturnBoxes) {
    return includeReturnBoxes
      ? USAirBoxOffsets.filter((b) => b.carriers.includes(carrier)).map((bn) => bn.name)
      : USAirBoxOffsets.filter((b) => b.carriers.includes(carrier))
          .map((bn) => bn.name)
          .filter((n) => !n.includes("RETURN"))
  }
}
