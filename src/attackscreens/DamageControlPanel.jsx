import { React, useState } from "react"
import Button from "react-bootstrap/Button"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import GlobalGameState from "../model/GlobalGameState"
import { sendRemoveDamageMarkerUpdate } from "../DiceHandler"

export function DamageControlPanelHeaders({ controller, setDamagedCV, damagedCV, side, setDamageMarkerUpdate }) {
  const [japanDamageDone, setJapanDamageDone] = useState(false)
  const [myDamagedCarriers, setMyDamagedCarriers] = useState([])

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

  const createImage = (cv, damageBow, damageStern) => {
    let carrier = usYorktown
    const damageMarker = "/images/markers/damage.png"

    if (cv === GlobalUnitsModel.Carrier.ENTERPRISE) {
      carrier = usEnterprise
    } else if (cv === GlobalUnitsModel.Carrier.HORNET) {
      carrier = usHornet
    } else if (cv === GlobalUnitsModel.Carrier.AKAGI) {
      carrier = jpAkagi
    } else if (cv === GlobalUnitsModel.Carrier.KAGA) {
      carrier = jpkaga
    } else if (cv === GlobalUnitsModel.Carrier.HIRYU) {
      carrier = jpHiryu
    } else if (cv === GlobalUnitsModel.Carrier.SORYU) {
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
            <Button disabled={damagedCV !== ""} onClick={() => handleClick(cv)}>
              {cv}
            </Button>
          </div>
        </div>
      </>
    )
  }
  function removeDamageFromCV(cv) {
    setDamagedCV(cv)

    // Either bow or stern or both damaged
    // if bow use that, if stern use that, if both it doesn't matter so use bow

    const carrier = controller.getCarrier(cv)
    const boxIndex = controller.getCarrierBowDamaged(cv) ? 0 : 1
    const boxName = controller.getAirBoxForNamedShip(side, carrier.name, "FLIGHT_DECK")

    carrier.hits -= 1
    if (controller.getCarrierBowDamaged(cv)) {
      controller.setCarrierBowDamaged(cv, false)
    } else if (controller.getCarrierSternDamaged(cv)) {
      controller.setCarrierSternDamaged(cv, false)
    }

    sendRemoveDamageMarkerUpdate(controller, carrier, boxName, boxIndex, setDamageMarkerUpdate, side)
  }
  let msg = side === GlobalUnitsModel.Side.US ? "" : "(Successful on roll of 1-3 for Japan)"

  if (side === GlobalUnitsModel.Side.JAPAN) {
    if (damagedCV !== "" && damagedCV !== undefined && GlobalGameState.dieRolls[0] !== undefined) {
      msg = "Remove 1 hit from Carrier " + damagedCV
    }
  } else {
    if (damagedCV !== "" && damagedCV !== undefined) {
      msg = "Remove 1 hit from Carrier " + damagedCV
    }
  }

  let damagedCarriers = controller.getDamagedCarriersOneOrTwoHits(side)
  damagedCarriers = damagedCarriers.filter((cv) => !controller.getCarrier(cv).dmcv)
  if (damagedCarriers.length === 0 && !japanDamageDone) {
    msg = "No Eligible Carriers"
    setDamagedCV("x")
  }
  if (side === GlobalUnitsModel.Side.US && damagedCarriers.length === 1) {
    removeDamageFromCV(damagedCarriers[0])
    msg = "Remove 1 hit from Carrier " + damagedCarriers[0]
    setJapanDamageDone(true)
  }

  console.log(
    "side=",
    side,
    "damagedCV=",
    damagedCV,
    "GlobalGameState.dieRolls[0]=",
    GlobalGameState.dieRolls[0],
    "japanDamageDone=",
    japanDamageDone
  )
  if (damagedCV !== "" && side === GlobalUnitsModel.Side.JAPAN && GlobalGameState.dieRolls[0] <= 3 && !japanDamageDone) {
    removeDamageFromCV(damagedCV)
    setJapanDamageDone(true)
  }

  const handleClick = (cv) => {
    if (side === GlobalUnitsModel.Side.US) {
      removeDamageFromCV(cv)
    } else {
      setDamagedCV(cv)
    }
  }

  const disabled = damagedCarriers.length <= 1
  const damagedCVImages = damagedCarriers.map((cv, idx) => {
    const carrierSternDamaged = controller.getCarrierSternDamaged(cv)
    const carrierBowDamaged = controller.getCarrierBowDamaged(cv)

    return (
      <>
        <div>{createImage(cv, carrierBowDamaged, carrierSternDamaged, disabled)}</div>
      </>
    )
  })

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
        <p>Choose damaged CV from which to remove one hit:</p>
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          marginTop: "50px",
        }}
      >
        {damagedCVImages}
      </div>
    </div>
  )
}

export function DamageControlPanelFooters({ damagedCV, side }) {
  if (damagedCV === "" || GlobalGameState.dieRolls.length === 0 || side === GlobalUnitsModel.Side.US) {
    return
  }

  const message1 = GlobalGameState.dieRolls[0] <= 3 ? "Die Roll Successful!" : "Die Roll Unsuccessful!"
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
    </>
  )
}
