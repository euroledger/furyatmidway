import { React, useState, useRef, useEffect } from "react"
import Button from "react-bootstrap/Button"
import GlobalUnitsModel from "../model/GlobalUnitsModel"

export function TowedCVHeaders({ controller, setTowedCVSelected, towedCVSelected}) {
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

  const createImage = (cv) => {
    let carrier = usYorktown
    if (cv === GlobalUnitsModel.Carrier.ENTERPRISE) {
      carrier = usEnterprise
    } else if (cv === GlobalUnitsModel.Carrier.HORNET) {
      carrier = usHornet
    }

    return (
      <>
        <div>
          <img
            src={carrier.image}
            style={{
              width: carrier.width,
              height: "200px",
              marginLeft: "40px",
              marginRight: "40px",
            }}
          ></img>
        </div>
        <div
          style={{
            marginLeft: "43px",
            marginTop: "20px",
          }}
        >
          <Button disabled={towedCVSelected} style={{
            minWidth:"100px",
          }} onClick={() => handleClick(cv)}>{cv}</Button>
        </div>
      </>
    )
  }

  const usCVsSunk = controller.getSunkCarriers(GlobalUnitsModel.Side.US)

  const handleClick = (cv) => {
    setTowedCVSelected(cv)
  }
  const sunkCVImages = usCVsSunk.map((cv, idx) => {
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
        <p>Choose CV (lost in combat) to tow to Friendly Port:</p>
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
        {sunkCVImages}
      </div>
    </div>
  )
}

export function TowedCVFooters({ controller, towedCVSelected }) {
  if (towedCVSelected == "") {
    return
  }

  let carrierUnit = controller.getCarrier(towedCVSelected)
  carrierUnit.towed = true

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
          {message1} &nbsp;<strong>{towedCVSelected}</strong>&nbsp; <br></br>
        </p>
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          The Japanese player does not receive a VP for this CV.
        </p>
      </div>
    </>
  )
}
