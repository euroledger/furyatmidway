import { useState, createRef, useEffect } from "react"
import Button from "react-bootstrap/Button"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import GlobalGameState from "../model/GlobalGameState"

export function TowedCVHeaders({ controller, setTowedCVSelected, towedCVSelected }) {
  const [elRefs, setElRefs] = useState([])

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

  const usCVsSunk = controller.getSunkCarriers(GlobalUnitsModel.Side.US)
  const arrLength = usCVsSunk.length
  useEffect(() => {
    // add or remove refs
    setElRefs((elRefs) =>
      Array(arrLength)
        .fill()
        .map((_, i) => elRefs[i] || createRef())
    )
    const myRef = elRefs[GlobalGameState.testCapSelection]
    if (myRef !== undefined && myRef.current !== undefined) {
      myRef.current.click(myRef.current)
    }
  }, [GlobalGameState.testCapSelection])

  const createImage = (cv, i) => {
    let carrier = usYorktown
    if (cv === GlobalUnitsModel.Carrier.ENTERPRISE) {
      carrier = usEnterprise
    } else if (cv === GlobalUnitsModel.Carrier.HORNET) {
      carrier = usHornet
    }

    const id = "bollocks" + i
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
            marginLeft: "41px",
            marginTop: "20px",
          }}
        >
          <Button
            disabled={towedCVSelected}
            style={{
              minWidth: "100px",
            }}
            ref={elRefs[i]}
            onClick={() => handleClick(cv)}
            id={id}
          >
            {cv}
          </Button>
        </div>
      </>
    )
  }

  let cvMsg = "Choose CV (lost in combat) to tow to Friendly Port:"
  if (GlobalGameState.usPlayerType === GlobalUnitsModel.TYPE.AI) {
    cvMsg = "US chooses CV (lost in combat) to tow to Friendly Port:"
  }
  const handleClick = (cv) => {
    setTowedCVSelected(cv)
  }
  const sunkCVImages = usCVsSunk.map((cv, i) => {
    console.log("CREATE IMAGE FOR CARRIER",cv, "i=", i)
    return (
      <>
        <div>{createImage(cv, i)}</div>
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
        <p>{cvMsg}</p>
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
  if (towedCVSelected == "" || towedCVSelected === undefined) {
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
