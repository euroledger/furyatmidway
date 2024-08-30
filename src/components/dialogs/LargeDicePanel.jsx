import Modal from "react-bootstrap/Modal"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Button from "react-bootstrap/Button"
import GlobalGameState from "../../model/GlobalGameState"
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
    ...rest
  } = props

  const bg = "#293a4b"
  const rowClass = `g-${numDice}`

  let myBigBollocks = "m-width" + numDice
  let myBigMargin = 0

  let showDicePanel = showDice

  if (width) {
    myBigBollocks = `maxWidth: ${width}%`
  }

  if (margin) {
    myBigMargin = margin
  }

  //   const sizey = numDice >= 4 ? "xl" : "lg"

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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: `${bg}`,
          color: "white",
        }}
      >
        <p className="text-center">{headerText}</p>
      </Modal.Header>
      <Modal.Body style={{ background: `${bg}`, color: "black" }}>
        <div style={{ marginLeft: "28px" }}>
          {headers}

          {showDicePanel && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Row xs={numDice} className={rowClass}>
                {Array.from({ length: numDice }).map((_, idx) => {
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
              {/* <Row style={{marginTop: "10px" }} xs={numDice} className={rowClass}>
              {Array.from({ length: numDice }).map((_, idx) => {
                const dieName = "dice" + (idx + 1)
                return (
                    <Col key={idx} className="d-flex">
                      <Die name={dieName}></Die>
                    </Col>
                )
              })}
            </Row> */}
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
            GlobalGameState.gamePhase = nextState
            onHide(e)
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default LargeDicePanel
