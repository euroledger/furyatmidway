import Modal from "react-bootstrap/Modal"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Button from "react-bootstrap/Button"
import GlobalGameState from "../../model/GlobalGameState"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import { SingleCarrier } from "../../attackscreens/SingleCarrier"
import { Container } from "react-bootstrap"

import Die from "./Die"
import "./modal.css"
import "./largemodal.css"

function getAirCounters(controller, attackers) {
  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US

  const msg = "Target For Air Attack:"

  let index = 0
  const airCounters = attackers.map((airUnit) => {
    let hits = airUnit.aircraftUnit.hitsScored

    let twoDice = airUnit.aircraftUnit.steps === 2

    let dieName1 = "dice" + (index + 1)
    let dieName2 = "dice" + (index + 2)
    index += airUnit.aircraftUnit.steps

    const msg = "HITS:"
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
            marginLeft: "5px",
            color: "white",
          }}
        >
          {airUnit.name}
        </p>

        <div style={{ marginLeft: "-20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
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
            marginLeft: "25px",
            color: "white",
          }}
        >
          {msg} &nbsp;<strong>{hits}</strong>&nbsp;
        </p>
      </div>
    )
  })
  return airCounters
}
function NewDicePanel(props) {
  const {
    controller,
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
    ...rest
  } = props

  const bg = "#293a4b"
  const closey = closeButtonStr ?? "Close"
  const msg = "Target For Air Attack:"

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

  const diceButtonStr = numDice > 1 ? "Roll Dice" : "Roll Die"
  const attackers = controller.getStrikeUnitsAttackingCarrier()

  let idx = 0
  let attIdx = 0

  let airmargins = ["-1px", "-13px", "-13px", "-19px", "-21px", "-21px", "-21px", "-21px"]
  let airmargin1 = attackers.length === 8 ? "1px" : "3px"
  let bigMargin = attackers.length < 3 ? "15px" : "-23px"
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
          background: `${bg}`,
          color: "white",
        }}
      >
        <p className="text-center">
          <h4>{headerText}</h4>
        </p>
      </Modal.Header>
      <Modal.Body style={{ background: `${bg}`, color: "black" }}>
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
              {msg} &nbsp;<strong>{GlobalGameState.currentCarrierAttackTarget}</strong>&nbsp;
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {getAirCounters(controller, attackers)}
          </div>

          {showDicePanel && (
            <div
              style={{
                color: "white",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  marginTop: "20px",
                  marginLeft: "445px",
                }}
              >
                <div
                  style={{
                    maxHeight: "200",
                    minHeight: "200px",
                  }}
                >
                  <SingleCarrier controller={controller}></SingleCarrier>
                </div>
              </div>
            </div>
          )}
          {footers}
        </div>
      </Modal.Body>

      <Modal.Footer style={{ background: `${bg}`, color: "black" }}>
        {numDice > 0 && (
          <Button disabled={diceButtonDisabled} onClick={() => doRoll()}>
            {diceButtonStr}
          </Button>
        )}
        <Button
          disabled={closeButtonDisabled}
          onClick={(e) => {
            if (nextState) {
              GlobalGameState.gamePhase = nextState
            }
            if (closeButtonCallback) {
              closeButtonCallback()
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

export default NewDicePanel
