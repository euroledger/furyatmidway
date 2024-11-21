import { useEffect, useRef } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import GlobalGameState from "../../model/GlobalGameState"

import Die from "./Die"
import "./modal.css"
import "./largemodal.css"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"

function getInfantryPanel() {
  let dieName1 = "dice1"
  let dieName2 = "dice2"

  return (
    <>
      <div
        style={{
          marginLeft: "100px",
        }}
      >
        <input
          type="image"
          src="/images/IJN-INFANTRY.jpg"
          style={{
            width: "90px",
            height: "70px",
            marginLeft: "-70px",
          }}
          id="bollocks"
        />
        <p
          style={{
            color: "white",
            fontSize: "14px",
            marginLeft: "-90px",
          }}
        >
          JAPAN INFANTRY FIRE
        </p>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "-130px" }}>
          <Die name={dieName1}></Die>
        </div>
        <p
          style={{
            marginTop: "15px",
            marginLeft: "-120px",
            color: "white",
          }}
        >
          MIDWAY INVASION LEVEL:&nbsp;
          <strong>{GlobalGameState.midwayInvasionLevel > 0 ? GlobalGameState.midwayInvasionLevel : "X"}</strong>&nbsp;
        </p>
      </div>
      <div
        style={{
          marginLeft: "200px",
        }}
      >
        <input
          type="image"
          src="/images/US-INFANTRY.jpg"
          style={{
            width: "90px",
            height: "70px",
            marginLeft: "-70px",
          }}
          id="bollocks"
        />
        <p
          style={{
            color: "white",
            fontSize: "14px",
            marginLeft: "-80px",
          }}
        >
          US GARRISON FIRE
        </p>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "-130px" }}>
          <Die name={dieName2}></Die>
        </div>
        <p
          style={{
            marginTop: "15px",
            marginLeft: "-120px",
            color: "white",
          }}
        >
          MIDWAY GARRISON LEVEL:&nbsp;<strong>{GlobalGameState.midwayGarrisonLevel > 0 ? GlobalGameState.midwayGarrisonLevel : "X"}</strong>&nbsp;
        </p>
      </div>
    </>
  )
}
function MidwayInvasionDicePanel(props) {
  const {
    controller,
    numDice,
    headerText,
    diceButtonDisabled,
    nextState,
    closeButtonDisabled,
    onHide,
    width,
    margin,
    showDice,
    side,
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

  const bg = "#0b2b14"
  const closey = closeButtonStr ?? "Close"

  let myBigBollocks = "m-width" + numDice

  if (width) {
    myBigBollocks = "m-width" + width
  }

  if (margin) {
    myBigMargin = margin
  }
  let lastRoller =
    GlobalGameState.nextMidwayInvasionRoll === GlobalUnitsModel.Side.JAPAN
      ? GlobalUnitsModel.Side.US
      : GlobalUnitsModel.Side.JAPAN

  let hitStr

  if (lastRoller === GlobalUnitsModel.Side.JAPAN) {
    if (GlobalGameState.midwayGarrisonLevel === 0) {
      hitStr = "(INVASION SUCCESFUL!)"
    } else {
      if (GlobalGameState.dieRolls[0] <= GlobalGameState.midwayInvasionLevel) {
        hitStr = "(HIT)"
      } else {
        hitStr = "(MISS)"
      }
    }
  }
  if (lastRoller === GlobalUnitsModel.Side.US) {
    if (GlobalGameState.midwayInvasionLevel === 0) {
      hitStr = "(INVASION FAILS!)"
    } else {
      if (GlobalGameState.dieRolls[0] <= GlobalGameState.midwayGarrisonLevel) {
        hitStr = "(HIT)"
      } else {
        hitStr = "(MISS)"
      }
    }
  }

  let firstRoller = "Midway Invasion. Japan Rolls First."
  if (GlobalGameState.semperFi) {
    firstRoller = "Midway Invasion. US Rolls First (Card #8 Semper Fi in effect)."
  }

  const diceButtonStr = "Roll Die"
  let nextRollStr =
    GlobalGameState.nextMidwayInvasionRoll === undefined
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalGameState.nextMidwayInvasionRoll

  const over = GlobalGameState.midwayGarrisonLevel === 0 || GlobalGameState.midwayInvasionLevel === 0

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
                marginLeft: "-50px",
              }}
            >
              {firstRoller}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {getInfantryPanel()}
          </div>
          {!over && (
            <p
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
              }}
            >
              <strong>{nextRollStr}</strong>&nbsp;To Roll...
            </p>
          )}
          {GlobalGameState.dieRolls.length !== 0 && (
            <p
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
              }}
            >
              LAST ROLL BY&nbsp;<strong>{lastRoller}</strong>&nbsp;:&nbsp;
              <strong>
                {GlobalGameState.dieRolls[0]}&nbsp;
                {hitStr}
              </strong>
              &nbsp;
            </p>
          )}
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

export default MidwayInvasionDicePanel
