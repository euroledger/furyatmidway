import { mapHexToIndex, distanceBetweenHexes } from "../components/HexUtils"
import { AIR_STRATEGIES } from "../UIEvents/AI/USAirUnitSetupBots"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import GlobalGameState from "../model/GlobalGameState"
import Controller from "./Controller"
import { usBoxToIndex } from "../AirUnitData"

export function airUnitLocationsAsArray(controller, side) {
  const airUnits = controller.getAllAirUnits(side)
  let unitArray = new Array()
  for (let unit of airUnits) {
    const location = controller.getAirUnitLocation(unit.name)
    const index = usBoxToIndex(location.boxName)
    unitArray.push(index)
  }
  return unitArray
}

export function getInitialGameStateAsArray(controller, strategy) {
  const locationCSF = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)

  const location1AF = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
  const locationIJNDMDCV = controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)
  const locationUSDMCV = controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.JAPAN)
  const locationMIF = controller.getFleetLocation("MIF", GlobalUnitsModel.Side.JAPAN)

  const distanceBetweenCSFand1AF = distanceBetweenHexes(locationCSF.currentHex, location1AF.currentHex)

  const distanceBetweenMidwayand1AF = distanceBetweenHexes(Controller.MIDWAY_HEX.currentHex, location1AF.currentHex)

  const distanceBetweenCSFandIJNDMCV = -1
  const distanceBetweenCSFandMIF = -1
  const distanceBetween1AFandUSDMCV = -1

  const hexIndexCSF = mapHexToIndex(locationCSF.currentHex)

  const hexIndex1AF = mapHexToIndex(location1AF.currentHex)

  const hexIndexIJNDMCV = locationIJNDMDCV !== undefined ? mapHexToIndex(locationIJNDMDCV) : -1
  const hexIndexUSDMCV = locationUSDMCV !== undefined ? mapHexToIndex(locationUSDMCV) : -1
  const hexIndexMIF = locationMIF !== undefined ? mapHexToIndex(locationIJNDMDCV) : -1

  const airStrategyBoxes = AIR_STRATEGIES[strategy]

  const remainingJapanAirOps = GlobalGameState.airOperationPoints.japan
  const remainingUSAirOps = GlobalGameState.airOperationPoints.us

  const usNavalStrength = controller.getFleetStrength(GlobalUnitsModel.Side.US)
  const japanNavalStrength = controller.getFleetStrength(GlobalUnitsModel.Side.JAPAN)
  const usAirStrength = controller.getAirStrength(GlobalUnitsModel.Side.US)
  const japanAirStrength = controller.getAirStrength(GlobalUnitsModel.Side.JAPAN)

  console.log("airStrategyBoxes=", airStrategyBoxes)

  console.log("airStrategyBoxes FLAT=", airStrategyBoxes.flat())

  return [
    GlobalGameState.gameTurn,
    strategy,
    hexIndexCSF,
    hexIndex1AF,
    hexIndexIJNDMCV,
    hexIndexUSDMCV,
    hexIndexMIF,
    distanceBetweenCSFand1AF,
    distanceBetweenMidwayand1AF,
    distanceBetweenCSFandIJNDMCV,
    distanceBetweenCSFandMIF,
    distanceBetween1AFandUSDMCV,
    airStrategyBoxes.flat(),
    usNavalStrength,
    japanNavalStrength,
    usAirStrength,
    japanAirStrength,
    remainingJapanAirOps,
    remainingUSAirOps,
  ].flat()
}
