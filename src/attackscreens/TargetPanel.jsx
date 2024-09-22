import { React, useState } from "react"
import Button from "react-bootstrap/Button"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import GlobalGameState from "../model/GlobalGameState"
import Controller from "../controller/Controller"

export function TargetHeaders({ controller, setTargetSelected, setTargetDetermined }) {
  const [buttonsDisabled, setButtonsDisabled] = useState(false)
  const [myTarget, setMyTarget] = useState(null)
  const handleClick = (target) => {
    GlobalGameState.taskForceTarget = target

    controller.viewEventHandler({
      type: Controller.EventTypes.TARGET_SELECTION,
      data: {
        target: target,
        side: GlobalGameState.sideWithInitiative,
      },
    })

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
  const message3 =
    sideBeingAttacked === GlobalUnitsModel.Side.JAPAN ? "(1-5 success, 6 fail)" : "(1-3 success, 4-6 fail)"

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

  const setDamageMarker = (controller, carrier, leftbox0, topbox0, leftbox1, topbox1) => {
    const carrierSternDamaged = controller.getCarrierSternDamaged(carrier)
    const carrierBowDamaged = controller.getCarrierBowDamaged(carrier)

    const carrierSunk = controller.isSunk(carrier)
    const damageMarker = "/images/markers/damage.png"
    const sunkMarker = "/images/markers/sunk.png"

    let cbowDamage, csternDamage

    if (carrierBowDamaged) {
      cbowDamage = <div>{createImage(damageMarker, leftbox0, topbox0)}</div>
    }
    if (carrierSternDamaged) {
      csternDamage = <div>{createImage(damageMarker, leftbox1, topbox1)}</div>
    }
    if (carrierSunk) {
      cbowDamage = <div>{createImage(sunkMarker, leftbox0, topbox0)}</div>
      csternDamage = <div>{createImage(sunkMarker, leftbox1, topbox1)}</div>
    }
    return { cbowDamage, csternDamage }
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

  // QUACK FOR TESTING ONLY ---------------------------------------
  // controller.setCarrierBowDamaged(GlobalUnitsModel.Carrier.KAGA)
  // controller.setCarrierSternDamaged(GlobalUnitsModel.Carrier.KAGA)

  // controller.setCarrierHits(GlobalUnitsModel.Carrier.AKAGI, 3)

  // controller.setCarrierBowDamaged(GlobalUnitsModel.Carrier.SORYU)
  // controller.setCarrierSternDamaged(GlobalUnitsModel.Carrier.SORYU)

  // controller.setCarrierHits(GlobalUnitsModel.Carrier.HIRYU, 3)

  // controller.setCarrierBowDamaged(GlobalUnitsModel.Carrier.ENTERPRISE)
  // controller.setCarrierSternDamaged(GlobalUnitsModel.Carrier.ENTERPRISE)

  // controller.setCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE, 3)
  // controller.setCarrierHits(GlobalUnitsModel.Carrier.HORNET, 3)

  // controller.setCarrierBowDamaged(GlobalUnitsModel.Carrier.YORKTOWN)
  // controller.setCarrierSternDamaged(GlobalUnitsModel.Carrier.YORKTOWN)

  // ---------------------------------------------------------------

  const airUnitsOnDeckAkagi = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK)
  const airUnitsOnDeckKaga = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK)

  const airUnitsOnDeckHiryu = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK)
  const airUnitsOnDeckSoryu = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK)

  const airUnitsOnDeckEnterprise = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK)
  const airUnitsOnDeckHornet = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK)
  const airUnitsOnDeckYorktown = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_YORKTOWN_FLIGHT_DECK)

  let markerAkagi,
    akagiBowDamage,
    akagiSternDamage,
    kagaBowDamage,
    kagaSternDamage,
    hiryuBowDamage,
    hiryuSternDamage,
    soryuBowDamage,
    soryuSternDamage,
    markerKaga,
    markerHiryu,
    markerSoryu,
    markerEnterprise,
    enterpriseBowDamage,
    enterpriseSternDamage,
    markerHornet,
    hornetBowDamage,
    hornetSternDamage,
    markerYorktown,
    yorktownBowDamage,
    yorktownSternDamage,
    cd1CAPCounters,
    cd2CAPCounters,
    tf16CAPCounters,
    tf17CAPCounters
  if (sideBeingAttacked === GlobalUnitsModel.Side.JAPAN) {
    // AKAGI DAMAGE, AIR UNITS
    markerAkagi = airUnitsOnDeckAkagi.map((airUnit) => {
      const location = controller.getAirUnitLocation(airUnit.name)
      const top = "" + (160 + location.boxIndex * 69) + "px"
      return <div>{createImage(airUnit.image, "24.7%", top)}</div>
    })
    let { cbowDamage, csternDamage } = setDamageMarker(
      controller,
      GlobalUnitsModel.Carrier.AKAGI,
      "24.7%",
      "160px",
      "24.7%",
      "229px"
    )
    akagiBowDamage = cbowDamage
    akagiSternDamage = csternDamage

    // KAGA DAMAGE, AIR UNITS
    markerKaga = airUnitsOnDeckKaga.map((airUnit) => {
      const location = controller.getAirUnitLocation(airUnit.name)
      const top = "" + (160 + location.boxIndex * 69) + "px"
      return <div>{createImage(airUnit.image, "37.9%", top)}</div>
    })
    let ret = setDamageMarker(controller, GlobalUnitsModel.Carrier.KAGA, "37.9%", "160px", "37.9%", "229px")
    kagaBowDamage = ret.cbowDamage
    kagaSternDamage = ret.csternDamage

    // HIRYU DAMAGE, AIR UNITS
    markerHiryu = airUnitsOnDeckHiryu.map((airUnit) => {
      const location = controller.getAirUnitLocation(airUnit.name)
      const top = "" + (160 + location.boxIndex * 69) + "px"
      return <div>{createImage(airUnit.image, "55.3%", top)}</div>
    })
    ret = setDamageMarker(controller, GlobalUnitsModel.Carrier.HIRYU, "55.3%", "160px", "55.3%", "229px")
    hiryuBowDamage = ret.cbowDamage
    hiryuSternDamage = ret.csternDamage

    // SORYU DAMAGE AIR UNITS
    markerSoryu = airUnitsOnDeckSoryu.map((airUnit) => {
      const location = controller.getAirUnitLocation(airUnit.name)
      const top = "" + (160 + location.boxIndex * 69) + "px"
      return <div>{createImage(airUnit.image, "68.9%", top)}</div>
    })

    ret = setDamageMarker(controller, GlobalUnitsModel.Carrier.SORYU, "68.9%", "160px", "68.9%", "229px")
    soryuBowDamage = ret.cbowDamage
    soryuSternDamage = ret.csternDamage

    // CD1 CAP AIR UNITS
    const capBoxCD1 = controller.getCAPBoxForTaskForce(
      GlobalUnitsModel.TaskForce.CARRIER_DIV_1,
      GlobalUnitsModel.Side.JAPAN
    )
    let capUnitsCD1 = controller.getAllAirUnitsInBox(capBoxCD1)
    cd1CAPCounters = capUnitsCD1.map((airUnit) => {
      return (
        <div>
          <img
            src={airUnit.image}
            style={{
              width: "40px",
              height: "40px",
              marginRight: "10px",
              marginTop: "-20px",
            }}
          ></img>
        </div>
      )
    })

    // CD2 CAP AIR UNITS
    const capBoxCD2 = controller.getCAPBoxForTaskForce(
      GlobalUnitsModel.TaskForce.CARRIER_DIV_2,
      GlobalUnitsModel.Side.JAPAN
    )
    let capUnitsCD2 = controller.getAllAirUnitsInBox(capBoxCD2)
    cd2CAPCounters = capUnitsCD2.map((airUnit) => {
      return (
        <div>
          <img
            src={airUnit.image}
            style={{
              width: "40px",
              height: "40px",
              marginRight: "10px",
              marginTop: "-20px",
            }}
          ></img>
        </div>
      )
    })
  } else {
    // ENTERPRISE DAMAGE, AIR UNITS
    markerEnterprise = airUnitsOnDeckEnterprise.map((airUnit) => {
      const location = controller.getAirUnitLocation(airUnit.name)
      const top = "" + (165 + location.boxIndex * 64) + "px"
      return <div>{createImage(airUnit.image, "30.4%", top)}</div>
    })
    let { cbowDamage, csternDamage } = setDamageMarker(
      controller,
      GlobalUnitsModel.Carrier.ENTERPRISE,
      "30.4%",
      "165px",
      "30.4%",
      "229px"
    )
    enterpriseBowDamage = cbowDamage
    enterpriseSternDamage = csternDamage

    // HORNET DAMAGE, AIR UNITS
    markerHornet = airUnitsOnDeckHornet.map((airUnit) => {
      const location = controller.getAirUnitLocation(airUnit.name)
      const top = "" + (165 + location.boxIndex * 64) + "px"
      return <div>{createImage(airUnit.image, "43.8%", top)}</div>
    })

    let ret = setDamageMarker(controller, GlobalUnitsModel.Carrier.HORNET, "43.8%", "165px", "43.8%", "229px")
    hornetBowDamage = ret.cbowDamage
    hornetSternDamage = ret.csternDamage

    // HORNET DAMAGE, AIR UNITS
    markerYorktown = airUnitsOnDeckYorktown.map((airUnit) => {
      const location = controller.getAirUnitLocation(airUnit.name)
      const top = "" + (165 + location.boxIndex * 64) + "px"
      return <div>{createImage(airUnit.image, "62.2%", top)}</div>
    })

    ret = setDamageMarker(controller, GlobalUnitsModel.Carrier.YORKTOWN, "62.2%", "165px", "62.2%", "229px")
    yorktownBowDamage = ret.cbowDamage
    yorktownSternDamage = ret.csternDamage

    // TF16 CAP AIR UNITS
    const capBoxTF16 = controller.getCAPBoxForTaskForce(
      GlobalUnitsModel.TaskForce.TASK_FORCE_16,
      GlobalUnitsModel.Side.US
    )
    let capUnitsTF16 = controller.getAllAirUnitsInBox(capBoxTF16)
    tf16CAPCounters = capUnitsTF16.map((airUnit) => {
      return (
        <div>
          <img
            src={airUnit.image}
            style={{
              width: "40px",
              height: "40px",
              marginRight: "10px",
              marginTop: "-20px",
            }}
          ></img>
        </div>
      )
    })
    // TF17 CAP AIR UNITS
    const capBoxTF17 = controller.getCAPBoxForTaskForce(
      GlobalUnitsModel.TaskForce.TASK_FORCE_17,
      GlobalUnitsModel.Side.US
    )
    let capUnitsTF17 = controller.getAllAirUnitsInBox(capBoxTF17)
    tf17CAPCounters = capUnitsTF17.map((airUnit) => {
      return (
        <div>
          <img
            src={airUnit.image}
            style={{
              width: "40px",
              height: "40px",
              marginRight: "10px",
              marginTop: "-20px",
            }}
          ></img>
        </div>
      )
    })
  }

  const tf1 = sideBeingAttacked === GlobalUnitsModel.Side.JAPAN ? jpTf1 : usTf1
  const tf2 = sideBeingAttacked === GlobalUnitsModel.Side.JAPAN ? jpTf2 : usTf2
  const bg = sideBeingAttacked === GlobalUnitsModel.Side.US ? "rgba(92, 131, 228, 0.8)" : "rgba(228, 92, 92, 0.8)"

  const cap1Msg = sideBeingAttacked === GlobalUnitsModel.Side.JAPAN ? "CarDiv1 CAP" : "TF16 CAP"
  const cap2Msg = sideBeingAttacked === GlobalUnitsModel.Side.JAPAN ? "CarDiv2 CAP" : "TF17 CAP"

  let autoSelectTarget = controller.autoSelectTaskForceTarget(sideBeingAttacked)

  let selectMsg = "Select a target to attack"

  if (autoSelectTarget) {
    setTargetSelected(true)
    setTargetDetermined(true)
    GlobalGameState.taskForceTarget = autoSelectTarget
    GlobalGameState.dieRolls = 1
    selectMsg = `Target Automatically Selected: ${autoSelectTarget}`
  }


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
        {selectMsg}
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              zIndex: 100,
              width: "200px",
              height: "70px",
              background: bg,
              borderRadius: "3px",
              color: "white",
              border: "1px solid white",
              marginBottom: "10px",
            }}
          >
            <p style={{ marginLeft: "5px" }}>{cap1Msg}</p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "7px",
              }}
            >
              {cd1CAPCounters}
              {tf16CAPCounters}
            </div>
          </div>
          <img
            src={tf1.image}
            style={{
              width: tf1.width,
              height: "200px",
              marginRight: "45px",
            }}
          />
          <p
            style={{
              marginTop: "10px",
              marginLeft: "50px",
            }}
          >
            {markerAkagi}
            {akagiBowDamage}
            {akagiSternDamage}
            {markerKaga}
            {kagaBowDamage}
            {kagaSternDamage}
            {markerHiryu}
            {hiryuBowDamage}
            {hiryuSternDamage}
            {markerSoryu}
            {soryuBowDamage}
            {soryuSternDamage}
            {markerEnterprise}
            {enterpriseBowDamage}
            {enterpriseSternDamage}
            {markerHornet}
            {hornetBowDamage}
            {hornetSternDamage}
            {markerYorktown}
            {yorktownBowDamage}
            {yorktownSternDamage}
            <Button disabled={buttonsDisabled || autoSelectTarget !== null} onClick={() => handleClick(tf1.name)}>
              {tf1.buttonStr}
            </Button>
          </p>
        </div>
        <div>
          <div
            style={{
              zIndex: 100,
              width: tf2.width,
              height: "70px",
              background: bg,
              borderRadius: "3px",
              color: "white",
              border: "1px solid white",
              marginBottom: "10px",
            }}
          >
            <p style={{ marginLeft: "5px" }}>{cap2Msg}</p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "7px",
              }}
            >
              {cd2CAPCounters}
              {tf17CAPCounters}
            </div>
          </div>
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
            <Button disabled={buttonsDisabled || autoSelectTarget !== null} onClick={() => handleClick(tf2.name)}>
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
            {msg} &nbsp;<strong>{GlobalGameState.taskForceTarget}</strong>&nbsp;
          </p>
        </div>
      )}
    </>
  )
}
