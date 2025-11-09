import { useState, createRef, useEffect } from "react"
import Button from "react-bootstrap/Button"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import GlobalGameState from "../model/GlobalGameState"
import Controller from "../controller/Controller"
import { doDMCVDamage, doCarrierDamageRolls, autoAllocateDamage } from "../DiceHandler"

export function SubmarineDamagePanelHeaders({ controller, setDamagedCV, damagedCV, side, damageDone, hidden }) {
  const [elRefsCV, setElRefsCV] = useState([])

  let usEnterprise = {
    image: "/images/fleetcounters/enterprise.jpg",
    name: GlobalUnitsModel.Carrier.ENTERPRISE,
    buttonStr: "Enterprise",
    width: "100px",
  }
  let usHornet = {
    image: "/images/fleetcounters/hornet.jpg",
    name: GlobalUnitsModel.Carrier.HORNET,
    buttonStr: "Hornet",
    width: "100px",
    marginLeft: "3px",
  }
  let usYorktown = {
    image: "/images/fleetcounters/yorktown.jpg",
    name: GlobalUnitsModel.Carrier.YORKTOWN,
    buttonStr: "Yorktown",
    width: "100px",
    marginLeft: "3px",
  }
  let jpAkagi = {
    image: "/images/fleetcounters/akagi.jpg",
    name: GlobalUnitsModel.Carrier.AKAGI,
    buttonStr: "Akagi",
    width: "100px",
  }
  let jpkaga = {
    image: "/images/fleetcounters/kaga.jpg",
    name: GlobalUnitsModel.Carrier.KAGA,
    buttonStr: "Kaga",
    width: "100px",
    marginLeft: "3px",
  }
  let jpHiryu = {
    image: "/images/fleetcounters/hiryu.jpg",
    name: GlobalUnitsModel.Carrier.HIRYU,
    buttonStr: "Hiryu",
    width: "100px",
    marginLeft: "3px",
  }
  let jpSoryu = {
    image: "/images/fleetcounters/soryu.jpg",
    name: GlobalUnitsModel.Carrier.SORYU,
    buttonStr: "Soryu",
    width: "100px",
    marginLeft: "3px",
  }

  const createImage = (carrierName, damageBow, damageStern, sunk, i) => {
    let carrier
    let damageMarker = sunk ? "/images/markers/sunk.png" : "/images/markers/damage.png"
    let airImages

    const setAirCounters = (airUnit) => {
      const location = controller.getAirUnitLocation(airUnit.name)
      if (location.boxIndex === 0) {
        return (
          <div
            style={{
              position: "absolute",
              top: "28px",
              left: "40px",
            }}
          >
            <img
              style={{
                width: "40px",
                height: "40px",
              }}
              src={airUnit.image}
            ></img>
          </div>
        )
      }
      if (location.boxIndex === 1) {
        return (
          <div
            style={{
              position: "absolute",
              top: "90px",
              left: "40px",
            }}
          >
            <img
              style={{
                width: "40px",
                height: "40px",
              }}
              src={airUnit.image}
            ></img>
          </div>
        )
      }
    }
    if (carrierName === GlobalUnitsModel.Carrier.YORKTOWN) {
      carrier = usYorktown
      let airUnitsOnDeck = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_YORKTOWN_FLIGHT_DECK)
      airImages = airUnitsOnDeck.map((airUnit) => {
        return setAirCounters(airUnit)
      })
    } else if (carrierName === GlobalUnitsModel.Carrier.ENTERPRISE) {
      carrier = usEnterprise
      let airUnitsOnDeck = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK)
      airImages = airUnitsOnDeck.map((airUnit) => {
        return setAirCounters(airUnit)
      })
    } else if (carrierName === GlobalUnitsModel.Carrier.HORNET) {
      carrier = usHornet
      let airUnitsOnDeck = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK)
      airImages = airUnitsOnDeck.map((airUnit) => {
        return setAirCounters(airUnit)
      })
    } else if (carrierName === GlobalUnitsModel.Carrier.AKAGI) {
      let airUnitsOnDeck = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK)
      airImages = airUnitsOnDeck.map((airUnit) => {
        return setAirCounters(airUnit)
      })
      carrier = jpAkagi
    } else if (carrierName === GlobalUnitsModel.Carrier.KAGA) {
      let airUnitsOnDeck = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK)
      airImages = airUnitsOnDeck.map((airUnit) => {
        return setAirCounters(airUnit)
      })
      carrier = jpkaga
    } else if (carrierName === GlobalUnitsModel.Carrier.HIRYU) {
      let airUnitsOnDeck = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK)
      airImages = airUnitsOnDeck.map((airUnit) => {
        return setAirCounters(airUnit)
      })
      carrier = jpHiryu
    } else if (carrierName === GlobalUnitsModel.Carrier.SORYU) {
      let airUnitsOnDeck = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK)
      airImages = airUnitsOnDeck.map((airUnit) => {
        return setAirCounters(airUnit)
      })
      carrier = jpSoryu
    }
    return (
      <>
        <div
          style={{
            position: "relative",
          }}
        >
          <img
            src={carrier.image}
            style={{
              width: carrier.width,
              height: "200px",
              marginLeft: "10px",
              // marginRight: "40px",
            }}
          ></img>
          {airImages}
          {damageBow && (
            <div
              style={{
                position: "absolute",
                top: "28px",
                left: "40px",
              }}
            >
              <img
                style={{
                  width: "40px",
                  height: "40px",
                }}
                src={damageMarker}
              ></img>
            </div>
          )}
          {damageStern && (
            <div
              style={{
                position: "absolute",
                top: "90px",
                left: "40px",
              }}
            >
              <img
                style={{
                  width: "40px",
                  height: "40px",
                }}
                src={damageMarker}
              ></img>
            </div>
          )}
          <div
            style={{
              marginLeft: "10px",
              marginTop: "15px",
              display: "flex",
              position: "relative",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
            }}
          >
            <Button
              ref={elRefsCV[i]}
              hidden={hidden}
              disabled={damagedCV !== "" || sunk}
              onClick={() => handleClick(carrierName)}
            >
              {carrierName}
            </Button>
          </div>
        </div>
      </>
    )
  }

  const sideBeingAttacked = side === GlobalUnitsModel.Side.US ? GlobalUnitsModel.Side.JAPAN : GlobalUnitsModel.Side.US

  const anyTargets = controller.anyTargets(sideBeingAttacked)
  if (!anyTargets) {
    setDamagedCV("NO TARGETS")
  }

  const excludeSunk = !damageDone

  let allCarriers = controller.getAllCarriersForSide(sideBeingAttacked, excludeSunk)
  const arrLength = allCarriers.length
  useEffect(() => {
    // add or remove refs
    setElRefsCV((elRefsCV) =>
      Array(arrLength)
        .fill()
        .map((_, i) => elRefsCV[i] || createRef())
    )
  }, [])

  useEffect(() => {
    if (GlobalGameState.testCarrierSelection === -1) {
      return
    }
    const myRef = elRefsCV[GlobalGameState.testCarrierSelection]
    if (myRef !== undefined && myRef.current !== undefined && myRef.current !== null) {
      myRef.current.click(myRef.current)
    }
  }, [GlobalGameState.testCarrierSelection])
  const handleClick = (carrierName) => {
    setDamagedCV(carrierName)
  }

  const cvImages = allCarriers.map((cv, i) => {
    if (cv.name === GlobalUnitsModel.Carrier.MIDWAY) {
      return <></>
    }

    const carrierSternDamaged = controller.getCarrierSternDamaged(cv.name)
    const carrierBowDamaged = controller.getCarrierBowDamaged(cv.name)
    const sunk = controller.isSunk(cv.name, true)
    return (
      <>
        <div>{createImage(cv.name, carrierBowDamaged, carrierSternDamaged, sunk, i)}</div>
      </>
    )
  })
  let targetMsg = ""
  if (damagedCV !== "") {
    targetMsg = "Target Selected:"
  }
  let msg = "Choose CV - Score a hit on roll of 1"

  if (side === GlobalUnitsModel.Side.JAPAN) {
    msg = "Choose CV - Score a hit on roll of 1-4"
  } else {
    if (GlobalGameState.usPlayerType === GlobalUnitsModel.TYPE.AI) {
      msg = "US Chooses CV - Scores a hit on roll of 1"
    }
  }

  return (
    <div
      style={{
        minHeight: "400px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <p></p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <p>{msg}</p>
      </div>
      {anyTargets && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            marginTop: "50px",
          }}
        >
          {cvImages}
        </div>
      )}
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
          {targetMsg} &nbsp;<strong>{damagedCV}</strong>&nbsp;
        </p>
      </div>
    </div>
  )
}

