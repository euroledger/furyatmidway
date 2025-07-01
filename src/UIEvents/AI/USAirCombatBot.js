import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import GlobalGameState from "../../model/GlobalGameState"
import { delay } from "../../DiceHandler"

export async function selectTFTarget(controller) {
  // Priority:
  // 1. TF with most damage (not sunk or dmcv) to carriers
  // 2. TF with least CAP
  // 3. Random

  // get damage for each CarDiv
  let { cd1Damage, cd2Damage } = controller.getDamageToCarriersByTF(GlobalUnitsModel.Side.JAPAN)

  if (cd1Damage > cd2Damage) {
    GlobalGameState.testTarget = GlobalUnitsModel.TaskForce.CARRIER_DIV_1
  } else if (cd2Damage > cd1Damage) {
    GlobalGameState.testTarget = GlobalUnitsModel.TaskForce.CARRIER_DIV_2
  } else {
    // damage is equal -> check CAP
    const { cd1, cd2 } = controller.getNumStepsInCAPBoxesByTF(GlobalUnitsModel.Side.JAPAN)
    if (cd1 > cd2) {
      GlobalGameState.testTarget = GlobalUnitsModel.TaskForce.CARRIER_DIV_2
    } else if (cd2 > cd1) {
      GlobalGameState.testTarget = GlobalUnitsModel.TaskForce.CARRIER_DIV_1
    } else {
      // Damage and CAP are equal -> decide randomly
      let oneOrZero = Math.random() >= 0.5 ? 1 : 0
      console.log("RANDOM SELECTION OF TARGET, oneOrZero=", oneOrZero)

      GlobalGameState.testTarget =
        oneOrZero === 1 ? GlobalUnitsModel.TaskForce.CARRIER_DIV_1 : GlobalUnitsModel.TaskForce.CARRIER_DIV_2
    }
  }
  GlobalGameState.updateGlobalState()
}

function is2StepFighter(unit) {
  return !unit.aircraftUnit.attack && unit.aircraftUnit.steps === 2
}

function is1StepFighter(unit) {
  return !unit.aircraftUnit.attack && unit.aircraftUnit.steps === 1
}

function is2StepTorpedoPlane(unit) {
  return unit.aircraftUnit.attack && !unit.aircraftUnit.diveBomber && unit.aircraftUnit.steps === 2
}

function is1StepTorpedoPlane(unit) {
  return unit.aircraftUnit.attack && !unit.aircraftUnit.diveBomber && unit.aircraftUnit.steps === 1
}

function is2StepDiveBomber(unit) {
  return unit.aircraftUnit.diveBomber && unit.aircraftUnit.steps === 2
}

function is1StepDiveBomber(unit) {
  return unit.aircraftUnit.diveBomber && unit.aircraftUnit.steps === 1
}

export async function allocateEscortDamageToAttackingStrikeUnit(strikeUnits) {
  let originalUnits = JSON.parse(JSON.stringify(strikeUnits))

  // sort by combat strength 
  strikeUnits = strikeUnits.sort(function (a, b) {
    return a.aircraftUnit.strength - b.aircraftUnit.strength
  })
  const index = originalUnits.findIndex((unit) => unit._name === strikeUnits[0].name)
  const unit = strikeUnits[0]
  return { unit, index }
}

