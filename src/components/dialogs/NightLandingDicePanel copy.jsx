import { useEffect, useRef } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import GlobalGameState from "../../model/GlobalGameState"

import Die from "./Die"
import "./modal.css"
import "./largemodal.css"

function getAirCounters(airUnits) {
  let index = 0
  const airCounters = airUnits.map((airUnit) => {
    let twoDice = airUnit.aircraftUnit.steps === 2

    let dieName1 = "dice" + (index + 1)
    let dieName2 = "dice" + (index + 2)
    index += airUnit.aircraftUnit.steps

    const msg = "STEPS LOST:"
    return (
      <div>
        <input
          type="image"
          src={airUnit.image}
          style={{
            width: "80px",
            height: "80px",
            marginLeft: "15px",
            marginRight: "35px",
          }}
          id="bollocks"
        />
        <p
          style={{
            marginLeft: "10px",
            color: "white",
            fontSize: "14px",
          }}
        >
          {airUnit.name}
        </p>

        <div style={{ marginLeft: "-15px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div>
            <Die name={dieName1}></Die>
          </div>

          {twoDice && (
            <div style={{ marginLeft: "5px" }}>
              <Die name={dieName2}></Die>
            </div>
          )}
        </div>
        <p
          style={{
            marginTop: "15px",
            marginLeft: "15px",
            color: "white",
          }}
        >
          {msg}
        </p>
      </div>
    )
  })
  return airCounters
}
function NightLandingDicePanel(props) {
  const {
    controller,
    numDice,
    headerText,
    setNightLandingDone,
    diceButtonDisabled,
    nextState,
    closeButtonDisabled,
    footers,
    onHide,
    width,
    margin,
    showDice,
    doRoll,
    closeButtonStr,
    closeButtonCallback,
    side,
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

  const bg = "#293a4b"
  const closey = closeButtonStr ?? "Close"

  let numDiceRow1 = numDice
  let numDiceRow2 = 0
  if (numDice > 8) {
    numDiceRow1 = 8
    numDiceRow2 = numDice - 8
  }

  let myBigBollocks = "m-width" + numDiceRow1

  let showDicePanel = showDice

  if (width) {
    myBigBollocks = "m-width" + width
  }

  if (margin) {
    myBigMargin = margin
  }

  const diceButtonStr = numDice > 1 ? "Roll Dice" : "Roll Die"
  let landingUnits = controller.getAllAirUnitsInReturn2Boxes(side)

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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "black",
          color: "white",
        }}
      >
        <p className="text-center">
          <h4>{headerText}</h4>
        </p>
      </Modal.Header>
      <Modal.Body style={{ background: "black", color: "white" }}>
        <div style={{ marginLeft: "28px" }}>
          <div>
            <p
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
              }}
            >
              Night Landing: For each air step in Return-2 Box roll one die: 1-4 landing successful, 5-6 step lost
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {getAirCounters(landingUnits)}
          </div>

          {showDicePanel && (
            <div
              style={{
                color: "white",
              }}
            ></div>
          )}
          {footers}
        </div>
      </Modal.Body>

      <Modal.Footer style={{ background: "black", color: "white" }}>
        <Button ref={button1Ref} disabled={diceButtonDisabled} onClick={() => doRoll()}>
          {diceButtonStr}
        </Button>

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

export default NightLandingDicePanel
