import { React, useState, useRef, useEffect } from "react"
import Button from "react-bootstrap/Button"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import GlobalGameState from "../model/GlobalGameState"

export function DMCVCarrierSelectionPanelHeaders({ controller, DMCVCarrierSelected, setDMCVCarrierSelected, side }) {
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

  const createImage = (cv) => {
    let carrier = usYorktown
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
        <div>
          <img
            src={carrier.image}
            style={{
              width: carrier.width,
              height: "200px",
              marginLeft: "10px",
              // marginRight: "40px",
            }}
          ></img>
          <div
            style={{
              marginLeft: "10px",
              marginTop: "15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
            }}
          >
            <Button disabled={DMCVCarrierSelected !== ""} onClick={() => handleClick(cv)}>
              {cv}
            </Button>
          </div>
        </div>
      </>
    )
  }

  const usDamagedCarriers = controller.getDamagedCarriers(side)
  const handleClick = (cv) => {
    setDMCVCarrierSelected(cv)
  }
  const damagedCVImages = usDamagedCarriers.map((cv, idx) => {
    return (
      <>
        <div>{createImage(cv)}</div>
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
        <p>Choose damaged CV to Assign to DMCV:</p>
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

export function DMCVCarrierSelectionPanelFooters({ controller, DMCVCarrierSelected, side, doDMCVShipMarkerUpdate }) {
  if (DMCVCarrierSelected == "") {
    return
  }
  let carrierUnit = controller.getCarrier(DMCVCarrierSelected)

  if (!carrierUnit.dmcv) {
    doDMCVShipMarkerUpdate()
  }

  if (side === GlobalUnitsModel.Side.US) {
    GlobalGameState.usDMCVCarrier = carrierUnit.name
  } else {
    GlobalGameState.jpDMCVCarrier = carrierUnit.name
  }
  carrierUnit.dmcv = true

  // QUACK BUG DEC 10 this may have side effects
  // Otherwise causes orphaned units
  // carrierUnit.taskForce =
  //   side === GlobalUnitsModel.Side.JAPAN ? GlobalUnitsModel.TaskForce.US_DMCV : GlobalUnitsModel.TaskForce.JAPAN_DMCV

  const message1 = "CV Selected: "
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
          {message1} &nbsp;<strong>{DMCVCarrierSelected}</strong>&nbsp; <br></br>
        </p>
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          DMCV Created For {side}
        </p>
      </div>
    </>
  )
}
