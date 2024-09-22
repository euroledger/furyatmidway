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

export function getAirUnitsInHangar(controller, carrier) {
  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US

  const box = controller.getAirBoxForNamedShip(sideBeingAttacked, carrier, "HANGAR")
  const airUnits = controller.getAllAirUnitsInBox(box)
  return airUnits
}

export function carrierDamageRollNeeded(controller) {
  const hits = GlobalGameState.carrierAttackHits
  const carrier = GlobalGameState.currentCarrierAttackTarget

  if (hits === 0) return false

  if (controller.getCarrierBowDamaged(carrier) || controller.getCarrierSternDamaged(carrier)) {
    return false
  }
  return true
}

export function sendMarkerEvent(controller, sunkdamaged, side, carrier, bowstern) {
  if (sunkdamaged === "DAMAGED") {
    if (bowstern === "BOW") {
      controller.viewEventHandler({
        type: Controller.EventTypes.SET_DAMAGE_BOW_MARKER,
        data: {
          side,
          carrier,
        },
      })
    } else {
      controller.viewEventHandler({
        type: Controller.EventTypes.SET_DAMAGE_STERN_MARKER,
        data: {
          side,
          carrier,
        },
      })
    }
  } else {
    controller.viewEventHandler({
      type: Controller.EventTypes.SET_SUNK_MARKER,
      data: {
        side,
        carrier,
      },
    })
  }
}

export function autoAllocateDamage(controller) {
  const hits = GlobalGameState.carrierAttackHits
  const carrier = GlobalGameState.currentCarrierAttackTarget

  // this just holds damage allocated in this attack
  let damage = {
    bow: false,
    stern: false,
    sunk: false,
  }
  if (hits === 0) return null

  const currentCarrierHits = controller.getCarrierHits(carrier)
  if (hits >= 2) {
    controller.setCarrierBowDamaged(carrier)
    damage.bow = true
    let airUnit = getAirUnitOnFlightDeck(controller, carrier, "BOW")
    if (airUnit) {
      moveAirUnitToEliminatedBox(controller, airUnit)
      GlobalGameState.eliminatedAirUnits.push(airUnit)
    }
    controller.setCarrierSternDamaged(carrier)
    damage.stern = true
    airUnit = getAirUnitOnFlightDeck(controller, carrier, "STERN")
    if (airUnit) {
      moveAirUnitToEliminatedBox(controller, airUnit)
      GlobalGameState.eliminatedAirUnits.push(airUnit)
    }
    if (hits >= 3) {
      damage.sunk = true
      const airUnits = getAirUnitsInHangar(controller, carrier)
      for (let unit of airUnits) {
        moveAirUnitToEliminatedBox(controller, unit)
        GlobalGameState.eliminatedAirUnits.push(unit)
      }
    }
    controller.setCarrierHits(carrier, Math.min(3, currentCarrierHits + hits))
  }
  return damage
}