export async function allocateCAPDamageToAttackingStrikeUnit(strikeUnits) {
  let originalUnits = JSON.parse(JSON.stringify(strikeUnits))

  // sort by combat strength first (for Midway planes)
  strikeUnits = strikeUnits.sort(function (a, b) {
    return a.aircraftUnit.strength - b.aircraftUnit.strength
  })

  if (strikeUnits[0].carrier === GlobalUnitsModel.Carrier.MIDWAY) {
    // for midway based strike groups sorting by fighter then strength is enough

    const sortedUnits = strikeUnits.sort(function (a, b) {
      if (is2StepFighter(a) && !is2StepFighter(b)) {
        return -1
      } else if (!is2StepFighter(a) && is2StepFighter(b)) {
        return 1
      } else if (!is1StepFighter(a) && is1StepFighter(b)) {
        return 1
      } else if (is1StepFighter(a) && !is1StepFighter(b)) {
        return -1
      }
      return a.aircraftUnit.strength - b.aircraftUnit.strength
    })

    const index = originalUnits.findIndex((unit) => unit._name === sortedUnits[0].name)
    const unit = sortedUnits[0]
    return { unit, index }
  }

  // Priorities:
  // 1. 2-step fighter units
  // 2. 1-step fighter units
  // 3. 2-step tbds
  // 4. 2-step SBDs
  // 5. 1-step tbds
  // 6. 1-step sbds

  // console.log("strikeUnits=", strikeUnits)

  const sortedUnits = strikeUnits.sort(function (a, b) {
    if (is2StepFighter(a) && !is2StepFighter(b)) {
      return -1
    } else if (!is2StepFighter(a) && is2StepFighter(b)) {
      return 1
    } else if (is1StepFighter(a) && !is1StepFighter(b)) {
      return -1
    } else if (!is1StepFighter(a) && is1StepFighter(b)) {
      return 1
    } else if (is2StepTorpedoPlane(a) && !is2StepTorpedoPlane(b)) {
      return -1
    } else if (!is2StepTorpedoPlane(a) && is2StepTorpedoPlane(b)) {
      return 1
    } else if (is2StepDiveBomber(a) && !is2StepDiveBomber(b)) {
      return -1
    } else if (!is2StepDiveBomber(a) && is2StepDiveBomber(b)) {
      return 1
    } else if (is1StepTorpedoPlane(a) && !is1StepTorpedoPlane(b)) {
      return -1
    } else if (!is1StepTorpedoPlane(a) && is1StepTorpedoPlane(b)) {
      return 1
    } else if (is1StepDiveBomber(a) && !is1StepDiveBomber(b)) {
      return -1
    } else if (!is1StepDiveBomber(a) && is1StepDiveBomber(b)) {
      return 1
    }
    return 1
  })

  const index = originalUnits.findIndex((unit) => unit._name === sortedUnits[0].name)
  const unit = sortedUnits[0]
  return { unit, index }
  // return sortedUnits[0]
}

export async function allocateAAADamageToAttackingStrikeUnit(strikeUnits) {
  let originalUnits = JSON.parse(JSON.stringify(strikeUnits))

  // sort by combat strength only (for Midway planes)

  if (strikeUnits[0].carrier === GlobalUnitsModel.Carrier.MIDWAY) {
    const sortedUnits = strikeUnits.sort(function (a, b) {
      return a.aircraftUnit.strength - b.aircraftUnit.strength
    })
    const index = originalUnits.findIndex((unit) => unit._name === sortedUnits[0].name)
    const unit = sortedUnits[0]
    return { unit, index }
  }

  // Priorities: (note no fighters)
  // 1. 2-step tbds
  // 2. 2-step SBDs
  // 3. 1-step tbds
  // 4. 1-step sbds

  const sortedUnits = strikeUnits.sort(function (a, b) {
    if (is2StepTorpedoPlane(a) && !is2StepTorpedoPlane(b)) {
      return -1
    } else if (!is2StepTorpedoPlane(a) && is2StepTorpedoPlane(b)) {
      return 1
    } else if (is2StepDiveBomber(a) && !is2StepDiveBomber(b)) {
      return -1
    } else if (!is2StepDiveBomber(a) && is2StepDiveBomber(b)) {
      return 1
    } else if (is1StepTorpedoPlane(a) && !is1StepTorpedoPlane(b)) {
      return -1
    } else if (!is1StepTorpedoPlane(a) && is1StepTorpedoPlane(b)) {
      return 1
    } else if (is1StepDiveBomber(a) && !is1StepDiveBomber(b)) {
      return -1
    } else if (!is1StepDiveBomber(a) && is1StepDiveBomber(b)) {
      return 1
    }
    return 1
  })

  const index = originalUnits.findIndex((unit) => unit._name === sortedUnits[0].name)
  const unit = sortedUnits[0]
  return { unit, index }
  // return sortedUnits[0]
}

