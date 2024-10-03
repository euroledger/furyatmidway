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
export function doMidwayDamage(controller, testRoll) {
  if (GlobalGameState.totalMidwayHits >= 3) {
    return -1
  }
  if (GlobalGameState.totalMidwayHits < 2) {
    return doMidwayDamageRoll(controller, testRoll) 
  } else if (GlobalGameState.totalMidwayHits === 2) {
    return autoAllocateMidwayDamage(controller)
  }
}

function moveMidwayAirUnitsToEliminated(controller, index, eliminateHangar) {
  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US
  const boxName = controller.getAirBoxForNamedShip(sideBeingAttacked, GlobalUnitsModel.Carrier.MIDWAY, "FLIGHT_DECK")
  const airUnit = controller.getAirUnitInBox(boxName, index)

  if (airUnit) {
    moveAirUnitToEliminatedBox(controller, airUnit)
    GlobalGameState.eliminatedAirUnits.push(airUnit)
  }
  if (eliminateHangar) {
    const airUnits = getAirUnitsInHangar(controller, GlobalUnitsModel.Carrier.MIDWAY)
    for (let unit of airUnits) {
      moveAirUnitToEliminatedBox(controller, unit)
      GlobalGameState.eliminatedAirUnits.push(unit)
    }
  }
}

export function doMidwayDamageRoll(controller, testRoll) {
  // if 0 or 1 hit so far on Midway base, roll to determine which box is hit next
  let roll = testRoll === undefined ? randomDice(1) : testRoll

  let box = -1
  let damage = {
    box0: false,
    box1: false, 
    box2: false, 
    destroyed: false 
  }
  GlobalGameState.carrierDamageRoll = roll
  if (GlobalGameState.totalMidwayHits === 0) {
    // roll die: 1-2 box0, 3-4 box1, 5-6 box2
    if (roll == 1 || roll == 2) {
      GlobalGameState.midwayBox0Damaged = true
      box = 0
      damage.box0 = true
    }
    if (roll == 3 || roll == 4) {
      GlobalGameState.midwayBox1Damaged = true
      box = 1
      damage.box1 = true
    }
    if (roll == 5 || roll == 6) {
      GlobalGameState.midwayBox2Damaged = true
      box = 2
      damage.box2 = true

    }
  } else if (GlobalGameState.totalMidwayHits === 1) {
    if (GlobalGameState.midwayBox0Damaged === true) {
      // roll die: 1-3 box1, 4-6 box2
      if (roll <= 3) {
        GlobalGameState.midwayBox1Damaged = true
        box = 1
        damage.box1 = true

      }
      if (roll > 3) {
        GlobalGameState.midwayBox2Damaged = true
        box = 2
        damage.box2 = true

      }
    } else if (GlobalGameState.midwayBox1Damaged === true) {
      // roll die: 1-3 box0, 4-6 box2
      if (roll <= 3) {
        GlobalGameState.midwayBox0Damaged = true
        box = 0
        damage.box0 = true

      }
      if (roll > 3) {
        GlobalGameState.midwayBox2Damaged = true
        box = 2
        damage.box2= true

      }
    } else if (GlobalGameState.midwayBox2Damaged === true) {
      // roll die: 1-3 box0, 4-6 box1
      if (roll <= 3) {
        GlobalGameState.midwayBox0Damaged = true
        box = 0
        damage.box0 = true

      }
      if (roll > 3) {
        GlobalGameState.midwayBox1Damaged = true
        box = 1
        damage.box1 = true

      }
    }
  }
  GlobalGameState.damageThisAttack = damage

  GlobalGameState.totalMidwayHits++
  GlobalGameState.midwayHits--
  GlobalGameState.midwayGarrisonLevel--
  GlobalGameState.damageThisAttack = damage
  doCarrierDamageEvent(GlobalInit.controller)

  moveMidwayAirUnitsToEliminated(controller, box)
  return box
}

