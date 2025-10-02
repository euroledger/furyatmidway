import GlobalGameState from "../model/GlobalGameState"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import { doDMCVFleetDamage } from "../DiceHandler"

export function SeaBattleHeaders({ showSeaBattleDice, jpFleet, usFleet }) {
  let jpImage = "/images/fleetcounters/MIF.png"
  let usImage = "/images/fleetcounters/csf.png"

  if (usFleet === "US-DMCV") {
    usImage = "/images/fleetcounters/US-DMCV.png"
  }
  if (jpFleet === "IJN-DMCV-USMAP") {
    jpImage = "/images/fleetcounters/Japan-DMCV.png"
  }
  if (jpFleet === "1AF-USMAP") {
    jpImage = "/images/fleetcounters/1AF.png"
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <img
          src="/images/japanflag.jpg"
          style={{
            width: "100px",
            height: "60px",
            marginLeft: "-5px",
            marginRight: "55px",
          }}
        />
        <img
          src={jpImage}
          style={{
            width: "60px",
            height: "60px",
            marginTop: "30px",
            marginLeft: "15px",
            marginRight: "45px",
          }}
        />
        {showSeaBattleDice && (
          <p
            style={{
              marginLeft: "-4px",
              marginTop: "10px",
              color: "white",
            }}
          >
            Japan Die Roll
          </p>
        )}
      </div>
      <div>
        <img
          src="/images/usaflag.jpg"
          style={{
            width: "100px",
            height: "60px",
            marginRight: "14px",
          }}
        />
        <img
          src={usImage}
          style={{
            width: "60px",
            height: "60px",
            marginTop: "30px",
            marginLeft: "15px",
            marginRight: "45px",
          }}
        />
        {showSeaBattleDice && (
          <p
            style={{
              marginLeft: "10px",
              marginTop: "10px",

              color: "white",
            }}
          >
            US Die Roll
          </p>
        )}
      </div>
    </div>
  )
}

export function SeaBattleFooters({
  controller,
  jpFleet,
  usFleet,
  sendDamageUpdates,
  sendDMCVUpdate,
  setDamageMarkerUpdate,
  setDmcvShipMarkerUpdate,
  setDamageDone,
  damageDone,
}) {
  // show the footer panel if:
  //  1. either fleet is a DMCV fleet (no die roll), or
  //  2. die roll made

  const dmcvFleet = jpFleet.includes("DMCV") || usFleet.includes("DMCV")
  const dieRollsMade = GlobalGameState.dieRolls.length > 0

  let show1, show2
  let jpElimMsg1, usElimMsg1

  let done = false
  let jpDieMsg,
    usDieMsg,
    jpHitsMsg = " ",
    usHitsMsg = " "
  if (dieRollsMade) {
    jpDieMsg = `Japan Die Roll: `
    usDieMsg = `US Die Roll: `
    GlobalGameState.jpSeaBattleHits = Math.max(0, GlobalGameState.dieRolls[0] - 2)
    // GlobalGameState.jpSeaBattleHits = 0 // QUACK TESTING ONLY

    GlobalGameState.usSeaBattleHits = Math.max(0, GlobalGameState.dieRolls[1] - 4)
    // GlobalGameState.usSeaBattleHits = 2 // QUACK TESTING ONLY

    // QUACK FOR TESTING
    // GlobalGameState.jpSeaBattleHits = 2
    // GlobalGameState.usSeaBattleHits = 0
  }
  if (usFleet.includes("DMCV")) {
    show2 = true
    usElimMsg1 = `US DMCV Fleet eliminated`
    done = true
    // ---- END ---

    // this logs the event
    // controller.viewEventHandler({
    //   type: Controller.EventTypes.SUBMARINE_ATTACK_ROLL,
    //   data: {
    //     target: GlobalGameState.currentCarrierAttackTarget,
    //     side,
    //     roll: GlobalGameState.dieRolls[0],
    //     damage: GlobalGameState.damageThisAttack,
    //   },
    // })
  }

  if (jpFleet.includes("DMCV")) {
    show1 = true
    jpElimMsg1 = `IJN DMCV Fleet eliminated`
    done = true
  }

  if (done) {
    if (!damageDone) {
      doDMCVFleetDamage(
        show1,
        show2,
        controller,
        sendDamageUpdates,
        sendDMCVUpdate,
        setDamageMarkerUpdate,
        setDmcvShipMarkerUpdate,
        setDamageDone
      )
    }
  }
  if (dieRollsMade) {
    setDamageDone(true)
  }

  return (
    <>
      {dieRollsMade && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "15px",
            }}
          >
            <div
              style={{
                color: "white",
              }}
            >
              <p>{jpElimMsg1}</p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "-25px",
              color: "white",
            }}
          >
            <div>
              <p>
                {jpDieMsg} &nbsp;<strong>{GlobalGameState.dieRolls[0]}&nbsp;</strong>&nbsp;Hits:{jpHitsMsg}&nbsp;
                <strong>{GlobalGameState.jpSeaBattleHits}</strong>&nbsp;
              </p>
              <br></br>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              marginTop: "-15px",
            }}
          >
            <div>
              <p>
                {usDieMsg} &nbsp;<strong>{GlobalGameState.dieRolls[1]}&nbsp;</strong>&nbsp;Hits:{usHitsMsg}&nbsp;
                <strong>{GlobalGameState.usSeaBattleHits}</strong>&nbsp;
              </p>
              <br></br>
            </div>
          </div>
        </>
      )}
      {show1 && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "15px",
            }}
          >
            <div
              style={{
                color: "white",
              }}
            >
              <p>{jpElimMsg1}</p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "-15px",
              color: "white",
            }}
          >
            <div>
              <p>
                Carrier &nbsp;<strong>{GlobalGameState.jpDMCVCarrier}</strong>&nbsp; is sunk
              </p>
            </div>
          </div>
        </>
      )}
      {show2 && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "15px",
            }}
          >
            <div
              style={{
                color: "white",
              }}
            >
              <p>{usElimMsg1}</p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "-15px",
              color: "white",
            }}
          >
            <div>
              <p>
                Carrier &nbsp;<strong>{GlobalGameState.usDMCVCarrier}</strong>&nbsp; is sunk
              </p>
            </div>
          </div>
        </>
      )}
    </>
  )
}
