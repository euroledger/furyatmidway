import { randomDice } from "./components/dialogs/DiceUtils"
import GlobalGameState from "./model/GlobalGameState"
import Controller from "./controller/Controller"
import GlobalUnitsModel from "./model/GlobalUnitsModel"
import GlobalInit from "./model/GlobalInit"

export function doIntiativeRoll(controller, roll0, roll1) {
  // for automated testing
  let sideWithInitiative
  let jpRolls, usRolls
  if (roll0 && roll1) {
    sideWithInitiative = controller.determineInitiative(roll0, roll1)
    jpRolls = [roll0]
    usRolls = [roll1]
  } else {
    const rolls = randomDice(2)
    sideWithInitiative = controller.determineInitiative(rolls[0], rolls[1])
    jpRolls = [rolls[0]]
    usRolls = [rolls[1]]
  }
  GlobalGameState.sideWithInitiative = sideWithInitiative

  controller.viewEventHandler({
    type: Controller.EventTypes.INITIATIVE_ROLL,
    data: {
      jpRolls,
      usRolls,
    },
  })
  return sideWithInitiative
}

export function doSelectionRoll(controller, roll0) {
  GlobalGameState.dieRolls = 0

  // for automated testing
  let actualTarget
  let theRoll
  if (roll0) {
    actualTarget = controller.determineTarget(roll0)
    theRoll = [roll0]
  } else {
    const rolls = randomDice(1)
    actualTarget = controller.determineTarget(rolls[0])
    theRoll = [rolls[0]]
  }
  GlobalGameState.airAttackTarget = actualTarget

  controller.viewEventHandler({
    type: Controller.EventTypes.TARGET_SELECTION_ROLL,
    data: {
      theRoll,
      target: actualTarget,
      side: GlobalGameState.sideWithInitiative,
    },
  })
}

export function doFighterCounterattack(controller, testRolls) {
  let attackers = getFightersForStrikeGroup(controller)
  let numSteps = getNumEscortFighterSteps(controller)

  let rolls = testRolls === undefined ? randomDice(numSteps) : testRolls

  let hits = 0,
    index = 0
  for (let unit of attackers) {
    for (let i = 0; i < unit.aircraftUnit.steps; i++) {
      if (rolls[index] <= unit.aircraftUnit.strength) {
        hits++
      }
      index++
    }
  }
  GlobalGameState.dieRolls = 1
  GlobalGameState.fighterHits = hits
}

export function doAAAFireRolls(testRolls) {
  let rolls = testRolls === undefined ? randomDice(2) : testRolls

  let hits = 0
  for (const roll of rolls) {
    if (roll === 1) {
      hits++
    }
  }
  GlobalGameState.dieRolls = 1
  GlobalGameState.antiaircraftHits = hits
 
}

function getFightersForStrikeGroup(controller) {
  if (GlobalGameState.airAttackTarget === undefined) {
    return []
  }

  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US


  const fleetBeingAttacked = controller.getFleetForTaskForce(GlobalGameState.airAttackTarget, sideBeingAttacked)

  let location
  if (fleetBeingAttacked==="MIDWAY") {
    location = Controller.MIDWAY_HEX
  } else {
    location = controller.getFleetLocation(fleetBeingAttacked, sideBeingAttacked)
  }

  const strikeGroups = controller.getAllStrikeGroupsInLocation(location, GlobalGameState.sideWithInitiative)

  if (!strikeGroups || strikeGroups.length === 0) {
    return []
  }
  let fighters = controller.getAllFightersInBox(strikeGroups[0].box)
  return fighters
}

export function getNumEscortFighterSteps(controller) {
  let fighters = getFightersForStrikeGroup(controller)

  let steps = 0

  for (let unit of fighters) {
    steps += unit.aircraftUnit.steps
  }
  return steps
}
export function doCAPEvent(controller, capAirUnits) {
  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US

  controller.viewEventHandler({
    type: Controller.EventTypes.SELECT_CAP_UNITS,
    data: {
      side: sideBeingAttacked,
      capUnits: capAirUnits,
    },
  })
}
export function doCAP(controller, capAirUnits, fightersPresent, testRolls) {
  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US
  const numSteps = controller.getNumDefendingSteps(sideBeingAttacked)

  let rolls = testRolls === undefined ? randomDice(numSteps) : testRolls

  const drm = fightersPresent ? 0 : 1
  // compare each roll with the steps of the defending units, and the corresponding attack factor
  let hits = 0,
    index = 0
  for (let unit of capAirUnits) {
    for (let i = 0; i < unit.aircraftUnit.steps; i++) {
      const attackFactor = unit.aircraftUnit.strength + drm
      if (rolls[index] <= attackFactor) {
        hits++
      }
      index++
    }
  }
  GlobalGameState.dieRolls = 1
  GlobalGameState.capHits = hits
}

export function doDamageAllocation(controller, airUnit) {
  if (airUnit.aircraftUnit.steps === 2) {
    airUnit.aircraftUnit.steps = 1
    const newImage = airUnit.image.replace("front", "back")
    airUnit.image = newImage
  } else if (airUnit.aircraftUnit.steps === 1) {
    // air unit is eliminated
    airUnit.aircraftUnit.steps = 0

    // move unit to eliminated box
    const location = controller.getAirUnitLocation(airUnit.name)
    const toBox =
      airUnit.side === GlobalUnitsModel.Side.JAPAN
        ? GlobalUnitsModel.AirBox.JP_ELIMINATED
        : GlobalUnitsModel.AirBox.US_ELIMINATED

    controller.viewEventHandler({
      type: Controller.EventTypes.AIR_UNIT_MOVE,
      data: {
        name: toBox,
        counterData: airUnit,
        index: location.boxIndex,
        side: GlobalGameState.sideWithInitiative,
        loading: false,
      },
    })
    controller.addAirUnitToBox(toBox, 0, airUnit)
  }
}
