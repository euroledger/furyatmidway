import { useEffect, useRef, useState } from "react"

import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import GlobalGameState from "../../model/GlobalGameState"
import "./modal.css"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import GlobalUIConstants from "../UIConstants"
import { cardEventHandler } from "../../PlayerState/StateUtils"
import MinimizeButton from "./MinimizeButton"
import "./CustomModal.css"

function CardAlertPanel(props) {
  const {
    controller,
    headerText,
    setHeaderText,
    headers,
    footers,
    setShowCardFooter,
    cardNumber,
    onHide,
    width,
    eventHandler,
    margin,
    setButtonModalShow,
    setCardDicePanelShow5,
    setCardDicePanelShow7,
    setStrikeLostPanelShow,
    setCarrierPlanesDitchPanelShow,
    setTowedToFriendlyPortPanelShow,
    nextAction,
    setDamagedCV,
    setAttackResolved,
    setAirReplacementsPanelShow,
    setDamageControlPanelShow,
    setSubmarineAlertPanelShow,
    setSubmarineDamagePanelShow,
    ...rest
  } = props
  const [buttonPressed, setButtonPressed] = useState(false)
  const [thisCard, setThisCard] = useState(0)

  const button1Ref = useRef(null)
  const button2Ref = useRef(null)
  const button3Ref = useRef(null)

  const closeButtonStr = buttonPressed ? "Close" : "No"

  if (thisCard !== cardNumber) {
    setButtonPressed(false)
    setThisCard(cardNumber)
  }
  const noHandler = (e) => {
    // setButtonPressed(() => false)
    setShowCardFooter(false)
    onHide(e)
    nextAction(e)
  }

  const minimizeWindow = (e) => {
    setButtonModalShow(true)
    onHide(e)
  }

  const yesHandler = (e) => {
    if (cardNumber === 1) {
      setTowedToFriendlyPortPanelShow(true)
      controller.setCardPlayed(1, GlobalUnitsModel.Side.US)
      cardEventHandler(1, GlobalUnitsModel.Side.US)
      onHide(e)
      nextAction(e)
    } else if (cardNumber === 2) {
      setDamageControlPanelShow(true)
      if (controller.usHandContainsCard(2)) {
        controller.setCardPlayed(2, GlobalUnitsModel.Side.US)
        cardEventHandler(2, GlobalUnitsModel.Side.US)
        nextAction(e)
      } else {
        controller.setCardPlayed(2, GlobalUnitsModel.Side.JAPAN)
        cardEventHandler(2, GlobalUnitsModel.Side.JAPAN)
      }
      onHide(e)
    } else if (cardNumber === 3) {
      setAirReplacementsPanelShow(true)
      if (controller.usHandContainsCard(3)) {
        cardEventHandler(3, GlobalUnitsModel.Side.US)
        GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
        GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_RESPONSE
        controller.setCardPlayed(3, GlobalUnitsModel.Side.US)
      } else {
        cardEventHandler(3, GlobalUnitsModel.Side.JAPAN)
        controller.setCardPlayed(3, GlobalUnitsModel.Side.JAPAN)
        onHide(e)
      }
    } else if (cardNumber === 4) {
      let side
      setDamagedCV("")
      if (controller.usHandContainsCard(4)) {
        side = GlobalUnitsModel.Side.US
        cardEventHandler(4, GlobalUnitsModel.Side.US)
        controller.setCardPlayed(4, GlobalUnitsModel.Side.US)
      } else {
        console.log("JAPAN PLAYING CARD #4 SUBMARINE >>>>>>>>>>>>>>>>>")
        cardEventHandler(4, GlobalUnitsModel.Side.JAPAN)
        side = GlobalUnitsModel.Side.JAPAN
        controller.setCardPlayed(4, GlobalUnitsModel.Side.JAPAN)
        onHide(e)
      }

      // if towed to friendly port has been played, go to SubmarainAlertPanel
      // otherwise straight to SubmarineDamagePanel

      if (side === GlobalUnitsModel.Side.US || controller.getCardPlayed(1, GlobalUnitsModel.Side.US) === false) {
        setSubmarineDamagePanelShow(true)
      } else {
        setSubmarineAlertPanelShow(true)
      }
      // onHide(e)
    } else if (cardNumber === 5) {
      setCardDicePanelShow5(true)
      cardEventHandler(5, GlobalUnitsModel.Side.JAPAN)
      controller.setCardPlayed(5, GlobalUnitsModel.Side.JAPAN)
      onHide(e)
      // nextAction(e)
    } else if (cardNumber === 6) {
      setHeaderText("CARD #6 PLAYED")
      cardEventHandler(6, GlobalUnitsModel.Side.JAPAN)
      controller.setCardPlayed(6, GlobalUnitsModel.Side.JAPAN)
      setShowCardFooter(() => true)
    } else if (cardNumber === 7) {
      setCardDicePanelShow7(true)
      cardEventHandler(7, GlobalUnitsModel.Side.US)
      controller.setCardPlayed(7, GlobalUnitsModel.Side.US)
      onHide(e)
      nextAction(e)
    } else if (cardNumber === 8) {
      cardEventHandler(8, GlobalUnitsModel.Side.US)
      controller.setCardPlayed(8, GlobalUnitsModel.Side.US)
      setShowCardFooter(() => true)
      onHide(e)
      nextAction(e)
    } else if (cardNumber === 9) {
      setHeaderText("CARD #9 PLAYED")
      cardEventHandler(9, GlobalUnitsModel.Side.JAPAN)
      controller.setCardPlayed(9, GlobalUnitsModel.Side.JAPAN)
      setShowCardFooter(() => true)
    } else if (cardNumber === 10) {
      cardEventHandler(10, GlobalUnitsModel.Side.JAPAN)
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_RESPONSE
    } else if (cardNumber === 11) {
      cardEventHandler(11, GlobalUnitsModel.Side.JAPAN)
      GlobalGameState.currentPlayer = GlobalUnitsModel.Side.US
      GlobalGameState.gamePhase = GlobalGameState.PHASE.CARD_RESPONSE
      setStrikeLostPanelShow(true)
      controller.setCardPlayed(11, GlobalUnitsModel.Side.JAPAN)
      onHide(e)
      nextAction(e)
    } else if (cardNumber === 12) {
      cardEventHandler(12, GlobalUnitsModel.Side.JAPAN)
      controller.setCardPlayed(12, GlobalUnitsModel.Side.JAPAN)
      setShowCardFooter(() => true)
      // onHide(e)
    } else if (cardNumber === 13) {
      cardEventHandler(13, GlobalUnitsModel.Side.US)
      setAttackResolved(() => false)
      controller.setCardPlayed(13, GlobalUnitsModel.Side.US)
      setShowCardFooter(() => true)
    } else {
      setShowCardFooter(() => true)
    }
    setThisCard(cardNumber)
    setButtonPressed(() => true)
    // eventHandler(cardNumber)
  }

  useEffect(() => {
    if (button2Ref.current) {
      if (GlobalGameState.closePanel === true) {
        button2Ref.current.click()
      }
    }
  }, [GlobalGameState.closePanel])

  let bg = "black"

  if (GlobalGameState.gameTurn !== 4) {
    bg = GlobalUIConstants.Colors.US
    if (
      cardNumber === 5 ||
      cardNumber === 6 ||
      cardNumber === 9 ||
      cardNumber === 10 ||
      cardNumber === 11 ||
      cardNumber === 12
    ) {
      bg = GlobalUIConstants.Colors.JAPAN
    }
  }

  let myBigBollocks = "modal-width" + 2

  if (width) {
    myBigBollocks = `maxWidth: ${width}%`
  }

  if (margin) {
    myBigMargin = margin
  }

  if (cardNumber === 0) {
    return
  }
  const jpCard =
    controller.japanHandContainsCard(cardNumber) || controller.getCardPlayed(cardNumber, GlobalUnitsModel.Side.JAPAN)
  let image = jpCard ? "/images/japanflag.jpg" : "/images/usaflag.jpg"

  bg = jpCard ? GlobalUIConstants.Colors.JAPAN : GlobalUIConstants.Colors.US

  const combinedDialogClasses = `modal-minimized-modal ${myBigBollocks}`
  return (
    <Modal
      {...rest}
      size={"lg"}
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName={combinedDialogClasses}
      centered
    >
      <Modal.Header
        // className="text-center"
        style={{
          background: `${bg}`,
          color: "white",
        }}
      >
        <div
          style={{
            float: "left",
            width: "20%",
          }}
        >
          <img
            style={{
              width: "60px",
              height: "40px",
            }}
            src={image}
          ></img>
        </div>
        <div
          style={{
            float: "left",
            width: "60%",
            textAlign: "center",
          }}
        >
          <h4>{headerText}</h4>
        </div>
        <div
          style={{
            float: "left",
            width: "20%",
            textAlign: "right",
          }}
        ></div>
        <MinimizeButton clickHandler={minimizeWindow}></MinimizeButton>
      </Modal.Header>
      <Modal.Body style={{ background: `${bg}`, color: "black" }}>
        <div style={{ marginLeft: "28px" }}>
          {headers}

          {footers}
        </div>
      </Modal.Body>

      <Modal.Footer style={{ background: `${bg}`, color: "black" }}>
        {!buttonPressed && (
          <Button ref={button1Ref} onClick={(e) => yesHandler(e)}>
            Yes
          </Button>
        )}
        <Button
          ref={button2Ref}
          disabled={false}
          onClick={(e) => {
            noHandler(e)
          }}
        >
          {closeButtonStr}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CardAlertPanel
