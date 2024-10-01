import { React, useState } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import GlobalGameState from "../../model/GlobalGameState"
import { SingleCarrier } from "../../attackscreens/SingleCarrier"

import Die from "./Die"
import { autoAllocateDamage, sendDamageUpdates } from "../../DiceHandler"
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
function CarrierDamageDicePanel(props) {
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

  const [keepDice, setKeepDice] = useState(false)

  let showDicePanel = true

  const hits = GlobalGameState.carrierAttackHits

  const bg = "#293a4b"
  const closey = closeButtonStr ?? "Close"
  const msg = "Target For Air Attack:"

  let myBigBollocks = "m-width" + numDice
  let myBigMargin = 0


  // 1. Get the current hits for this carrier

  // 2. If current hits is 0 and carrierAttackHits is 1
  //    => Display dice panel

  // 3. autoAllocateDamage

  const carrierHits = controller.getCarrierHits(GlobalGameState.currentCarrierAttackTarget)
  
 if ((carrierHits > 0 || GlobalGameState.carrierAttackHits > 1) && GlobalGameState.TESTING !== true) {
    const damage = autoAllocateDamage(controller)

    sendDamageUpdates(controller, damage, setDamageMarkerUpdate)
    GlobalGameState.carrierAttackHits = 0
  } else if (GlobalGameState.carrierAttackHits === 0) {
    showDicePanel = false
  }

  let isSunk = false
  if (GlobalGameState.currentCarrierAttackTarget !== "" && GlobalGameState.currentCarrierAttackTarget !== undefined) {
    isSunk = controller.isSunk(GlobalGameState.currentCarrierAttackTarget)
  }
  const sunkMsg = `Carrier ${GlobalGameState.currentCarrierAttackTarget} is Sunk!`

  const airCounters = getEliminatedAirCounters()

  if (width) {
    myBigBollocks = "m-width" + width
  }

  if (margin) {
    myBigMargin = margin
  }

  const msg2 = "Total Hits to Allocate:"


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
        <p className="text-center">
          <h4>{headerText}</h4>
        </p>
      </Modal.Header>
      <Modal.Body style={{ background: `${bg}`, color: "black" }}>
        <>
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
              display: "inline-block",
              marginTop: "20px",
              marginLeft: "335px",
            }}
          >
            <div
              style={{
                maxHeight: "200",
                minHeight: "200px",
              }}
            >
              <SingleCarrier controller={controller} attackResolved={attackResolved}></SingleCarrier>
            </div>
          </div>
          
          {isSunk && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                fontSize: "20px",
              }}
            >
              <p>{sunkMsg}</p>
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
            }}
          >
            <p>Eliminated Air Units:</p>
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

          {showDicePanel && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                }}
              >
                <p> Roll One Die for First Hit (1-3 bow, 4-6 stern). Further Damage Auto Allocated</p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                }}
              >
                <p>
                  {msg2} &nbsp;<strong>{hits}</strong>&nbsp;
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div>
                  <Die name="dice1"></Die>
                </div>
              </div>
            </>
          )}
        </>
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

export default CarrierDamageDicePanel