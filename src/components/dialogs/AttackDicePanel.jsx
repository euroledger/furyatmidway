import { useEffect, useRef } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import GlobalGameState from "../../model/GlobalGameState"
import { SingleCarrier } from "../../attackscreens/SingleCarrier"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"

import Die from "./Die"
import "./modal.css"
import "./largemodal.css"

function getAirCounters(attackers) {
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
function AttackDicePanel(props) {
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

  const msg = "Target For Air Attack:"

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
  const attackers = controller.getStrikeUnitsAttackingCarrier()

  let dbDRM, torpDRM
  if (
    GlobalGameState.taskForceTarget !== GlobalUnitsModel.TaskForce.MIF &&
    GlobalGameState.taskForceTarget !== GlobalUnitsModel.TaskForce.JAPAN_DMCV &&
    GlobalGameState.taskForceTarget !== GlobalUnitsModel.TaskForce.US_DMCV
  ) {
    dbDRM = "No Attack Planes On Deck: No (Dive Bomber) DRM"
    torpDRM = "Not a combined attack: No (Torpedo Bomber) DRM"
    if (GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.Carrier.MIDWAY) {
      dbDRM = "Midway Dive Bomber DRM: -1"
      torpDRM = "Midway Torpedo Bomber DRM: -1"
    } else if (GlobalGameState.currentCarrierAttackTarget !== undefined) {
      const attackAircraftOnDeck = controller.attackAircraftOnDeck()
      if (attackAircraftOnDeck) {
        dbDRM = "Attack Planes On Deck: +1 (Dive Bomber) DRM"
      }
      const combinedAttack = controller.combinedAttack()
      if (combinedAttack) {
        torpDRM = "Combined attack: +1 (Torpedo Bomber) DRM"
      }
    }
  } else {
    GlobalGameState.currentCarrierAttackTarget = GlobalUnitsModel.TaskForce.MIF

    if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.JAPAN_DMCV) {
      GlobalGameState.currentCarrierAttackTarget = GlobalGameState.jpDMCVCarrier
    }

    if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.US_DMCV) {
      GlobalGameState.currentCarrierAttackTarget = GlobalGameState.usDMCVCarrier
    }
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
            {getAirCounters(attackers)}
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
              <div>
                <p
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                  }}
                >
                  {dbDRM}
                </p>
              </div>
              <div>
                <p
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                  }}
                >
                  {torpDRM}
                </p>
              </div>
            </div>
          )}
          {footers}
        </div>
      </Modal.Body>

      <Modal.Footer style={{ background: `${bg}`, color: "black" }}>
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

export default AttackDicePanel
