import { React } from "react"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import GlobalGameState from "../model/GlobalGameState"

export function AAAHeaders({ numDice }) {
  const diceMsg = `Roll ${numDice} dice. Each "1" rolled is a hit`

  let tfUnderAttack

  if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.CARRIER_DIV_1) {
    tfUnderAttack = {
      image: "/images/fleetcounters/cardiv1.jpg",
      name: GlobalUnitsModel.TaskForce.CARRIER_DIV_1,
      width: "200px",
    }
  } else if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.CARRIER_DIV_2) {
    tfUnderAttack = {
      image: "/images/fleetcounters/cardiv2.jpg",
      name: GlobalUnitsModel.TaskForce.CARRIER_DIV_2,
      width: "200px",
    }
  } else if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.TASK_FORCE_16) {
    tfUnderAttack = {
      image: "/images/fleetcounters/TF16.jpg",
      name: GlobalUnitsModel.TaskForce.TASK_FORCE_16,
      width: "200px",
    }
  } else if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.TASK_FORCE_17) {
    tfUnderAttack = {
      image: "/images/fleetcounters/TF17.jpg",
      name: GlobalUnitsModel.TaskForce.TASK_FORCE_17,
      width: "100px",
    }
  } else if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIDWAY) {
    tfUnderAttack = {
      image: "/images/fleetcounters/midway.jpg",
      name: GlobalUnitsModel.TaskForce.MIDWAY,
      width: "200px",
    }
  } else if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.US_DMCV) {
    tfUnderAttack = {
      image: "/images/fleetcounters/US-DMCV.png",
      name: GlobalUnitsModel.TaskForce.US_DMCV,
      width: "200px",
    }
  } else if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.JAPAN_DMCV) {
    tfUnderAttack = {
      image: "/images/fleetcounters/Japan-DMCV.png",
      name: GlobalUnitsModel.TaskForce.JAPAN_DMCV,
      width: "200px",
    }
  } else if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIF) {
    tfUnderAttack = {
      image: "/images/fleetcounters/MIF.png",
      name: GlobalUnitsModel.TaskForce.MIF,
      width: "200px",
    }
  }
  const msg = `TF Under Attack:`

  return (
    <div>
      <div>
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          {msg} &nbsp;<strong>{GlobalGameState.taskForceTarget}</strong>&nbsp;
        </p>
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          {diceMsg}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={tfUnderAttack.image}
            style={{
              width: tfUnderAttack.width,
              height: "200px",
              marginLeft: "40px",
              marginRight: "45px",
              marginBottom: "20px",
            }}
          />
        </div>
      </div>
    </div>
  )
}

export function AAAFooters() {
  const show = GlobalGameState.dieRolls.length > 0

  const msg = "Number of Hits:"
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
            {msg} &nbsp;<strong>{GlobalGameState.antiaircraftHits}</strong>&nbsp;
          </p>
        </div>
      )}
    </>
  )
}
