import { useEffect, useRef } from "react"

import Modal from "react-bootstrap/Modal"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Button from "react-bootstrap/Button"
import GlobalGameState from "../../model/GlobalGameState"
import Die from "./Die"
import "./modal.css"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import Draggable from "react-draggable"

function DicePanel(props) {
  let {
    numDice,
    headerText,
    headers,
    footers,
    diceButtonDisabled,
    nextState,
    hidden,
    closeButtonDisabled,
    onHide,
    width,
    margin,
    showDice,
    doRoll,
    displayDiceButton,
    closeButtonStr,
    image,
    sidebg,
    ...rest
  } = props
  // const numDice = props.numDice
  const button1Ref = useRef(null)
  const button2Ref = useRef(null)

  const closeHandler = (e) => {
    if (nextState) {
      GlobalGameState.gamePhase = nextState
    }
    onHide(e)
  }

  useEffect(() => {
    if (button1Ref.current) {
      if (GlobalGameState.rollDice === true) {
        button1Ref.current.click()
      }
    }
  }, [GlobalGameState.rollDice])

  useEffect(() => {
    if (button2Ref.current) {
      if (GlobalGameState.closePanel === true) {
        button2Ref.current.click()
      }
    }
  }, [GlobalGameState.closePanel])

  if (!sidebg) {
    sidebg = GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.JAPAN ? "#4B0808" : "#293a4b"
  }
  let showImg = false
  if (image != "NOFLAG") {
    showImg = true
  }
  if (!image) {
    image =
      GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.JAPAN
        ? "/images/japanflag.jpg"
        : "/images/usaflag.jpg"
  }
  const bg = GlobalGameState.gameTurn === 4 ? "black" : sidebg

  const rowClass = `g-${numDice}`

  let myBigBollocks = "modal-width" + numDice
  let myBigMargin = 0

  let showDicePanel = showDice
  if (!showDicePanel) {
    numDice = 0
  }

  if (width) {
    myBigBollocks = `maxWidth: ${width}%`
  }

  if (margin) {
    myBigMargin = margin
  }
  const closey = closeButtonStr ?? "Close"
  const diceButtonStr = numDice > 1 ? "Roll Dice" : "Roll Die"
  return (
    <Draggable handle=".handle">
      <Modal
        {...rest}
        size={"lg"}
        aria-labelledby="contained-modal-title-vcenter"
        dialogClassName={myBigBollocks}
        centered
      >
        <Modal.Header
          className="text-center"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: `${bg}`,
            color: "white",
          }}
        >
          {showImg && (
            <div
              style={{
                width: "100px",
                height: "60px",
                marginLeft: "-255px",
                marginRight: "205px",
              }}
            >
              <img
                style={{
                  width: "60px",
                  height: "40px",
                  marginLeft: "80px"
                }}
                src={image}
              ></img>
            </div>
          )}
          <p>
            <h4>{headerText}</h4>
          </p>
        </Modal.Header>
        <Modal.Body style={{ background: `${bg}`, color: "black" }}>
          <div style={{ marginLeft: "28px" }}>
            {headers}

            {showDicePanel && (
              <Row xs={1} md={numDice} className={rowClass}>
                {Array.from({ length: numDice }).map((_, idx) => {
                  const dieName = "dice" + (idx + 1)
                  return (
                    <div>
                      <Col
                        style={{ marginTop: "10px", marginBottom: "20px", marginLeft: `${myBigMargin}px` }}
                        key={idx}
                        className="d-flex"
                      >
                        <Die name={dieName}></Die>
                      </Col>
                    </div>
                  )
                })}
              </Row>
            )}
            {footers}
          </div>
        </Modal.Body>

        <Modal.Footer style={{ background: `${bg}`, color: "black" }}>
          {numDice > 0 && (
            <Button ref={button1Ref} hidden={hidden} disabled={diceButtonDisabled} onClick={() => doRoll()}>
              {diceButtonStr}
            </Button>
          )}
          <Button
            ref={button2Ref}
            disabled={closeButtonDisabled}
            onClick={(e) => {
              closeHandler(e)
            }}
          >
            {closey}
          </Button>
        </Modal.Footer>
      </Modal>
    </Draggable>
  )
}

export default DicePanel
