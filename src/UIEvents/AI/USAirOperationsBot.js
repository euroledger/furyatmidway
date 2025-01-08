import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import GlobalGameState from "../../model/GlobalGameState"
import GlobalInit from "../../model/GlobalInit"
import Controller from "../../controller/Controller"
import { distanceBetweenHexes } from "../../components/HexUtils"
import { setValidDestinationBoxes } from "../../controller/AirOperationsHandler"

export function selectUSDefendingCAPUnits(controller, stateObject) {
  const { setCapAirUnits, setFightersPresent, setCapSteps } = stateObject

  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US

  const capBox = controller.getCAPBoxForTaskForce(GlobalGameState.taskForceTarget, sideBeingAttacked)

  const capUnits = controller.getAllAirUnitsInBox(capBox)

  // AI DECISION, which CAP Units to choose
  const attackers = controller.getAttackingStrikeUnits(false)

  // Factors to take into account:
  // 1. Is this Midway
  // 2. Damage to our carrier
  // 3. Size of incoming strike
  // 4. Any fighters in this strike (makes CAP more effective)
  // 5. Random factor
  const selectedCapUnits = capUnits

  // @TODO non Midway logic
  if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIDWAY) {
    setCapAirUnits(() => capUnits)
  }

  let steps = 0
  for (let unit of selectedCapUnits) {
    steps += unit.aircraftUnit.steps
    unit.aircraftUnit.intercepting = true
  }
  setCapAirUnits(() => selectedCapUnits)
  setCapSteps(() => steps)

  const fighters = controller.anyFightersInStrike(GlobalGameState.taskForceTarget, sideBeingAttacked)

  setFightersPresent(() => fighters)

  // console.log("CAP Selection - air Units =", selectedCapUnits)
  // console.log("CAP Selection - number of Steps =", steps)
  // console.log("CAP Selection - fighters present =", fighters)
  return { steps, selectedCapUnits, fighters }
}

function getFleetDistances(controller) {
  const locationCSF = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)

  const location1AF = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
  const locationIJNDMCV = controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.US)
  const locationMIF = controller.getFleetLocation("MIF", GlobalUnitsModel.Side.US)

  let distanceBetweenCSFandIJNDMCV = -1
  let distanceBetweenCSFandMIF = -1
  let distanceBetweenMidwayandIJNDMCV = -1
  let distanceBetweenMidwayandMIF = -1

  const distanceBetweenCSFand1AF = distanceBetweenHexes(locationCSF.currentHex, location1AF.currentHex)
  const distanceBetweenMidwayand1AF = distanceBetweenHexes(Controller.MIDWAY_HEX.currentHex, location1AF.currentHex)

  if (locationIJNDMCV !== undefined && locationIJNDMCV.currentHex !== undefined) {
    distanceBetweenCSFandIJNDMCV = distanceBetweenHexes(locationCSF.currentHex, locationIJNDMCV.currentHex)
    distanceBetweenMidwayandIJNDMCV = distanceBetweenHexes(Controller.MIDWAY_HEX.currentHex, locationIJNDMCV.currentHex)
  }
  if (locationMIF !== undefined && locationMIF.currentHex !== undefined) {
    distanceBetweenCSFandMIF = distanceBetweenHexes(locationCSF.currentHex, locationMIF.currentHex)
    distanceBetweenMidwayandMIF = distanceBetweenHexes(Controller.MIDWAY_HEX.currentHex, locationMIF.currentHex)
  }
  return {
    distanceBetweenCSFand1AF,
    distanceBetweenCSFandMIF,
    distanceBetweenCSFandIJNDMCV,
    distanceBetweenMidwayandIJNDMCV,
    distanceBetweenMidwayandMIF,
  }
}
export function generateUSAirOperationsMoves(controller) {
  // for each air unit that we wish to move generate an array of destination boxes
  // (21 element vector, one for each air unit (3 x 5 carrier air units, 6 for Midway do not include B17))

  // Need to take into account:
  // - Overall Game Strategy
  // - Turn,
  // - State of Two Fleets/Remaining Air Power
  // - Distance Between Fleets or Enemy Fleet(s) and Midway
  // - Existence of MIF/DMCV Fleets
  // - Remaining Air Ops

  const turn = GlobalGameState.gameTurn
  const remainingJapanAirOps = GlobalGameState.airOperationPoints.japan
  const remainingUSAirOps = GlobalGameState.airOperationPoints.us
  const usNavalStrength = controller.getFleetStrength(GlobalUnitsModel.Side.US)
  const japanNavalStrength = controller.getFleetStrength(GlobalUnitsModel.Side.JAPAN)
  const usAirStrength = controller.getAirStrength(GlobalUnitsModel.Side.US)
  const japanAirStrength = controller.getAirStrength(GlobalUnitsModel.Side.JAPAN)

  // 1. Get all air units on Flight Deck (non-fighters first then fighters as order affects SG formation)

  // 2. For each unit:
  // 2a. Get valid destinations for units on Flight Deck
  const {
    distanceBetweenCSFand1AF,
    distanceBetweenCSFandMIF,
    distanceBetweenCSFandIJNDMCV,
    distanceBetweenMidwayandIJNDMCV,
    distanceBetweenMidwayandMIF,
  } = getFleetDistances(controller)

  if (distanceBetweenCSFand1AF <= 5 || distanceBetweenCSFandIJNDMCV < 5 || distanceBetweenCSFandMIF < 5) {
    const usAirUnitsOnFlightDecks = controller.getAllUnitsOnUSFlightDecks(false)

    for (let unit of usAirUnitsOnFlightDecks) {
      setValidDestinationBoxes(controller, unit.name, GlobalUnitsModel.Side.US)

      const destinations = controller.getValidAirUnitDestinations(unit.name)
    }
    // if not last air op and distance >3 (could move out of range)
    // => 3. Move Unit from Flight Deck to Strike Boxes, or
    // 4. Move Unit from Flight Deck to CAP Boxes

    // 5a. Get all air units in Hangar
    // 5b. Get valid destinations for units in Hangar
    // 5c. Move Units from Hangar to Flight Deck

    // 6a. Get all air units in Return Boxes
    // 6b. Get valid destinations for units in Return Boxes
    // 6c. Move Units in Return Boxes to next Return Box or Hangar

    // const airUnitsOnFlightDeck =
  }
}
