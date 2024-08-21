import { React, useState } from "react"
import Button from "react-bootstrap/Button"
import GlobalUnitsModel from "./model/GlobalUnitsModel"
import GlobalGameState from "./model/GlobalGameState"

export function TargetHeaders({ setTargetSelected }) {
  const [buttonsDisabled, setButtonsDisabled] = useState(false)
  const [myTarget, setMyTarget] = useState("")
  const handleClick = (target) => {
    GlobalGameState.airAttackTarget = target
    setTargetSelected(true)
    setButtonsDisabled(true)
    setMyTarget(target)
  }

  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US
  const display = buttonsDisabled ? "flex" : "none"

  const message1 = "Target Selected: "
  const message2 = " Roll die to determine if target selection successful"
  const message3 = sideBeingAttacked === GlobalUnitsModel.Side.JAPAN ? "(1-5 success, 6 fail)" : "(1-3 success, 4-6 fail)"

  let jpTf1 = {
    image: "/images/fleetcounters/cardiv1.jpg",
    name: GlobalUnitsModel.TaskForce.CARRIER_DIV_1,
    buttonStr: "IJN CarDiv1",
    width: "200px",
  }
  let jpTf2 = {
    image: "/images/fleetcounters/cardiv2.jpg",
    name: GlobalUnitsModel.TaskForce.CARRIER_DIV_2,
    buttonStr: "IJN CarDiv2",
    width: "200px",
    marginLeft: "45px",
  }
  let usTf1 = {
    image: "/images/fleetcounters/TF16.jpg",
    name: GlobalUnitsModel.TaskForce.TASK_FORCE_16,
    buttonStr: "USN TF16",
    width: "200px",
  }
  let usTf2 = {
    image: "/images/fleetcounters/TF17.jpg",
    name: GlobalUnitsModel.TaskForce.TASK_FORCE_17,
    buttonStr: "USN TF17",
    width: "100px",
    marginLeft: "3px",
  }

  const tf1 = sideBeingAttacked === GlobalUnitsModel.Side.JAPAN ? jpTf1 : usTf1
  const tf2 = sideBeingAttacked === GlobalUnitsModel.Side.JAPAN ? jpTf2 : usTf2
  return (
    <div
      style={{
        marginLeft: "-28px",
      }}
    >
      <p
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        Select a target to attack
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <img
            src={tf1.image}
            style={{
              width: tf1.width,
              height: "200px",
              marginLeft: "-25px",
              marginRight: "45px",
            }}
          />
          <p
            style={{
              marginTop: "10px",
              marginLeft: "25px",
            }}
          >
            <Button disabled={buttonsDisabled} onClick={() => handleClick(tf1.name)}>
              {tf1.buttonStr}
            </Button>
          </p>
        </div>
        <div>
          <img
            src={tf2.image}
            style={{
              width: tf2.width,
              height: "200px",
              marginRight: "14px",
            }}
          />
          <p
            style={{
              marginTop: "10px",
              marginLeft: tf2.marginLeft,
            }}
          >
            <Button disabled={buttonsDisabled} onClick={() => handleClick(tf2.name)}>
              {tf2.buttonStr}
            </Button>
          </p>
        </div>
      </div>
      <p
        style={{
          display: display,
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        {message1} &nbsp;<strong>{myTarget}</strong>&nbsp;
      </p>
      <p
        style={{
          display: display,
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        {message2}&nbsp;{message3}
      </p>
    </div>
  )
}

export function TargetFooters() {
  const show = GlobalGameState.dieRolls > 0

  const msg = "Target Determined For Air Attack:"
  return (
    <>
      {show && (
        <div
          style={{
            marginTop: "10px",
            marginLeft: "-28px",
          }}
        >
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
            }}
          >
            {msg} &nbsp;<strong>{GlobalGameState.airAttackTarget}</strong>&nbsp;
          </p>
        </div>
      )}
    </>
  )
}
