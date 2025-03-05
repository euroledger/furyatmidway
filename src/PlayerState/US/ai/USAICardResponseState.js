import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import { delay } from "../../../Utils"
import { setNextStateFollowingCardPlay } from "../../StateUtils"

class USAICardResponseState {
  isTorpedoPlane(unit) {
    return unit.aircraftUnit.attack && !unit.aircraftUnit.diveBomber
  }
  async doAction(stateObject) {
    const { cardNumber } = stateObject
    console.log("DO CARD RESPONSE cardNumber=", cardNumber)

    if (cardNumber === 10) {
      await delay(1000)
      const unitsInGroup = GlobalInit.controller.getAllUSCarrierPlanesInReturnBoxes()
      const selection = Math.floor(Math.random() * unitsInGroup.length)
      GlobalGameState.testStepLossSelection = selection
      GlobalGameState.updateGlobalState()
      return
    }
    if (cardNumber === 11) {
      for (let i = 0; i < 2; i++) {
        await delay(500)
        let unitsInGroup = GlobalInit.controller.getAttackingStrikeUnits()
        // select TBD as step loss if present
        let unit = unitsInGroup.find((unit) => this.isTorpedoPlane(unit))
        let selection

        if (!unit) {
          selection = Math.floor(Math.random() * unitsInGroup.length)
        } else {
          selection = unitsInGroup.findIndex((u) => u.name === unit.name)
        }
        GlobalGameState.testStepLossSelection = selection
        GlobalGameState.updateGlobalState()

        await delay(10)
        GlobalGameState.testStepLossSelection = -1
        GlobalGameState.updateGlobalState()
      }
    }
  }

  async nextState(stateObject) {
    const { setAirUnitUpdate, setStrikeGroupUpdate, setFleetUnitUpdate, setEndOfAirOpAlertShow } = stateObject

    console.log("MOVE ON FROM CARD RESPONSE...")
    await setNextStateFollowingCardPlay(stateObject)
  }

  getState() {
    return GlobalGameState.PHASE.CARD_RESPONSE
  }
}

export default USAICardResponseState