export async function doTargetSelection(
  controller,
  strikeUnits,
  defendingSide,
  setAttackAirCounterUpdate,
  testOneOrZero
) {
  // Prioties:
  // 1. Carrier with most damage
  // 2. Carrier with attack planes on deck
  // 3. Random

  let carrierTargets = new Array()
  let index = 0
  let oneOrZero
  for (let unit of strikeUnits) {
    let attackAirCounterUpdate
    if (setAttackAirCounterUpdate) {
      await delay(300)
      GlobalGameState.testCarrierSelection = -1
      GlobalGameState.updateGlobalState()
      await delay(100)
    }

    const carriersInTF = controller.getAllNonSunkCarriersInTaskForce(GlobalGameState.taskForceTarget, defendingSide)

    let originalCarriers = JSON.parse(JSON.stringify(carriersInTF))

    // sort by damage then attack planes on deck
    let carriers = carriersInTF.sort(function (a, b) {
      if (b.hits > a.hits) {
        return b.hits - a.hits
      } else if (a.hits > b.hits) {
        return b.hits - a.hits
      } else if (
        controller.attackAircraftOnDeckForNamedCarrier(GlobalUnitsModel.Side.JAPAN, a.name) &&
        !controller.attackAircraftOnDeckForNamedCarrier(GlobalUnitsModel.Side.JAPAN, b.name)
      ) {
        return -1
      } else if (
        controller.attackAircraftOnDeckForNamedCarrier(GlobalUnitsModel.Side.JAPAN, a.name) &&
        !controller.attackAircraftOnDeckForNamedCarrier(GlobalUnitsModel.Side.JAPAN, b.name)
      ) {
        return 1
      }
      return b.hits - a.hits
    })

    // console.log(">>>>> SORTED CARRIERS=", carriers)

    if (
      testOneOrZero &&
      carriers[0].hits === 0 &&
      !controller.attackAircraftOnDeckForNamedCarrier(GlobalUnitsModel.Side.JAPAN, carriers[0].name)
    ) {
      oneOrZero = testOneOrZero[index++]
    } else {
      oneOrZero = Math.random() >= 0.5 ? 1 : 0
    }
    let carrier = carriersInTF[oneOrZero]

    if (
      carriers[0].hits > 0 ||
      controller.attackAircraftOnDeckForNamedCarrier(GlobalUnitsModel.Side.JAPAN, carriers[0].name)
    ) {
      // console.log(">>>>> SET CARRIER TARGET TO", carriers[0])

      carrier = carriers[0]
      oneOrZero = originalCarriers.findIndex((unit) => unit._name === carriersInTF[0].name)
    }
    const uuid = Date.now()
    attackAirCounterUpdate = {
      unit,
      carrier: carrier.name,
      id: oneOrZero + 1,
      side: GlobalGameState.sideWithInitiative,
      uuid,
    }
    carrierTargets.push(carrier.name)
    if (!testOneOrZero) {
      setAttackAirCounterUpdate(attackAirCounterUpdate)
      await delay(10)

      GlobalGameState.updateGlobalState()
      await delay(1000)
    }
  }
  return carrierTargets
}

export async function doCapSelection(controller) {
  // Allocate CAP Fighters...
  GlobalGameState.testCapSelection = -1

  const capBox = controller.getCAPBoxForTaskForce(GlobalGameState.taskForceTarget, GlobalUnitsModel.Side.US)
  const capUnits = controller.getAllAirUnitsInBox(capBox)

  const attackers = controller.getAttackingStrikeUnits(false)

  let copy = JSON.parse(JSON.stringify(capUnits))

  GlobalGameState.rollDice = false
  await delay(10)
  
  // Allocate one CAP unit per attacker
  for (let i = 0; i < attackers.length; i++) {
    await delay(300)

    const selection = Math.floor(Math.random() * copy.length)

    GlobalGameState.testCapSelection = selection
    GlobalGameState.updateGlobalState()

    await delay(10)
    // remove the selected air unit from available CAP units
    copy = copy.filter((element) => element.name !== copy[selection].name)
  }
  GlobalGameState.rollDice = true
  await delay(10)
  GlobalGameState.updateGlobalState()
}
