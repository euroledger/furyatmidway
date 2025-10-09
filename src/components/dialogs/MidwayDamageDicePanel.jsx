import { useEffect, useRef } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import GlobalGameState from "../../model/GlobalGameState"
import { SingleCarrier } from "../../attackscreens/SingleCarrier"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import { allMidwayBoxesDamaged } from "../../DiceHandler"

import Die from "./Die"
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
function MidwayDamageDicePanel(props) {
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
    setDamageDone,
    damageDone,
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
  const bg2 = "rgba(92, 131, 228, 0.8)"

  const closey = closeButtonStr ?? "Close"
  const msg = "Target For Air Attack:"

  let myBigBollocks = "m-width" + numDice
  let myBigMargin = 0

  let showDicePanel = showDice
  let showMsgPanel = false

  if (GlobalGameState.midwayHits > 0 && GlobalGameState.midwayHits + GlobalGameState.totalMidwayHits < 3) {
    showDicePanel = true
    // } else if (GlobalGameState.midwayHits > 0 && GlobalGameState.midwayHits + GlobalGameState.totalMidwayHits >= 3) {
  } else if (!damageDone && GlobalGameState.midwayHits + GlobalGameState.totalMidwayHits >= 3) {
    showMsgPanel = true
    allMidwayBoxesDamaged(controller, setDamageMarkerUpdate)
    GlobalGameState.midwayHits = 0
    setDamageDone(true)
  }

  let isSunk = controller.isMidwayBaseDestroyed()
  let sunkMsg = isSunk ? "Midway Base is Destroyed!" : ""

  const airCounters = getEliminatedAirCounters()

  if (width) {
    myBigBollocks = "m-width" + width
  }

  if (margin) {
    myBigMargin = margin
  }

  const diceButtonStr = numDice > 1 ? "Roll Dice" : "Roll Die"
  const boxName = controller.getAirBoxForNamedShip(
    GlobalUnitsModel.Side.US,
    GlobalUnitsModel.Carrier.MIDWAY,
    "FLIGHT_DECK"
  )

  let runwayCounters = new Array()
  for (let i = 0; i < 3; i++) {
    const damageMarker = "/images/markers/damage.png"

    const boxStr = `box ${i + 1}`
    let image = undefined
    let myElement = (
      <div
        style={{
          width: "40px",
          height: "40px",
          marginRight: "10px",
          marginTop: "-15px",
          border: "1px solid white",
        }}
      ></div>
    )
    const airUnit = controller.getAirUnitInBox(boxName, i)

    if (airUnit) {
      image = airUnit.image
    }
    if (i === 0 && GlobalGameState.midwayBox0Damaged) {
      image = damageMarker
    }
    if (i === 1 && GlobalGameState.midwayBox1Damaged) {
      image = damageMarker
    }
    if (i === 2 && GlobalGameState.midwayBox2Damaged) {
      image = damageMarker
    }
    const myImage = (
      <img
        src={image}
        style={{
          width: "40px",
          height: "40px",
          marginRight: "10px",
          marginTop: "-20px",
        }}
      ></img>
    )
    const element = image !== undefined ? myImage : myElement
    runwayCounters.push(
      <div
        style={{
          marginTop: "7px",
        }}
      >
        {element}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "-4px",
          }}
        >
          <p
            style={{
              fontSize: "10px",
            }}
          >
            {boxStr}
          </p>
        </div>
      </div>
    )
  }

  let diceMsg = "FIRST HIT: Roll of 1-2 hits box 1, 3-4 hits box 2, 5-6 hits box 3"
  if (GlobalGameState.totalMidwayHits === 1) {
    let box1 = 0,
      box2 = 0
    // determine which boxes are undamaged
    if (GlobalGameState.midwayBox0Damaged) {
      box1 = 2
      box2 = 3
    } else if (GlobalGameState.midwayBox1Damaged) {
      box1 = 1
      box2 = 3
    } else {
      box1 = 2
      box2 = 3
    }
    diceMsg = `SECOND HIT: Roll of 1-3 hits box ${box1}, 4-6 hits box ${box2}`
  } else if (GlobalGameState.totalMidwayHits >= 2) {
    diceMsg = `THIRD HIT: Midway base is Destroyed!`
  }
  if (diceButtonDisabled) {
    diceMsg = ""
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
              marginLeft: "290px",
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "-10px",
            }}
          >
            <div
              style={{
                zIndex: 100,
                width: "250px",
                height: "100px",
                background: bg2,
                borderRadius: "3px",
                color: "white",
                border: "1px solid white",
                marginBottom: "10px",
              }}
            >
              <p style={{ marginLeft: "5px" }}>Units in Runway Boxes:</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: "7px",
                }}
              >
                {runwayCounters}
              </div>
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
          {showMsgPanel && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                }}
              >
                <p>Midway base is Destroyed!</p>
              </div>
            </>
          )}
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
                <p>{diceMsg}</p>
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

export default MidwayDamageDicePanel
