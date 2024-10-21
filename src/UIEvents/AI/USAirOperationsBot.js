import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import GlobalGameState from "../../model/GlobalGameState"

export function selectUSDefendingCAPUnits(controller, stateObject ) {
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

  console.log("CAP Selection - air Units =", selectedCapUnits)
  console.log("CAP Selection - number of Steps =", steps)
  console.log("CAP Selection - fighters present =", fighters)
  return { steps, selectedCapUnits, fighters }
}