export function SubmarineDamagePanelFooters({
  controller,
  damagedCV,
  side,
  setDamageMarkerUpdate,
  setDamageDone,
  damageDone,
  setDmcvShipMarkerUpdate,
  sendDamageUpdates,
  sendDMCVUpdate,
  setFleetUnitUpdate,
}) {
  if (damagedCV === "" || GlobalGameState.dieRolls.length === 0) {
    if (damageDone) {
      setDamageDone(false)
    }
    return
  }

  const doAutoDamage = async () => {
    GlobalGameState.carrierAttackHits = 0 // this causes NON firing in the CarrierDamagePanel
    GlobalGameState.sideWithInitiative = side

    if (damagedCV === GlobalGameState.usDMCVCarrier || damagedCV === GlobalGameState.jpDMCVCarrier) {
      const sideBeingAttacked =
        side === GlobalUnitsModel.Side.US ? GlobalUnitsModel.Side.JAPAN : GlobalUnitsModel.Side.US

      await doDMCVDamage(
        controller,
        sendDamageUpdates,
        sendDMCVUpdate,
        setDamageMarkerUpdate,
        setDmcvShipMarkerUpdate,
        setFleetUnitUpdate,
        sideBeingAttacked
      )
      if (sideBeingAttacked === GlobalUnitsModel.Side.US) {
        GlobalGameState.usDMCVCarrier = undefined
      } else {
        GlobalGameState.jpDMCVCarrier = undefined
      }
    } else {
      const damage = autoAllocateDamage(controller, 1)
      sendDamageUpdates(controller, damage, setDamageMarkerUpdate)
    }

    // this logs the die roll
    controller.viewEventHandler({
      type: Controller.EventTypes.SUBMARINE_ATTACK_ROLL,
      data: {
        target: GlobalGameState.currentCarrierAttackTarget,
        side,
        roll: GlobalGameState.dieRolls[0],
        damage: GlobalGameState.damageThisAttack,
      },
    })
  }

  const allocateDamage = (box) => {
    let oneOrZero = Math.random() >= 0.5 ? 1 : 0
    if (oneOrZero === 0) {
      box = "BOW"
    } else {
      box = "STERN"
    }

    GlobalGameState.currentCarrierAttackTarget = damagedCV
    let damage
    GlobalGameState.sideWithInitiative = side
    if (box === "BOW") {
      damage = doCarrierDamageRolls(controller, 1)
    } else {
      damage = doCarrierDamageRolls(controller, 4)
    }
    setDamageDone(true)
    sendDamageUpdates(controller, damage, setDamageMarkerUpdate)

    controller.viewEventHandler({
      type: Controller.EventTypes.SUBMARINE_ATTACK_ROLL,
      data: {
        target: GlobalGameState.currentCarrierAttackTarget,
        side,
        roll: GlobalGameState.dieRolls[0],
        damage: GlobalGameState.damageThisAttack,
      },
    })
  }
  // QUACK FOR TESTING ONLY
  // GlobalGameState.dieRolls = [1]

  let success = side === GlobalUnitsModel.Side.US ? GlobalGameState.dieRolls[0] <= 1 : GlobalGameState.dieRolls[0] <= 4
  const message1 = success
    ? side + " Die Roll Successful! One hit assigned to " + damagedCV
    : side + " Die Roll Unsuccessful!"

  const carrier = controller.getCarrier(damagedCV)

  let undamagedCarrier = carrier.hits === 0
  // if damagedCV is currently undamaged - select box to hit
  // otherwise autoallocate damage as in the case of air attack
  if (success && !damageDone) {
    GlobalGameState.currentCarrierAttackTarget = damagedCV
    if (carrier.hits > 0) {
      doAutoDamage({
        sendDamageUpdates,
        sendDMCVUpdate,
        setDamageMarkerUpdate,
        setDmcvShipMarkerUpdate,
        setFleetUnitUpdate,
      })
      setDamageDone(true)
    }
  } else if (!damageDone) {
    setDamageDone(true)
  }
  let str = ""
  undamagedCarrier = carrier.hits === 0 && success

  if (success && undamagedCarrier) {
    // str = "Select Box to Assign Hit"
    allocateDamage()
  }

  return (
    <>
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
          {message1}
        </p>
      </div>
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
          {str}
        </p>
      </div>
      {/* {undamagedCarrier && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          <Button
            style={{
              marginRight: "10px",
            }}
            onClick={() => allocateDamage("BOW")}
          >
            BOW BOX
          </Button>
          <Button
            style={{
              marginLeft: "10px",
            }}
            onClick={() => allocateDamage("STERN")}
          >
            STERN BOX
          </Button>
        </div>
      )} */}
    </>
  )
}
