import { useEffect, useRef, useState } from "react"

import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import GlobalGameState from "../../model/GlobalGameState"
import "./modal.css"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"

function CardPlayedByAIPanel(props) {
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
  const [thisCard, setThisCard] = useState(0)

  if (thisCard !== cardNumber) {
    setThisCard(cardNumber)
  }
  const closeHandler = (e) => {
    // setButtonPressed(() => false)
    setShowCardFooter(false)
    onHide(e)
  }

  if (cardNumber === 6) {
    setHeaderText("CARD #6 PLAYED")
    setShowCardFooter(() => true)
  }

  const yesHandler = (e) => {
    if (cardNumber === 1) {
      setTowedToFriendlyPortPanelShow(true)
      controller.setCardPlayed(1, GlobalUnitsModel.Side.US)
      onHide(e)
    } else if (cardNumber === 2) {
      setDamageControlPanelShow(true)
      if (controller.usHandContainsCard(2)) {
        controller.setCardPlayed(2, GlobalUnitsModel.Side.US)
      } else {
        controller.setCardPlayed(2, GlobalUnitsModel.Side.JAPAN)
      }
      onHide(e)
    } else if (cardNumber === 3) {
      setAirReplacementsPanelShow(true)
      if (controller.usHandContainsCard(3)) {
        controller.setCardPlayed(3, GlobalUnitsModel.Side.US)
      } else {
        controller.setCardPlayed(3, GlobalUnitsModel.Side.JAPAN)
      }
      onHide(e)
    } else if (cardNumber === 4) {
      let side
      setDamagedCV("")
      if (controller.usHandContainsCard(4)) {
        side = GlobalUnitsModel.Side.US
        controller.setCardPlayed(4, GlobalUnitsModel.Side.US)
      } else {
        side = GlobalUnitsModel.Side.JAPAN
        controller.setCardPlayed(4, GlobalUnitsModel.Side.JAPAN)
      }

      // if towed to friendly port has been played, go to SubmarainAlertPanel
      // otherwise straight to SubmarineDamagePanel

      if (side === GlobalUnitsModel.Side.US || controller.getCardPlayed(1, GlobalUnitsModel.Side.US) === false) {
        setSubmarineDamagePanelShow(true)
      } else {
        setSubmarineAlertPanelShow(true)
      }
      onHide(e)
    } else if (cardNumber === 5) {
      setCardDicePanelShow5(true)
      controller.setCardPlayed(5, GlobalUnitsModel.Side.JAPAN)
      onHide(e)
    } else if (cardNumber === 6) {
      setHeaderText("CARD #6 PLAYED")
      controller.setCardPlayed(6, GlobalUnitsModel.Side.JAPAN)
      setShowCardFooter(() => true)
    } else if (cardNumber === 7) {
      setCardDicePanelShow7(true)
      controller.setCardPlayed(7, GlobalUnitsModel.Side.US)
      onHide(e)
    } else if (cardNumber === 8) {
      controller.setCardPlayed(8, GlobalUnitsModel.Side.US)
      setShowCardFooter(() => true)
    } else if (cardNumber === 9) {
      controller.setCardPlayed(9, GlobalUnitsModel.Side.JAPAN)
      setShowCardFooter(() => true)
    } else if (cardNumber === 10) {
      setCarrierPlanesDitchPanelShow(true)
      controller.setCardPlayed(10, GlobalUnitsModel.Side.JAPAN)
      onHide(e)
    } else if (cardNumber === 11) {
      setStrikeLostPanelShow(true)
      controller.setCardPlayed(11, GlobalUnitsModel.Side.JAPAN)
      onHide(e)
    } else if (cardNumber === 12) {
      controller.setCardPlayed(12, GlobalUnitsModel.Side.JAPAN)
      setShowCardFooter(() => true)
      // onHide(e)
    } else if (cardNumber === 13) {
      setAttackResolved(() => false)
      controller.setCardPlayed(13, GlobalUnitsModel.Side.US)
      setShowCardFooter(() => true)
    } else {
      setShowCardFooter(() => true)
      // nextAction()
    }
    setThisCard(cardNumber)
    setButtonPressed(() => true)
    eventHandler(cardNumber)
  }


  const bg = GlobalGameState.gameTurn === 4 ? "black" : "#293a4b"

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

  return (
    <Modal
      {...rest}
      size={"lg"}
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName={myBigBollocks}
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
        {/* <div>TEXT</div>
      <div  style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: `${bg}`,
          color: "white",
        }}> <p className="text-center">
        </p></div> */}
      </Modal.Header>
      <Modal.Body style={{ background: `${bg}`, color: "black" }}>
        <div style={{ marginLeft: "28px" }}>
          {headers}

          {footers}
        </div>
      </Modal.Body>

      <Modal.Footer style={{ background: `${bg}`, color: "black" }}>
        <Button
          disabled={false}
          onClick={(e) => {
            closeHandler(e)
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CardPlayedByAIPanel