export function doCarrierDamageRolls(controller, testRolls) {
  // this just holds damage allocated in this attack
  let damage = {
    bow: false,
    stern: false,
    sunk: false,
  }
  const carrier = GlobalGameState.currentCarrierAttackTarget
  let rolls = testRolls === undefined ? randomDice(1) : testRolls

  for (let roll of rolls) {
    if (controller.getCarrierBowDamaged(carrier)) {
      if (controller.getCarrierSternDamaged(carrier)) {
        controller.setCarrierHits(carrier, 3) // sunk
        damage.sunk = true
        const airUnits = getAirUnitsInHangar(controller, carrier)
        for (let unit of airUnits) {
          moveAirUnitToEliminatedBox(controller, unit)
          GlobalGameState.eliminatedAirUnits.push(unit)
        }
      } else {
        controller.setCarrierSternDamaged(carrier)
        damage.stern = true
        const airUnit = getAirUnitOnFlightDeck(controller, carrier, "STERN")
        if (airUnit) {
          moveAirUnitToEliminatedBox(controller, airUnit)
          GlobalGameState.eliminatedAirUnits.push(airUnit)
        }
        controller.setCarrierHits(carrier, 2)
      }
      continue
    } else if (controller.getCarrierSternDamaged(carrier)) {
      if (controller.getCarrierBowDamaged(carrier)) {
        controller.setCarrierHits(carrier, 3) // sunk
        damage.sunk = true
        const airUnits = getAirUnitsInHangar(controller, carrier)
        for (let unit of airUnits) {
          moveAirUnitToEliminatedBox(controller, unit)
          GlobalGameState.eliminatedAirUnits.push(unit)
        }
      } else {
        controller.setCarrierBowDamaged(carrier)
        damage.bow = true
        const airUnit = getAirUnitOnFlightDeck(controller, carrier, "BOW")
        if (airUnit) {
          moveAirUnitToEliminatedBox(controller, airUnit)
          GlobalGameState.eliminatedAirUnits.push(airUnit)
        }
        controller.setCarrierHits(carrier, 2)
      }
      continue
    }

    // Undamaged Carrier
    if (roll < 4) {
      damage.bow = true

      controller.setCarrierBowDamaged(carrier)
      const airUnit = getAirUnitOnFlightDeck(controller, carrier, "BOW")
      if (airUnit) {
        moveAirUnitToEliminatedBox(controller, airUnit)
        GlobalGameState.eliminatedAirUnits.push(airUnit)
      }
      controller.setCarrierHits(carrier, 1)
    } else {
      damage.stern = true

      controller.setCarrierSternDamaged(carrier)
      const airUnit = getAirUnitOnFlightDeck(controller, carrier, "STERN")
      if (airUnit) {
        moveAirUnitToEliminatedBox(controller, airUnit)
        GlobalGameState.eliminatedAirUnits.push(airUnit)
      }
      controller.setCarrierHits(carrier, 1)
    }
  }
  return damage
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
export async function sendDamageUpdates(controller, damage, setDamageMarkerUpdate) {
  console.log("IN sendDamageUpdates()+++++++++++++++++++  ")
  // damage has two fields, bow and stern

  // if sunk
  // send two updates: bow sunk marker, stern sunk marker

  // if bow damaged
  // send bow damage update

  // if stern damaged
  // send stern damage update

  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US
  const boxName = controller.getAirBoxForNamedShip(
    sideBeingAttacked,
    GlobalGameState.currentCarrierAttackTarget,
    "FLIGHT_DECK"
  )

  if (damage.sunk) {
    const marker1 = GlobalInit.controller.getNextAvailableMarker("SUNK")

    console.log("********** SUNK marker 1 = ", marker1)
    GlobalGameState.nextAvailableSunkMarker++
    // do update 1
    let markerUpdate = {
      name: marker1.name,
      box: boxName,
      index: 0,
      side: sideBeingAttacked
    }
    setDamageMarkerUpdate(markerUpdate)
    controller.setMarkerLocation(marker1.name, boxName, 0)

    const marker2 = GlobalInit.controller.getNextAvailableMarker("SUNK")

    await delay(1)

    console.log("********** SUNK marker 2 = ", marker2)
    markerUpdate = {
      name: marker2.name,
      box: boxName,
      index: 1,
      side: sideBeingAttacked
    }
    setDamageMarkerUpdate(markerUpdate)
    GlobalGameState.nextAvailableSunkMarker++
    controller.setMarkerLocation(marker2.name, boxName, 1)
  } else {
    if (damage.bow) {
      let marker = GlobalInit.controller.getNextAvailableMarker("DAMAGED")
      GlobalGameState.nextAvailableDamageMarker++

      const markerUpdate = {
        name: marker.name,
        box: boxName,
        index: 0,
        side: sideBeingAttacked
      }
      console.log("SEND UPDATE BOW DAMAGED: ", markerUpdate)
      setDamageMarkerUpdate(markerUpdate)

      controller.setMarkerLocation(marker.name, boxName, 0)
    }

    if (damage.stern) {
      await delay(1)

      let marker = GlobalInit.controller.getNextAvailableMarker("DAMAGED")
      GlobalGameState.nextAvailableDamageMarker++

      const markerUpdate = {
        name: marker.name,
        box: boxName,
        index: 1,
        side: sideBeingAttacked
      }
      console.log("SEND UPDATE STERN DAMAGED: ", markerUpdate)

      setDamageMarkerUpdate(markerUpdate)
      controller.setMarkerLocation(marker.name, boxName, 1)
    }
  }
}

export function doAttackFireRolls(controller, testRolls) {
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
  // For number of hits:
  // 3. Determine if joint attack, dive and torpedoBombers (set torpedo DRM if so)
  // 4. Calc DRM(s) from 3) and 4)
  // 5. Iterate over attackers, determine if any hits, if so add to total
  // 6. Return number of hits
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
