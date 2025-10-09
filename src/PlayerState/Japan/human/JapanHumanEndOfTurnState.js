import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import { determineMidwayInvasion } from "../../StateUtils"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"

class JapanHumanEndOfTurnState {
  markCard = (cardNumber) => {
    GlobalGameState.cardsChecked.push(cardNumber)
    if (GlobalInit.controller.usHandContainsCard(cardNumber)) {
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
    } else {
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.JAPAN
    }
  }

  cardChecked = (cardNumber) => {
    return GlobalGameState.cardsChecked.includes(cardNumber)
  }

  async doAction(stateObject) {
    const { setCardNumber, setEndOfTurnSummaryShow } = stateObject
    console.log("STATE JapanHumanEndOfTurnState WOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")

    if (GlobalGameState.gameTurn === 7) {
      determineMidwayInvasion(setCardNumber, setEndOfTurnSummaryShow)
      if (
        GlobalGameState.gamePhase === GlobalGameState.PHASE.MIDWAY_INVASION ||
        GlobalGameState.gamePhase === GlobalGameState.PHASE.CARD_PLAY
      ) {
        return
      }
    }
    if (
      !this.cardChecked(1) &&
      GlobalInit.controller.usHandContainsCard(1) &&
      GlobalInit.controller.getSunkCarriers(GlobalUnitsModel.Side.US).length > 0
    ) {
      setCardNumber(() => 1)
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      return
    }
    if (
      !this.cardChecked(2) &&
      (GlobalInit.controller.usHandContainsCard(2) || GlobalInit.controller.japanHandContainsCard(2))
    ) {
      setCardNumber(() => 2)
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      return
    }
    if (
      !this.cardChecked(3) &&
      (GlobalInit.controller.usHandContainsCard(3) || GlobalInit.controller.japanHandContainsCard(3))
    ) {
      setCardNumber(() => 3)
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      return
    }
    if (
      !this.cardChecked(4) &&
      (GlobalInit.controller.usHandContainsCard(4) || GlobalInit.controller.japanHandContainsCard(4))
    ) {
      console.log("*********** CARD 4 cardsChecked=", GlobalGameState.cardsChecked)
      setCardNumber(() => 4)
      this.markCard(4)
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      return
    }
    console.log("END OF TURM SUMMARY.........")
    setEndOfTurnSummaryShow(true) // TODO check for other cards
  }

  async nextState(stateObject) {
    const { setCardNumber } = stateObject

    // if this is the end of turn 7 - possible Midway Invasion

    // check if MIF fleet is one hex away from Midway
    // if so -> go to MIDWAY_INVASION
    if (GlobalGameState.gameTurn === 7) {
      if (GlobalInit.controller.japanHandContainsCard(6)) {
        setCardNumber(() => 6)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      } else {
        determineMidwayInvasion(setCardNumber, setEndOfTurnSummaryShow)
      }
    } else {
      GlobalGameState.gameTurn++

      if (GlobalGameState.gameTurn === 4 || GlobalGameState.gameTurn === 7) {
        console.log(">>>>>>>>>>>>> START OF TURN - PLAY CARD 5!!!!!!!!!")
        if (GlobalInit.controller.japanHandContainsCard(5)) {
          GlobalGameState.dieRolls = []
          setCardNumber(() => 5)
          GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
          return
        }
      }
      // else ... START OF NEW TURN
      await GlobalInit.controller.setAllUnitsToNotMoved()

      GlobalGameState.airOpJapan = 0
      GlobalGameState.airOpUS = 0
      if (GlobalInit.controller.japanHandContainsCard(6) && GlobalGameState.gameTurn !== 4) {
        setCardNumber(() => 6)
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_PLAY
      } else {
        if (GlobalGameState.gameTurn === 2 || GlobalGameState.gameTurn === 4 || GlobalGameState.gameTurn === 6) {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.US_DRAWS_ONE_CARD
        }
        if (GlobalGameState.gameTurn === 3 || GlobalGameState.gameTurn === 5 || GlobalGameState.gameTurn === 7) {
          GlobalGameState.gamePhase = GlobalGameState.PHASE.JAPAN_DRAWS_ONE_CARD
        }
      }
      GlobalGameState.phaseCompleted = false
    }
  }

  getState() {
    return GlobalGameState.PHASE.END_OF_TURN
  }
}

export default JapanHumanEndOfTurnState
