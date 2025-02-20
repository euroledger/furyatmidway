import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import GlobalGameState from "../../model/GlobalGameState"

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

export async function allocateCAPDamageToAttackingStrikeUnit(strikeUnits) {
  let originalUnits = JSON.parse(JSON.stringify(strikeUnits));

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
      return b.aircraftUnit.strength - b.aircraftUnit.strength
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
