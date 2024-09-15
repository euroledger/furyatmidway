import { React } from "react"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import GlobalGameState from "../model/GlobalGameState"
import "./attackpanel.css"

export function CarrierTarget({ controller, handleDragEnter }) {
  const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US

  const dropClass =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.JAPAN
      ? `drag-drop-zone-small2 bg-japan2`
      : "drag-drop-zone-small2 bg-us2"
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

  let carrier1 = jpAkagi
  let carrier2 = jpKaga
  if (sideBeingAttacked === GlobalUnitsModel.Side.JAPAN) {
    if (GlobalGameState.taskForceTarget === GlobalUnitsModel.TaskForce.CARRIER_DIV_2) {
      carrier1 = jpHiryu
      carrier2 = jpSoryu
    }
  } else {
    carrier1 = usEnterprise
    carrier2 = usHornet
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
  }

  const createImage = (image, left, top) => {
    return (
      <img
        src={image}
        style={{
          width: "40px",
          height: "40px",
          position: "absolute",
          top: top,
          left: left,
        }}
      ></img>
    )
  }
  const airUnitsCarrier1 = airUnitsOnDeckCarrier1.map((airUnit) => {
    const location = controller.getAirUnitLocation(airUnit.name)
    const top = "" + (48 + location.boxIndex * 17.5) + "%"

    return <div>{createImage(airUnit.image, "25.9%", top)}</div>
  })

  const airUnitsCarrier2 = airUnitsOnDeckCarrier2.map((airUnit) => {
    const location = controller.getAirUnitLocation(airUnit.name)
    const top = "" + (48 + location.boxIndex * 17.5) + "%"
    return <div>{createImage(airUnit.image, "64%", top)}</div>
  })

  const carrier1SternDamaged = controller.getCarrierSternDamaged(carrier1.name)
  const carrier1BowDamaged = controller.getCarrierBowDamaged(carrier1.name)
  const carrier2SternDamaged = controller.getCarrierSternDamaged(carrier2.name)
  const carrier2BowDamaged = controller.getCarrierBowDamaged(carrier2.name)

  const damageMarker = "/images/markers/damage.png"

  let c1bowDamage, c1sternDamage, c2bowDamage, c2sternDamage
  if (carrier1BowDamaged) {
    c1bowDamage = <div>{createImage(damageMarker, "25.9%", "48%")}</div>
  }
  if (carrier1SternDamaged) {
    c1sternDamage = <div>{createImage(damageMarker, "25.9%", "65.5%")}</div>
  }
  if (carrier2BowDamaged) {
    c2bowDamage = <div>{createImage(damageMarker, "64%", "48%")}</div>
  }
  if (carrier2SternDamaged) {
    c2sternDamage = <div>{createImage(damageMarker, "64%", "65.5%")}</div>
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <img
            src={carrier1.image}
            style={{
              width: carrier1.width,
              height: "200px",
              marginLeft: "-25px",
              marginRight: "200px",
            }}
          />
        </div>
        {airUnitsCarrier1}
        {airUnitsCarrier2}
        {c1bowDamage}
        {c1sternDamage}
        {c2bowDamage}
        {c2sternDamage}

        <div onDragEnter={(e) => handleDragEnter(e, carrier2.name, 2)}>
          <img
            src={carrier2.image}
            style={{
              width: carrier2.width,
              height: "200px",
              marginRight: "14px",
            }}
          />
        </div>
        <div
          className={dropClass}
          style={{
            left: "10%",
            top: "45%",
            zIndex: 0,
          }}
          onDragEnter={(e) => handleDragEnter(e, carrier1.name, 1)}
        >
          <p
            style={{
              marginTop: "5px",
              fontSize: "10px",
              color: "white",
            }}
          >
            Drop Here
          </p>
          <p
            style={{
              marginTop: "5px",
              fontSize: "10px",
              color: "white",
            }}
          >
            Target: {carrier1.name}
          </p>
        </div>
        <div
          className={dropClass}
          style={{
            left: "75%",
            top: "45%",
            zIndex: 0,
          }}
          onDragEnter={(e) => handleDragEnter(e, carrier2.name, 2)}
        >
          <p
            style={{
              marginTop: "5px",
              fontSize: "10px",
              color: "white",
            }}
          >
            Drop Here
          </p>
          <p
            style={{
              marginTop: "5px",
              fontSize: "10px",
              color: "white",
            }}
          >
            Target: {carrier2.name}
          </p>
        </div>
      </div>
    </>
  )
}
