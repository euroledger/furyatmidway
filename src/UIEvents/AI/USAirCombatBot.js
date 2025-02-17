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