export function autoAllocateMidwayDamage(controller) {
  GlobalGameState.SearchValue.US_MIDWAY = 0 // base destroyed

  let box = -1
  let damage = {
    box0: false,
    box1: false, 
    box2: false, 
    destroyed: false 
  }
  if (GlobalGameState.midwayBox0Damaged === false) {
    GlobalGameState.midwayBox0Damaged = true
    box = 0
    damage.box0 = true
    moveMidwayAirUnitsToEliminated(controller, box, true)
    GlobalGameState.midwayGarrisonLevel--
    GlobalGameState.totalMidwayHits++
  }
  if (GlobalGameState.midwayBox1Damaged === false) {
    GlobalGameState.midwayBox1Damaged = true
    box = 1
    damage.box1 = true
    moveMidwayAirUnitsToEliminated(controller, box, true)
    GlobalGameState.midwayGarrisonLevel--
    GlobalGameState.totalMidwayHits++
  }
  if (GlobalGameState.midwayBox2Damaged === false) {
    GlobalGameState.midwayBox2Damaged = true
    box = 2
    damage.box2 = true
    moveMidwayAirUnitsToEliminated(controller, box, true)
    GlobalGameState.midwayGarrisonLevel--
    GlobalGameState.totalMidwayHits++
  }if (GlobalGameState.totalMidwayHits >= 3) {
    damage.destroyed = true
    damage.box0 = false
    damage.box1= false
    damage.box2 = false
  }
  GlobalGameState.damageThisAttack = damage
  if (GlobalGameState.midwayHits > 0) {
    doCarrierDamageEvent(GlobalInit.controller)
    GlobalGameState.midwayHits = 0
  }

  return damage
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
  if (hits === 0) return damage

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
    GlobalGameState.damageThisAttack = damage
  }
  return damage
}

export function doCarrierDamageRolls(controller, testRoll) {
  // this just holds damage allocated in this attack
  let damage = {
    bow: false,
    stern: false,
    sunk: false,
  }
  const carrier = GlobalGameState.currentCarrierAttackTarget
  let roll = testRoll === undefined ? randomDice(1) : testRoll

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
  GlobalGameState.carrierDamageRoll = roll
  GlobalGameState.damageThisAttack = damage

  // }
  return damage
}
export function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function allMidwayBoxesDamaged(controller, setDamageMarkerUpdate) {
  await delay(1)
  await sendMidwayDamageUpdates(controller, 0, setDamageMarkerUpdate)
  await delay(1)
  await sendMidwayDamageUpdates(controller, 1, setDamageMarkerUpdate)
  await delay(1)
  await sendMidwayDamageUpdates(controller, 2, setDamageMarkerUpdate)
}
export async function sendMidwayDamageUpdates(controller, box, setDamageMarkerUpdate) {
  const boxName = controller.getAirBoxForNamedShip(
    GlobalUnitsModel.Side.US,
    GlobalUnitsModel.Carrier.MIDWAY,
    "FLIGHT_DECK"
  )

  let marker = GlobalInit.controller.getNextAvailableMarker("DAMAGED")
  GlobalGameState.nextAvailableDamageMarker++

  const markerUpdate = {
    name: marker.name,
    box: boxName,
    index: box,
    side: GlobalUnitsModel.Side.US,
  }
  setDamageMarkerUpdate(markerUpdate)
  controller.setMarkerLocation(marker.name, boxName, box)
}

export async function sendDamageUpdates(controller, damage, setDamageMarkerUpdate) {
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
    GlobalGameState.nextAvailableSunkMarker++
    // do update 1
    let markerUpdate = {
      name: marker1.name,
      box: boxName,
      index: 0,
      side: sideBeingAttacked,
    }
    setDamageMarkerUpdate(markerUpdate)
    controller.setMarkerLocation(marker1.name, boxName, 0)

    const marker2 = GlobalInit.controller.getNextAvailableMarker("SUNK")

    await delay(1)

    markerUpdate = {
      name: marker2.name,
      box: boxName,
      index: 1,
      side: sideBeingAttacked,
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
        side: sideBeingAttacked,
      }
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
        side: sideBeingAttacked,
      }
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
  // 2. Determine if any attack aircraft on deck (set dive bomber DRM if so)
  // For Midway all Japanese planes get a -1 DRM

  if (GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.Carrier.MIDWAY) {
    dbDRM = -1
    torpDRM = -1
  } else {
    const attackAircraftOnDeck = controller.attackAircraftOnDeck()
    if (attackAircraftOnDeck) {
      dbDRM = 1
    }
    const combinedAttack = controller.combinedAttack()
    if (combinedAttack) {
      torpDRM = 1
    }
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

  if (GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.Carrier.MIDWAY) {
    GlobalGameState.midwayHits = hits
    GlobalGameState.midwayHitsThisAttack = hits

    // QUACK REMOVE TEESTING ONLY
    GlobalGameState.dieRolls = rolls
    doAttackResolutionEvent(controller, hits)

    // GlobalGameState.midwayHits = 2
    // GlobalGameState.midwayHitsThisAttack = 2

  } else {
    GlobalGameState.carrierAttackHits = hits
    GlobalGameState.carrierAttackHitsThisAttack = hits

    // QUACK REMOVE TEESTING ONLY
    // GlobalGameState.carrierAttackHits = 1
  }
  return hits
}

