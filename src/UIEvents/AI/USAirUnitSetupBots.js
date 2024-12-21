import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import GlobalGameState from "../../model/GlobalGameState"
import { generateRandomUSAirSetup } from "../../AirUnitData"
import { getRandomElementFrom } from "../../AirUnitData"

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

export const AIR_STRATEGIES = new Array()

export const GAME_STRATEGIES = {
  STANDARD_AGGRESSIVE: 0,
  STANDARD_DEFENSIVE: 1,
  MIXED: 2,
  ULTRA_DEFENSIVE: 3,
  ULTRA_AGGRESSIVE: 4,
}
const MIDWAY_SETUP = [8, 8, 9, 10, 9, 9]

AIR_STRATEGIES.push([
  [0, 1, 1, 2, 2],
  [0, 3, 3, 4, 4],
  [5, 5, 6, 7, 6],
  MIDWAY_SETUP
]) // standard aggressive fighter-DB strike groups

AIR_STRATEGIES.push([
  [0, 0, 1, 2, 1],
  [0, 0, 3, 4, 3],
  [5, 6, 6, 7, 7],
  MIDWAY_SETUP
]) // standard defensive all fighters in CAP

AIR_STRATEGIES.push([
  [0, 1, 1, 2, 2],
  [0, 0, 3, 4, 3],
  [5, 6, 6, 7, 7],
  MIDWAY_SETUP
]) // mixture of above two

AIR_STRATEGIES.push([
  [0, 0, 2, 2, 2],
  [0, 0, 4, 4, 4],
  [5, 5, 7, 7, 7],
  MIDWAY_SETUP
]) // ultra defensive all fighters in CAP, all attack aircraft in hangars

AIR_STRATEGIES.push([
  [1, 2, 1, 2, 2],
  [3, 4, 3, 4, 4],
  [6, 7, 6, 7, 7],
  MIDWAY_SETUP
]) // ultra aggressive no fighters in CAP, all attack aircraft either on fligth deck or hangar


const randomStrategy = generateRandomUSAirSetup()

// Q-Learning. Greedy Evaluation.
// Set epsilon to initial 0.5, choose randomly policy pi = p(1-epsilon) as either a a) strategy 1-5 or b) random setup.
// As exploration reveals rewards for each policy, add new policies and lower epsilon

// pick one of the Air strategies, return 2d array of starting air boxes

const EPSILON = 0.5
const r = Math.random()
let presetStrategy = getRandomElementFrom(AIR_STRATEGIES)

export function getAirSetupBoxes(carrier, testStrategy) {
  // if r < epsilon choose random setup
  // else choose one of the pre-set strategies

  let airStrategy
  if (!testStrategy) {
    if (r < EPSILON) {
      airStrategy = randomStrategy
    } else {
      airStrategy = presetStrategy
    }
  } else {
    airStrategy = testStrategy
  }

  switch (carrier) {
    case GlobalUnitsModel.Carrier.ENTERPRISE:
      return airStrategy[0]
    case GlobalUnitsModel.Carrier.HORNET:
      return airStrategy[1]
    case GlobalUnitsModel.Carrier.YORKTOWN:
      return airStrategy[2]
    case GlobalUnitsModel.Carrier.MIDWAY:
      return MIDWAY_SETUP
  }
}
