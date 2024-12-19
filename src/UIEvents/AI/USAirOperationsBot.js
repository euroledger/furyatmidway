import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import GlobalGameState from "../../model/GlobalGameState"
import GlobalInit from "../../model/GlobalInit"
import Controller from "../../controller/Controller"
import { distanceBetweenHexes } from "../../components/HexUtils"

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

export function generateUSAirOperationsMoves() {
  // for each air unit that we wish to move generate an array of destination boxes
  // (21 element vector, one for each air unit (3 x 5 carrier air units, 6 for Midway do not include B17))

  // Need to take into account:
  // - Overall Game Strategy
  // - Turn,
  // - State of Two Fleets/Remaining Air Power
  // - Distance Between Fleets or Enemy Fleet(s) and Midway
  // - Existence of MIF/DMCV Fleets
  // - Remaining Air Ops

  const locationCSF = GlobalInit.controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
  const location1AF = GlobalInit.controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)

  const turn = GlobalGameState.gameTurn
  const remainingJapanAirOps = GlobalGameState.airOperationPoints.japan
  const remainingUSAirOps = GlobalGameState.airOperationPoints.us

  const distanceBetweenCSFand1AF = distanceBetweenHexes(locationCSF.currentHex, location1AF.currentHex)
  const distanceBetweenMidwayand1AF = distanceBetweenHexes(Controller.MIDWAY_HEX.currentHex, location1AF.currentHex)
 
  const usNavalStrength = GlobalInit.controller.getFleetStrength(GlobalUnitsModel.Side.US)
  const japanNavalStrength = GlobalInit.controller.getFleetStrength(GlobalUnitsModel.Side.JAPAN)
  const usAirStrength = GlobalInit.controller.getAirStrength(GlobalUnitsModel.Side.US)
  const japanAirStrength = GlobalInit.controller.getAirStrength(GlobalUnitsModel.Side.JAPAN)


  

  // if not last air op and distance >3 (could move out of range)
    // => 1. Move Units from Flight Deck to Strike Boxes

  // 2. Move Units from Flight Deck to CAP Boxes

  // 2. Move Units from Hangar to Flight Deck

  // 3. Move Units in Return Boxes to next Return Box or Hangar

  // const airUnitsOnFlightDeck =
}
