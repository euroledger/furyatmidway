import { React, useState } from "react"
import Button from "react-bootstrap/Button"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import GlobalGameState from "../model/GlobalGameState"
import { sendDamageUpdates, autoAllocateDamage, doCarrierDamageRolls } from "../DiceHandler"

export function SeaBattleDamagePanelHeaders({
  controller,
  damagedCV,
  setDamagedCV,
  setDamageMarkerUpdate,
  setSeaBattleDamageDone,
  seaBattleDamageDone,
  jpFleet,
}) {
  const [carriersSunk, setCarriersSunk] = useState([])

  const mifMsg =
    GlobalGameState.usSeaBattleHits > 0 ? "Midway Invasion Force Reduced by " + GlobalGameState.usSeaBattleHits : ""

  const mif = jpFleet === "MIF-USMAP"
  let jpImage = "/images/fleetcounters/MIF.png"

  let usEnterprise = {
    image: "/images/fleetcounters/enterprise.jpg",
    name: GlobalUnitsModel.Carrier.ENTERPRISE,
    buttonStr: "Enterprise",
    width: "95px",
  }
  let usHornet = {
    image: "/images/fleetcounters/hornet.jpg",
    name: GlobalUnitsModel.Carrier.HORNET,
    buttonStr: "Hornet",
    width: "95px",
  }
  let usYorktown = {
    image: "/images/fleetcounters/yorktown.jpg",
    name: GlobalUnitsModel.Carrier.YORKTOWN,
    buttonStr: "Yorktown",
    width: "95px",
  }
  let jpAkagi = {
    image: "/images/fleetcounters/akagi.jpg",
    name: GlobalUnitsModel.Carrier.AKAGI,
    buttonStr: "Akagi",
    width: "95px",
  }
  let jpkaga = {
    image: "/images/fleetcounters/kaga.jpg",
    name: GlobalUnitsModel.Carrier.KAGA,
    buttonStr: "Kaga",
    width: "95px",
  }
  let jpHiryu = {
    image: "/images/fleetcounters/hiryu.jpg",
    name: GlobalUnitsModel.Carrier.HIRYU,
    buttonStr: "Hiryu",
    width: "95px",
  }
  let jpSoryu = {
    image: "/images/fleetcounters/soryu.jpg",
    name: GlobalUnitsModel.Carrier.SORYU,
    buttonStr: "Soryu",
    width: "95px",
  }

  const createImage = (carrierName, damageBow, damageStern, sunk, hitsLeft) => {
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
              left: "37px",
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
              left: "37px",
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
            }}
          ></img>
          {airImages}
          {damageBow && (
            <div
              style={{
                position: "absolute",
                top: "28px",
                left: "37px",
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
                left: "37px",
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
            <Button disabled={sunk || hitsLeft === 0} onClick={() => handleClick(carrierName)}>
              {carrierName}
            </Button>
          </div>
        </div>
      </>
    )
  }

  let allCarriersJP = new Array()
  allCarriersJP = controller.getAllCarriersForSide(GlobalUnitsModel.Side.US, false)
  allCarriersJP = allCarriersJP.filter(
    (carrier) => !carrier.dmcv && (!controller.isSunk(carrier.name) || carriersSunk.includes(carrier.name))
  )

  let allCarriersUS = new Array()
  allCarriersUS = controller.getAllCarriersForSide(GlobalUnitsModel.Side.JAPAN, false)
  allCarriersUS = allCarriersUS.filter(
    (carrier) => !carrier.dmcv && (!controller.isSunk(carrier.name) || carriersSunk.includes(carrier.name))
  )
  
  const doAutoDamage = (carrier, side) => {
    GlobalGameState.carrierAttackHits = 0 // this causes NON firing in the CarrierDamagePanel
    GlobalGameState.sideWithInitiative =
      side === GlobalUnitsModel.Side.JAPAN ? GlobalUnitsModel.Side.US : GlobalUnitsModel.Side.JAPAN

    GlobalGameState.currentCarrierAttackTarget = carrier

    // ---- THIS IS DUPLICATE CODE, SEE CarrierDamageDicePanel NEEDS REFACRING QUACK TODO ---
    const damage = autoAllocateDamage(controller, 1)
    sendDamageUpdates(controller, damage, setDamageMarkerUpdate)

    if (damage.sunk) {
      setCarriersSunk([...carriersSunk, carrier])
    }
    // if (damage.sunk) {
    //   const sideBeingAttacked =
    //     side === GlobalUnitsModel.Side.US ? GlobalUnitsModel.Side.JAPAN : GlobalUnitsModel.Side.US

    //   sendDMCVUpdate(controller, GlobalGameState.currentCarrierAttackTarget, setDmcvShipMarkerUpdate, sideBeingAttacked)
    // }
    // ---- END ---

    // this logs the damage allocation
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

  const calculateHitsLeftOnCarriers = (side) => {
    let allCarriers = controller.getAllCarriersForSide(side, true)

    allCarriers = allCarriers.filter((carrier) => !carrier.dmcv)

    const hitsLeft = allCarriers.reduce(function (acc, carrier) {
      return acc + (3 - carrier.hits)
    }, 0)
    return hitsLeft
  }

  const allocateDamage = (box, carrier) => {
    GlobalGameState.currentCarrierAttackTarget = carrier.name
    let damage
    GlobalGameState.sideWithInitiative =
      carrier.side === GlobalUnitsModel.Side.JAPAN ? GlobalUnitsModel.Side.US : GlobalUnitsModel.Side.JAPAN
    if (box === "BOW") {
      damage = doCarrierDamageRolls(controller, 1)
    } else {
      damage = doCarrierDamageRolls(controller, 4)
    }
    sendDamageUpdates(controller, damage, setDamageMarkerUpdate)

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
  let targetMsg = ""

  const hlJapan = calculateHitsLeftOnCarriers(GlobalUnitsModel.Side.JAPAN)
  const hlUS = calculateHitsLeftOnCarriers(GlobalUnitsModel.Side.US)
  const japanDone =
    GlobalGameState.usSeaBattleHits === 0 || (hlJapan === 0 && hlJapan < GlobalGameState.usSeaBattleHits)
  const usDone = GlobalGameState.jpSeaBattleHits === 0 || (hlUS === 0 && hlUS < GlobalGameState.jpSeaBattleHits)
  if (mif && usDone) {
    GlobalGameState.midwayInvasionLevel -= GlobalGameState.usSeaBattleHits
    setSeaBattleDamageDone(true)
  }
  if (japanDone && usDone) {
    setSeaBattleDamageDone(true)
  }
  
  const handleClick = (carrierName) => {
    const carrier = controller.getCarrier(carrierName)
    setDamagedCV(() => carrier.name)
    if (carrier.side === GlobalUnitsModel.Side.JAPAN) {
      GlobalGameState.usSeaBattleHits--
    } else {
      GlobalGameState.jpSeaBattleHits--
    }
    // allocate 1 hit to this carrier
    GlobalGameState.currentCarrierAttackTarget = carrierName
    if (carrier.hits > 0) {
      doAutoDamage(carrierName, carrier.side)
    } else {
      // undamaged carrier, player chooses bow or stern (should it be random?)
      let bowOrStern = Math.random() >= 0.5 ? "BOW" : "STERN"
      allocateDamage(bowOrStern, carrier)
    }
    const hlJapan = calculateHitsLeftOnCarriers(GlobalUnitsModel.Side.JAPAN)
    const hlUS = calculateHitsLeftOnCarriers(GlobalUnitsModel.Side.US)

    const japanDone =
      GlobalGameState.usSeaBattleHits === 0 || (hlJapan === 0 && hlJapan < GlobalGameState.usSeaBattleHits)
    const usDone = GlobalGameState.jpSeaBattleHits === 0 || (hlUS === 0 && hlUS < GlobalGameState.jpSeaBattleHits)

    if (mif && usDone) {
      GlobalGameState.midwayInvasionLevel -= GlobalGameState.usSeaBattleHits
      setSeaBattleDamageDone(true)
    }
    if (japanDone && usDone) {
      setSeaBattleDamageDone(true)
    }
  }

  const cvImagesUS = allCarriersJP.map((cv, idx) => {
    const carrierSternDamaged = controller.getCarrierSternDamaged(cv.name)
    const carrierBowDamaged = controller.getCarrierBowDamaged(cv.name)
    const sunk = controller.isSunk(cv.name, true)
    const hitsLeft =
      cv.side === GlobalUnitsModel.Side.JAPAN ? GlobalGameState.usSeaBattleHits : GlobalGameState.jpSeaBattleHits
    return (
      <>
        <div style={{}}>{createImage(cv.name, carrierBowDamaged, carrierSternDamaged, sunk, hitsLeft)}</div>
      </>
    )
  })
  const cvImagesJP = allCarriersUS.map((cv, idx) => {
    const carrierSternDamaged = controller.getCarrierSternDamaged(cv.name)
    const carrierBowDamaged = controller.getCarrierBowDamaged(cv.name)
    const sunk = controller.isSunk(cv.name, true)
    const hitsLeft =
      cv.side === GlobalUnitsModel.Side.JAPAN ? GlobalGameState.usSeaBattleHits : GlobalGameState.jpSeaBattleHits
    return (
      <>
        <div style={{}}>{createImage(cv.name, carrierBowDamaged, carrierSternDamaged, sunk, hitsLeft)}</div>
      </>
    )
  })
  if (damagedCV !== "") {
    targetMsg = "1 Hit Allocated to"
  }
  // let msg = "Choose CV - Score a hit on roll of 1"
  // if (side === GlobalUnitsModel.Side.JAPAN) {
  //   msg = "Choose CV - Score a hit on roll of 1-4"
  // }

  return (
    <div
      style={{
        minHeight: "400px",
        marginLeft: "-30px",
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
        <p>
          Remaining Hits to Allocate to US CVs:&nbsp;<strong>{GlobalGameState.jpSeaBattleHits}</strong>
        </p>
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
          Remaining Hits to Allocate to IJN CVs:&nbsp;<strong>{GlobalGameState.usSeaBattleHits}</strong>
        </p>
      </div>
      {mif && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            marginTop: "20px",
          }}
        >
          <img
            src={jpImage}
            style={{
              width: "160px",
              height: "160px",
              marginTop: "-30px",
              marginLeft: "15px",
              marginRight: "185px",
            }}
          />
          {cvImagesUS}
        </div>
      )}
      {!mif && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            marginTop: "20px",
          }}
        >
          {cvImagesJP}
          {cvImagesUS}
        </div>
      )}
      <div
        style={{
          marginTop: "20px",
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
      {seaBattleDamageDone && (
        <div
          style={{
            marginTop: "20px",
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
            All Hits Allocated. Click&nbsp;<strong>Close</strong>&nbsp;to continue
          </p>
          {mif && (
            <p
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
              }}
            >
              {mifMsg}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export function SeaBattleDamagePanelFooters(
  {
    //   controller,
    //   damagedCV,
    //   side,
    //   setDamageMarkerUpdate,
    //   setseaBattleDamageDone,
    //   seaBattleDamageDone,
    //   setDmcvShipMarkerUpdate
  }
) {}
