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
    show,
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

  if (!show) {
    return
  }

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

  if (cardNumber === 7) {
    setHeaderText("CARD #7 PLAYED")
    setShowCardFooter(() => true)
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

  console.log("RETURN SOME STUFF")
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
