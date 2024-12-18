import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import midwayAttackDecisionAction from "../../../UIEvents/AI/MidwayAttackDeclarationBot"

class JapanHumanMidwayDeclarationState {
  midwayPossible(setMidwayWarningShow, setMidwayDialogShow) {
    // if there are no attack planes on deck cannot attack Midway
    // otherwise display the attack declaration dialog
    const attackUnitsOnDeck = GlobalInit.controller.getAllUnitsOnJapaneseFlightDecks(false)
    if (attackUnitsOnDeck.length === 0) {
      GlobalGameState.midwayAttackDeclaration = false
      setMidwayWarningShow(true)
    } else {
      console.log("DISASTER!!!!!!!!!!!!!!!")
      setMidwayDialogShow(true)
    }
  }
  async doAction(stateObject) {
    const { setMidwayWarningShow, setMidwayDialogShow} = stateObject
    console.log("DO (HUMAN) MIDWAY DECLARATION ACTION")
    this.midwayPossible(setMidwayWarningShow, setMidwayDialogShow)
  }

  async nextState(stateObject) {
    console.log("NEXT STATE AFTER human MIDWAY....")
    GlobalGameState.gamePhase = GlobalGameState.PHASE.US_FLEET_MOVEMENT_PLANNING
  }

  getState() {
    return GlobalGameState.PHASE.JAPAN_MIDWAY
  }
}

export default JapanHumanMidwayDeclarationState
