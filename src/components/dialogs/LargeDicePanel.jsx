import { useEffect, useRef } from "react"

import Modal from "react-bootstrap/Modal"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Button from "react-bootstrap/Button"
import GlobalGameState from "../../model/GlobalGameState"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import Die from "./Die"
import "./modal.css"
import "./largemodal.css"

function LargeDicePanel(props) {
  const {
    numDice,
    headerText,
    headers,
    footers,
    diceButtonDisabled,
    nextState,
    closeButtonDisabled,
    onHide,
    width,
    margin,
    showDice,
    doRoll,
    closeButtonStr,
    closeButtonCallback,
    sidebg,
    image,
    disableButtons,
    ...rest
  } = props

  const button1Ref = useRef(null)
  const button2Ref = useRef(null)

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
  let sidey = sidebg
  if (!sidebg) {
    sidey = GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.JAPAN ? "#4B0808" : "#293a4b"
  }
  let showImg = false
  let img = image
  if (image != "NOFLAG") {
    showImg = true
  }
  if (!image) {
    img =
      GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.JAPAN
        ? "/images/japanflag.jpg"
        : "/images/usaflag.jpg"
  }

  const bg = GlobalGameState.gameTurn === 4 ? "black" : sidey
  const closey = closeButtonStr ?? "Close"

  let numDiceRow1 = numDice
  let numDiceRow2 = 0
  if (numDice > 8) {
    // numDiceRow1 = Math.ceil(numDice / 2)
    // numDiceRow2 = numDice - numDiceRow1
    numDiceRow1 = 8
    numDiceRow2 = numDice - 8
  }
  const rowClass1 = `g-${numDiceRow1}`
  const rowClass2 = `g-${numDiceRow2}`

  let myBigBollocks = "m-width" + numDiceRow1
  let myBigMargin = 0

  let showDicePanel = showDice

  if (width) {
    myBigBollocks = "m-width" + width
  }

  if (margin) {
    myBigMargin = margin
  }

  //   const sizey = numDice >= 4 ? "xl" : "lg"
  const show = numDiceRow2 > 0
  const diceButtonStr = numDice > 1 ? "Roll Dice" : "Roll Die"
  return (
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
          background: `${bg}`,
          color: "white",
        }}
      >
        {showImg && (
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
              src={img}
            ></img>
          </div>
        )}
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
      </Modal.Header>
      <Modal.Body style={{ background: `${bg}`, color: "black" }}>
        <div style={{ marginLeft: "28px" }}>
          {headers}

          {showDicePanel && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Row xs={numDiceRow1} className={rowClass1}>
                  {Array.from({ length: numDiceRow1 }).map((_, idx) => {
                    const dieName = "dice" + (idx + 1)
                    return (
                      <Col key={idx} className="d-flex">
                        <div style={{ marginLeft: `${myBigMargin}px` }}>
                          <Die name={dieName}></Die>
                        </div>
                      </Col>
                    )
                  })}
                </Row>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <Row xs={numDiceRow2} className={rowClass2}>
                  {Array.from({ length: numDiceRow2 }).map((_, idx) => {
                    const dieName = "dice" + (idx + 9)
                    return (
                      <Col key={idx} className="d-flex">
                        <div style={{ marginLeft: `${myBigMargin}px` }}>
                          <Die name={dieName}></Die>
                        </div>
                      </Col>
                    )
                  })}
                </Row>
              </div>
            </>
          )}
          {footers}
        </div>
      </Modal.Body>

      <Modal.Footer style={{ background: `${bg}`, color: "black" }}>
        {numDice > 0 && (
          <Button ref={button1Ref} disabled={diceButtonDisabled} onClick={() => doRoll()}>
            {diceButtonStr}
          </Button>
        )}
        <Button
          ref={button2Ref}
          disabled={closeButtonDisabled}
          onClick={(e) => {
            if (nextState) {
              GlobalGameState.gamePhase = nextState
            }
            if (closeButtonCallback) {
              closeButtonCallback(e)
            } else {
              onHide(e)
            }
          }}
        >
          {closey}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default LargeDicePanel
