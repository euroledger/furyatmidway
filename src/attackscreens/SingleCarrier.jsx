import { React } from "react"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import GlobalGameState from "../model/GlobalGameState"
import "./attackpanel.css"

export function SingleCarrier({ controller }) {

  let jpAkagi = {
    image: "/images/fleetcounters/akagi.jpg",
    name: GlobalUnitsModel.Carrier.AKAGI,
    buttonStr: "Akagi",
    width: "100px",
  }
  let jpKaga = {
    image: "/images/fleetcounters/kaga.jpg",
    name: GlobalUnitsModel.Carrier.KAGA,
    buttonStr: "Kaga",
    width: "100px",
    marginLeft: "45px",
  }
  let jpHiryu = {
    image: "/images/fleetcounters/hiryu.jpg",
    name: GlobalUnitsModel.Carrier.HIRYU,
    buttonStr: "Hiryu",
    width: "100px",
  }
  let jpSoryu = {
    image: "/images/fleetcounters/soryu.jpg",
    name: GlobalUnitsModel.Carrier.SORYU,
    buttonStr: "Soryu",
    width: "100px",
    marginLeft: "45px",
  }
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
  let usMidway = {
    image: "/images/fleetcounters/midway.jpg",
    name: GlobalUnitsModel.Carrier.MIDWAY,
    buttonStr: "Midway",
    width: "200px",
    marginLeft: "-130px",
  }

  let carrierTarget
  let marginL = ""
  console.log("CURRENT CARRIER ATTACK TARGET=", GlobalGameState.currentCarrierAttackTarget)
  if (GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.Carrier.AKAGI) {
    carrierTarget = jpAkagi
  } else if (GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.Carrier.KAGA) {
    carrierTarget = jpKaga
  } else if (GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.Carrier.HIRYU) {
    carrierTarget = jpHiryu
  } else if (GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.Carrier.SORYU) {
    carrierTarget = jpSoryu
  } else if (GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.Carrier.ENTERPRISE) {
    carrierTarget = usEnterprise
  } else if (GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.Carrier.HORNET) {
    carrierTarget = usHornet
  } else if (GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.Carrier.YORKTOWN) {
    carrierTarget = usYorktown
  } else if (GlobalGameState.currentCarrierAttackTarget === GlobalUnitsModel.Carrier.MIDWAY) {
    carrierTarget = usMidway
    marginL = "-60px"
  } 

  const createImage = (image, left, top) => {
    return (
      <img
        src={image}
        style={{
          width: "40px",
          height: "40px",
          position: "absolute",
          marginTop: top,
          marginLeft: "-73px",
        }}
      ></img>
    )
  }
  let airUnitsOnDeckCarrier1, airUnitsOnDeckCarrier2
  if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.CARRIER_DIV_1) {
    airUnitsOnDeckCarrier1 = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK)
    airUnitsOnDeckCarrier2 = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK)
  }
  if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.CARRIER_DIV_2) {
    airUnitsOnDeckCarrier1 = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK)
    airUnitsOnDeckCarrier2 = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK)
  }
  if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.TASK_FORCE_16) {
    airUnitsOnDeckCarrier1 = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK)
    airUnitsOnDeckCarrier2 = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK)
  } else if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.TASK_FORCE_17) {
    airUnitsOnDeckCarrier1 = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_YORKTOWN_FLIGHT_DECK)
  } else if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.MIDWAY) {
    airUnitsOnDeckCarrier1 = [] // no Midway Flight Deck
  }
  const airUnitsCarrier1 = airUnitsOnDeckCarrier1.map((airUnit) => {
    const location = controller.getAirUnitLocation(airUnit.name)
    // const top = "" + (48 + location.boxIndex * 17.5) + "%"

    // const top = "" + (-8 + location.boxIndex * -66) + "px"
    const top = "" + (-74 + location.boxIndex * 66) + "px"
    return <div>{createImage(airUnit.image, "25.2%", top)}</div>
  })

  const carrier1SternDamaged = controller.getCarrierSternDamaged(carrierTarget.name)
  const carrier1BowDamaged = controller.getCarrierBowDamaged(carrierTarget.name)

  const carrier1Sunk = controller.isSunk(carrierTarget.name)
  const damageMarker = "/images/markers/damage.png"
  const sunkMarker = "/images/markers/sunk.png"

  let c1bowDamage, c1sternDamage

  if (carrier1BowDamaged) {
    c1bowDamage = <div>{createImage(damageMarker, "49.1%", "-74px")}</div>
  }
  if (carrier1SternDamaged) {
    c1sternDamage = <div>{createImage(damageMarker, "49.1%", "-8px")}</div>
  }

  if (carrier1Sunk) {
    c1bowDamage = <div>{createImage(sunkMarker, "49.1%", "-74px")}</div>
    c1sternDamage = <div>{createImage(sunkMarker, "49.1%", "-8px")}</div>
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
          marginLeft: marginL
        }}
      >
        <div>
          <img
            src={carrierTarget.image}
            style={{
              width: carrierTarget.width,
              height: "200px",
            }}
          />
        </div>
        {airUnitsCarrier1}
        {c1bowDamage}
        {c1sternDamage}
      </div>
    </>
  )
}
