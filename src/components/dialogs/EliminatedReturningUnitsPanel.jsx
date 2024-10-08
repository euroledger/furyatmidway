import { useEffect, useRef } from "react"
import { React } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import GlobalGameState from "../../model/GlobalGameState"
import "./modal.css"
import "./largemodal.css"

function getEliminatedAirCounters() {
  if (GlobalGameState.eliminatedAirUnits.length === 0) {
    return
  }
  const eliminatedAirUnits = GlobalGameState.eliminatedAirUnits.map((airUnit) => {
    return (
      <div>
        <input
          type="image"
          src={airUnit.image}
          style={{
            width: "40px",
            height: "40px",
            marginLeft: "40px",
            marginRight: "35px",
          }}
          id="bollocks"
        />
        <p
          style={{
            marginLeft: "25px",
            color: "white",
            fontSize: "10px",
          }}
        >
          {airUnit.name}
        </p>
      </div>
    )
  })
  return eliminatedAirUnits.length > 0 ? eliminatedAirUnits : "None"
}
function EliminatedReturningUnits(props) {
  const {
    controller,
    attackResolved,
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
    setDamageMarkerUpdate,
    ...rest
  } = props
  const buttonRef = useRef(null)

  useEffect(() => {
    if (buttonRef.current) {
      if (GlobalGameState.closePanel === true) {
        buttonRef.current.click()
      }
    }
  }, [GlobalGameState.closePanel])

  const bg = "#293a4b"

  let myBigBollocks = "m-width" + numDice
  let myBigMargin = 0

  const airCounters = getEliminatedAirCounters()

  if (width) {
    myBigBollocks = "m-width" + width
  }

  if (margin) {
    myBigMargin = margin
  }

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
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
            }}
          >
            <p>Eliminated Air Units (No Available Carrier to Return to):</p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {airCounters}
          </div>
        </>
      </Modal.Body>

      <Modal.Footer style={{ background: `${bg}`, color: "black" }}>
        <Button
          ref={buttonRef}
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
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EliminatedReturningUnits