export function doAAAFireRolls(numDice, testRolls) {
  let rolls = testRolls === undefined ? randomDice(numDice) : testRolls

  let hits = 0
  for (const roll of rolls) {
    if (roll === 1) {
      hits++
    }
  }
  GlobalGameState.dieRolls = 1
  GlobalGameState.antiaircraftHits = hits

  // QUACK TESTING TAKE THIS OUT
  // GlobalGameState.antiaircraftHits = 2
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
  controller.viewEventHandler({
    type: Controller.EventTypes.CAP_INTERCEPTION_ROLL,
    data: {
      rolls: GlobalGameState.dieRolls,
      side: sideBeingAttacked,
    },
  })
}

export function doAttackSelectionEvent(controller) {
  // log should be:

  // SELECT CARRIER TARGETS (US) - Akagi: TBD1 (Enterprise), Kaga: US TBD1 (Hornet)
  const carrier1Attackers = controller.getStrikeUnitsAttackingNamedCarrier(GlobalGameState.carrierTarget1)
  const carrier2Attackers = controller.getStrikeUnitsAttackingNamedCarrier(GlobalGameState.carrierTarget2)

  controller.viewEventHandler({
    type: Controller.EventTypes.CARRIER_TARGET_SELECTION,
    data: {
      side: GlobalGameState.sideWithInitiative,
      carrier1: GlobalGameState.carrierTarget1,
      carrier1Attackers,
      carrier2: GlobalGameState.carrierTarget2,
      carrier2Attackers,
    },
  })
}

export function doAttackResolutionEvent(controller, hits) {
  controller.viewEventHandler({
    type: Controller.EventTypes.ATTACK_RESOLUTION_ROLL,
    data: {
      target: GlobalGameState.currentCarrierAttackTarget,
      rolls: GlobalGameState.dieRolls,
      side: GlobalGameState.sideWithInitiative,
      hits,
    },
  })
}

export function doCarrierDamageEvent(controller) {

  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US
  if (GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.Carrier.MIDWAY) {

    if (GlobalGameState.midwayHitsThisAttack === 0) {
      return
    }
    controller.viewEventHandler({
      type: Controller.EventTypes.MIDWAY_DAMAGE,
      data: {
        target: GlobalGameState.currentCarrierAttackTarget,
        side: sideBeingAttacked,
        roll: GlobalGameState.carrierDamageRoll,
        damage: GlobalGameState.damageThisAttack,
      },
    })   

    controller.viewEventHandler({
      type: Controller.EventTypes.MIDWAY_GARRISON,
      data: {
        track: "Midway Garrison",
        level: GlobalGameState.midwayGarrisonLevel
      },
    })   
  } else {
    if (GlobalGameState.carrierAttackHitsThisAttack === 0) {
      return
    }
    controller.viewEventHandler({
      type: Controller.EventTypes.CARRIER_DAMAGE,
      data: {
        target: GlobalGameState.currentCarrierAttackTarget,
        side: sideBeingAttacked,
        roll: GlobalGameState.carrierDamageRoll,
        damage: GlobalGameState.damageThisAttack,
      },
    })
  }
}

export function doAAAEvent(controller) {
  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US

  controller.viewEventHandler({
    type: Controller.EventTypes.AAA_ROLL,
    data: {
      target: GlobalGameState.taskForceTarget,
      rolls: GlobalGameState.dieRolls,
      side: sideBeingAttacked,
    },
  })
}

export function doDamageEvent(controller, eliminatedSteps) {
  if (eliminatedSteps === 0) {
    return
  }
  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US

  let side = GlobalGameState.sideWithInitiative
  if (GlobalGameState.gamePhase === GlobalGameState.PHASE.ESCORT_DAMAGE_ALLOCATION) {
    side = sideBeingAttacked
  }
  controller.viewEventHandler({
    type: Controller.EventTypes.ALLOCATE_DAMAGE,
    data: {
      side,
      eliminatedSteps,
    },
  })
}

export function doEscortEvent(controller) {
  controller.viewEventHandler({
    type: Controller.EventTypes.ESCORT_ATTACK_ROLL,
    data: {
      rolls: GlobalGameState.dieRolls,
      side: GlobalGameState.sideWithInitiative,
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
  GlobalGameState.dieRolls = rolls

  // QUACK TESTING PUT THIS BACK
  // GlobalGameState.capHits = 4

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
