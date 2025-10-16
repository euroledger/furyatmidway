// may need separate processPlayedCard functions for Japan and US
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import GlobalInit from "../model/GlobalInit"
import GlobalGameState from "../model/GlobalGameState"

export function processPlayedCard(stateObject) {
  const { setCardDicePanelShow7, cardNumber, cardEventHandler, setShowCardFooter, setCardDicePanelShow5 } = stateObject
  if (cardNumber === 1) {
    setTowedToFriendlyPortPanelShow(true)
    GlobalInit.controller.setCardPlayed(1, GlobalUnitsModel.Side.US)
    onHide(e)
  } else if (cardNumber === 2) {
    setDamageControlPanelShow(true)
    if (GlobalInit.controller.usHandContainsCard(2)) {
      GlobalInit.controller.setCardPlayed(2, GlobalUnitsModel.Side.US)
    } else {
      GlobalInit.controller.setCardPlayed(2, GlobalUnitsModel.Side.JAPAN)
    }
    onHide(e)
  } else if (cardNumber === 3) {
    setAirReplacementsPanelShow(true)
    if (GlobalInit.controller.usHandContainsCard(3)) {
      GlobalInit.controller.setCardPlayed(3, GlobalUnitsModel.Side.US)
    } else {
      GlobalInit.controller.setCardPlayed(3, GlobalUnitsModel.Side.JAPAN)
    }
    onHide(e)
  } else if (cardNumber === 4) {
    console.log(">>>>>>>>>> PROCESS CARD #4 PLAYED>>>>>>>>>>>>>")
    let side
    setDamagedCV("")
    if (GlobalInit.controller.usHandContainsCard(4)) {
      side = GlobalUnitsModel.Side.US
      GlobalInit.controller.setCardPlayed(4, GlobalUnitsModel.Side.US)
    } else {
      side = GlobalUnitsModel.Side.JAPAN
      GlobalInit.controller.setCardPlayed(4, GlobalUnitsModel.Side.JAPAN)
    }

    // if towed to friendly port has been played, go to SubmarainAlertPanel
    // otherwise straight to SubmarineDamagePanel

    if (
      side === GlobalUnitsModel.Side.US ||
      GlobalInit.controller.getCardPlayed(1, GlobalUnitsModel.Side.US) === false
    ) {
      setSubmarineDamagePanelShow(true)
    } else {
      setSubmarineAlertPanelShow(true)
    }
    onHide(e)
  } else if (cardNumber === 5) {
    setCardDicePanelShow5(true)
    GlobalInit.controller.setCardPlayed(5, GlobalUnitsModel.Side.JAPAN)
    onHide(e)
  } else if (cardNumber === 6) {
    setHeaderText("CARD #6 PLAYED")
    GlobalInit.controller.setCardPlayed(6, GlobalUnitsModel.Side.JAPAN)
    setShowCardFooter(() => true)
  } else if (cardNumber === 7) {
    setCardDicePanelShow7(true)
    GlobalInit.controller.setCardPlayed(7, GlobalUnitsModel.Side.US)
  } else if (cardNumber === 8) {
    console.log(">>>>>>>>>>>>>>>> POOP CARD 8 PLAYED >>>>>>>>>>>>>>")
    GlobalInit.controller.setCardPlayed(8, GlobalUnitsModel.Side.US)
    setShowCardFooter(() => true)
  } else if (cardNumber === 9) {
    GlobalInit.controller.setCardPlayed(9, GlobalUnitsModel.Side.JAPAN)
    setShowCardFooter(() => true)
  } else if (cardNumber === 10) {
    GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
    GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_RESPONSE
    GlobalInit.controller.setCardPlayed(10, GlobalUnitsModel.Side.JAPAN)
    onHide(e)
  } else if (cardNumber === 11) {
    setStrikeLostPanelShow(true)
    GlobalInit.controller.setCardPlayed(11, GlobalUnitsModel.Side.JAPAN)
    onHide(e)
  } else if (cardNumber === 12) {
    GlobalInit.controller.setCardPlayed(12, GlobalUnitsModel.Side.JAPAN)
    setShowCardFooter(() => true)
    // onHide(e)
  } else if (cardNumber === 13) {
    setAttackResolved(() => false)
    GlobalInit.controller.setCardPlayed(13, GlobalUnitsModel.Side.US)
    setShowCardFooter(() => true)
  } else {
    setShowCardFooter(() => true)
    // nextAction()
  }
  cardEventHandler(cardNumber)
}
