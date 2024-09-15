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
  GlobalGameState.taskForceTarget = actualTarget

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

export function getAirUnitOnFlightDeck(controller, carrier, bowOrStern) {
  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US

  const box = controller.getAirBoxForNamedShip(sideBeingAttacked, carrier, "FLIGHT")
  const index = bowOrStern === "BOW" ? 0 : 1
  const airUnits = controller.getAirUnitInBox(box, index)
  return airUnits
}

export function doCarrierDamageRolls(controller, testRolls) {
  const hits = GlobalGameState.carrierAttackHits
  const carrier = GlobalGameState.currentCarrierAttackTarget
  let rolls = testRolls === undefined ? randomDice(hits) : testRolls

  for (let roll of rolls) {
    if (controller.getCarrierBowDamaged(carrier)) {
      if (controller.getCarrierSternDamaged(carrier)) {
        controller.setCarrierHits(carrier, 3) // sunk
      } else {
        controller.setCarrierSternDamaged(carrier)
        const airUnit = getAirUnitOnFlightDeck(controller, carrier, "STERN")
        if (airUnit) {
          moveAirUnitToEliminatedBox(controller, airUnit)
        }
        controller.setCarrierHits(carrier, 2)
      }
      continue
    } else if (controller.getCarrierSternDamaged(carrier)) {
      if (controller.getCarrierBowDamaged(carrier)) {
        controller.setCarrierHits(carrier, 3) // sunk
      } else {
        controller.setCarrierBowDamaged(carrier)
        const airUnit = getAirUnitOnFlightDeck(controller, carrier, "BOW")
        if (airUnit) {
          moveAirUnitToEliminatedBox(controller, airUnit)
        }
        controller.setCarrierHits(carrier, 2)
      }
      continue
    }

    // Undamaged Carrier
    if (roll < 4) {
      controller.setCarrierBowDamaged(carrier)
      const airUnit = getAirUnitOnFlightDeck(controller, carrier, "BOW")
      if (airUnit) {
        moveAirUnitToEliminatedBox(controller, airUnit)
      }      
      controller.setCarrierHits(carrier, 1)
    } else {
      controller.setCarrierSternDamaged(carrier)
      const airUnit = getAirUnitOnFlightDeck(controller, carrier, "STERN")
      if (airUnit) {
        moveAirUnitToEliminatedBox(controller, airUnit)
      }      
      controller.setCarrierHits(carrier, 1)
    }
  }
}
export function doAttackFireRolls(controller, testRolls) {
  // For number of hits:
  // 3. Determine if joint attack, dive and torpedoBombers (set torpedo DRM if so)
  // 4. Calc DRM(s) from 3) and 4)
  // 5. Iterate over attackers, determine if any hits, if so add to total
  // 6. Return number of hits

  let dbDRM = 0
  let torpDRM = 0
  // 1. Get the attacking aircraft from the controller
  const attackers = controller.getStrikeUnitsAttackingCarrier()
  const numSteps = getNumStepsInStrikeUnits(attackers)

  let rolls = testRolls === undefined ? randomDice(numSteps) : testRolls

  if (rolls.length != numSteps) {
    throw Error("Wrong number of die rolls:", rolls.length, "(num steps=", numSteps, ")")
  }
  // 2. Determine if any attack aircraft on deck (set dive bomber DRM if so)\
  const attackAircraftOnDeck = controller.attackAircraftOnDeck()
  if (attackAircraftOnDeck) {
    dbDRM = 1
  }
  const combinedAttack = controller.combinedAttack()
  if (combinedAttack) {
    torpDRM = 1
  }

  for (let unit of attackers) {
    unit.aircraftUnit.hitsScored = 0
  }

  let index = 0
  let hits = 0
  for (let unit of attackers) {
    for (let i = 0; i < unit.aircraftUnit.steps; i++) {
      const type = unit.aircraftUnit.diveBomber ? "Dive Bomber" : "Torpedo Bomber"
      let drm = torpDRM
      if (unit.aircraftUnit.diveBomber) drm = dbDRM

      const attackFactor = unit.aircraftUnit.strength + drm

      // console.log(
      //   unit.name,
      //   "Type: ",
      //   type,
      //   "DRM:",
      //   drm,
      //   "Attack Strength:",
      //   unit.aircraftUnit.strength,
      //   "ROLL: ",
      //   rolls[index],
      //   "HIT=",
      //   rolls[index] <= attackFactor
      // )
      if (rolls[index] <= attackFactor) {
        hits++
        unit.aircraftUnit.hitsScored++
      }
      index++
    }
  }
  GlobalGameState.carrierAttackHits = hits
  return hits
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
  if (GlobalGameState.taskForceTarget === undefined) {
    return []
  }

  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US

  const fleetBeingAttacked = controller.getFleetForTaskForce(GlobalGameState.taskForceTarget, sideBeingAttacked)

  let location
  if (fleetBeingAttacked === "MIDWAY") {
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

function getNumStepsInStrikeUnits(units) {
  let steps = 0

  for (let unit of units) {
    steps += unit.aircraftUnit.steps
  }
  return steps
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

function moveAirUnitToEliminatedBox(controller, airUnit) {
  const toBox =
    airUnit.side === GlobalUnitsModel.Side.JAPAN
      ? GlobalUnitsModel.AirBox.JP_ELIMINATED
      : GlobalUnitsModel.AirBox.US_ELIMINATED

  controller.viewEventHandler({
    type: Controller.EventTypes.AIR_UNIT_MOVE,
    data: {
      name: toBox,
      counterData: airUnit,
      index: -1,
      side: GlobalGameState.sideWithInitiative,
      loading: false,
    },
  })
}
export function doDamageAllocation(controller, airUnit) {
  if (airUnit.aircraftUnit.steps === 2) {
    airUnit.aircraftUnit.steps = 1
    const newImage = airUnit.image.replace("front", "back")
    airUnit.image = newImage
  } else if (airUnit.aircraftUnit.steps === 1) {
    // air unit is eliminated
    airUnit.aircraftUnit.steps = 0

    moveAirUnitToEliminatedBox(controller, airUnit)
  }
}
