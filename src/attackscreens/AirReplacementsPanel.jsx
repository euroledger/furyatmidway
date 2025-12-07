import { useState, createRef, useEffect } from "react"
import "./cap.css"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import Button from "react-bootstrap/Button"
import { moveAirUnitFromEliminatedBox } from "../DiceHandler"
import GlobalGameState from "../model/GlobalGameState"

export function AirReplacementsHeaders({
  controller,
  setShowCarrierDisplay,
  setAirReplacementsSelected,
  setSelectedAirUnit,
  setClickedOnSomething,
  hidden,
}) {
  const [reducedAirUnits, setReducedAirUnits] = useState([])
  const [elimSelected, setElimSelected] = useState(false)

  const [elRefs, setElRefs] = useState([])

  let side = GlobalUnitsModel.Side.JAPAN
  if (controller.getCardPlayed(3, GlobalUnitsModel.Side.US)) {
    side = GlobalUnitsModel.Side.US
  }
  const redUnits = controller.getAllReducedUnitsForSide(side)
  if (reducedAirUnits.length === 0 && redUnits.length > 0) {
    const redAirUnits = controller.getAllReducedUnitsForSide(side)
    setReducedAirUnits(() => redAirUnits)
  }
  const eliminatedAirUnits = controller.getAllEliminatedUnits(side)
  const arrLength = redUnits.length + eliminatedAirUnits.length

  useEffect(() => {
    // add or remove refs
    setElRefs((elRefs) =>
      Array(arrLength)
        .fill()
        .map((_, i) => elRefs[i] || createRef())
    )
  }, [])

  useEffect(() => {
    if (GlobalGameState.testStepLossSelection === -1) {
      return
    }
    const myRef = elRefs[GlobalGameState.testStepLossSelection]
    if (myRef !== undefined && myRef.current !== undefined && myRef.current !== null) {
      myRef.current.click(myRef.current)
    }
  }, [GlobalGameState.testStepLossSelection])

  let msg = "Select a one step air unit to flip to full strength or eliminated air unit to return to hangar"

  if (side === GlobalUnitsModel.Side.US && GlobalGameState.usPlayerType === GlobalUnitsModel.TYPE.AI) {
    msg = "US Player selects a one step air unit to flip to full strength or eliminated air unit to return to hangar"
  }

  // Get all One Step (reduced) and Eliminated air units

  // Display in two boxes

  // if user selects an eliminated unit, display all US or Japanese carriers with undamaged flight deck and
  // hangar capacity available with button to choose that CV's hangar

  const airCounterImage = (airUnit, i) => {
    if (eliminatedAirUnits.includes(airUnit)) {
      const newImage = airUnit.image.replace("front", "back")
      airUnit.image = newImage
    }
    return (
      <div>
        <input
          ref={elRefs[i]}
          onClick={() => handleClick(airUnit)}
          type="image"
          src={airUnit.image}
          disabled={elimSelected}
          style={{
            width: "40px",
            height: "40px",
            marginLeft: "15px",
            marginRight: "30px",
          }}
          id="bollocks"
        />
        <p
          style={{
            marginLeft: "5px",
            color: "white",
            fontSize: "10px",
          }}
        >
          {airUnit.name}
        </p>
      </div>
    )
  }
  const reducedCounters = reducedAirUnits.map((airUnit, i) => {
    return airCounterImage(airUnit, i)
  })
  const eliminatedCounters = eliminatedAirUnits.map((airUnit, i) => {
    return airCounterImage(airUnit, i + reducedCounters.length)
  })

  const handleClick = (airUnit) => {
    setClickedOnSomething(true)
    // if this unit has 1 step -> flip to full strength
    if (airUnit.aircraftUnit.steps === 1 && !eliminatedAirUnits.includes(airUnit)) {
      airUnit.aircraftUnit.steps = 2
      const newImage = airUnit.image.replace("back", "front")
      airUnit.image = newImage
      setSelectedAirUnit(airUnit)
      setAirReplacementsSelected(true)
      return
    }

    // if this unit has 0 steps -> set to 1 step and display the eligible carriers in which to place into hangar
    if (eliminatedAirUnits.includes(airUnit)) {
      airUnit.aircraftUnit.steps = 1
      const newImage = airUnit.image.replace("front", "back")
      airUnit.image = newImage
      setSelectedAirUnit(airUnit)
      setShowCarrierDisplay(() => true)
      setAirReplacementsSelected(false)
      setElimSelected(true)
    }
  }
  let clickMsg = "(click on air unit to flip or restore)"
  if (side === GlobalUnitsModel.Side.US) {
    if (GlobalGameState.usPlayerType === GlobalUnitsModel.TYPE.AI) {
      clickMsg = ""
    }
  } else {
    if (GlobalGameState.jpPlayerType === GlobalUnitsModel.TYPE.AI) {
      clickMsg = ""
    }
  }
  return (
    <>
      <div>
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          {msg}
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
        <div
          style={{
            width: "100%",
            display: "table",
            marginLeft: "-20px",
          }}
        >
          <div
            style={{
              display: "table-row",
              height: "100px",
            }}
          >
            <div
              style={{
                width: "48%",
                display: "table-cell",
                borderRadius: "3px",
                border: "1px solid white",
                marginRight: "5px",
                maxWidth: "300px",
              }}
            >
              <p
                style={{
                  margin: "5px",
                }}
              >
                REDUCED AIR UNITS BOX
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {reducedCounters}
              </div>
            </div>
            <div
              style={{
                width: "10px",
                display: "table-cell",
              }}
            ></div>
            <div
              style={{
                width: "50",

                marginLeft: "5px",
                borderRadius: "3px",
                border: "1px solid white",
                display: "table-cell",
              }}
            >
              <p
                style={{
                  margin: "5px",
                }}
              >
                ELIMINATED AIR UNITS BOX
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {eliminatedCounters}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p
          style={{
            display: "flex",
            marginTop: "20px",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            marginLeft: "10px",
          }}
        >
          {clickMsg}
        </p>
      </div>
    </>
  )
}

export function AirReplacementsFooters({
  controller,
  showCarrierDisplay,
  setAirReplacementsSelected,
  selectedAirUnit,
  airReplacementsSelected,
  setAirUnitUpdate,
  clickedOnSomething,
  hidden,
}) {
  const [selectedCV, setSelectedCV] = useState("")

  const [elRefsCV, setElRefsCV] = useState([])

  let side = GlobalUnitsModel.Side.JAPAN
  if (controller.getCardPlayed(3, GlobalUnitsModel.Side.US)) {
    side = GlobalUnitsModel.Side.US
  }

  const handleCVClick = (cv) => {
    setSelectedCV(cv)
    // move the air unit from eliminated box to the hangar of the given cv
  }
  let availableUSCVs, availableJapanCVs
  let availableCVImages = []
  let msg = ""

  let arrLength = 0
  if (side === GlobalUnitsModel.Side.US) {
    const usCVs = [
      GlobalUnitsModel.Carrier.ENTERPRISE,
      GlobalUnitsModel.Carrier.YORKTOWN,
      GlobalUnitsModel.Carrier.HORNET,
    ]
    availableUSCVs = usCVs.filter((carrier) => {
      return !controller.isSunk(carrier, true) && controller.isHangarAvailable(carrier)
    })
    // IF AI only display undamaged carriers
    if (GlobalGameState.usPlayerType === GlobalUnitsModel.TYPE.AI) {
      let allCarriersDamaged = true
      for (const cv of availableUSCVs) {
        if (controller.getCarrierHits(cv) === 0) {
          allCarriersDamaged = false
          break
        }
      }
      if (!allCarriersDamaged) {
        availableUSCVs = availableUSCVs.filter((cv) => controller.getCarrierHits(cv) === 0)
      }
    }
    arrLength = availableUSCVs.length
    if (clickedOnSomething && availableUSCVs.length === 0) {
      msg = "No carriers available to receive replacements"
      setAirReplacementsSelected(true)
    }
  } else {
    const japanCVs = [
      GlobalUnitsModel.Carrier.AKAGI,
      GlobalUnitsModel.Carrier.KAGA,
      GlobalUnitsModel.Carrier.HIRYU,
      GlobalUnitsModel.Carrier.SORYU,
    ]
    availableJapanCVs = japanCVs.filter(
      (carrier) => !controller.isSunk(carrier) && controller.isHangarAvailable(carrier)
    )

    console.log("AVAILABLE JAPAN CVs=", availableJapanCVs)

    availableJapanCVs = []
    if (GlobalGameState.jpPlayerType === GlobalUnitsModel.TYPE.AI) {
      let allCarriersDamaged = true
      for (const cv of availableJapanCVs) {
        if (controller.getCarrierHits(cv) === 0) {
          allCarriersDamaged = false
          break
        }
      }

      if (!allCarriersDamaged) {
        availableJapanCVs = availableJapanCVs.filter((cv) => controller.getCarrierHits(cv) === 0)
      }
    }

    arrLength = availableJapanCVs.length

    if (clickedOnSomething && availableJapanCVs.length === 0) {
      msg = "No carriers available to receive replacements"
      setAirReplacementsSelected(true)
    }
  }

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

  const createImage = (cv, i) => {
    let image = "/images/fleetcounters/yorktown.jpg"
    if (cv === GlobalUnitsModel.Carrier.ENTERPRISE) {
      image = "/images/fleetcounters/enterprise.jpg"
    } else if (cv === GlobalUnitsModel.Carrier.HORNET) {
      image = "/images/fleetcounters/hornet.jpg"
    } else if (cv === GlobalUnitsModel.Carrier.YORKTOWN) {
      image = "/images/fleetcounters/yorktown.jpg"
    } else if (cv === GlobalUnitsModel.Carrier.AKAGI) {
      image = "/images/fleetcounters/akagi.jpg"
    } else if (cv === GlobalUnitsModel.Carrier.KAGA) {
      image = "/images/fleetcounters/kaga.jpg"
    } else if (cv === GlobalUnitsModel.Carrier.HIRYU) {
      image = "/images/fleetcounters/hiryu.jpg"
    } else if (cv === GlobalUnitsModel.Carrier.SORYU) {
      image = "/images/fleetcounters/soryu.jpg"
    }
    let buttonDisabled
    if (side === GlobalUnitsModel.Side.US) {
      buttonDisabled = availableUSCVs.length === 0 || selectedCV != ""
    } else {
      buttonDisabled = availableJapanCVs.length === 0 || selectedCV != ""
    }
    return (
      <>
        <div>
          <img
            src={image}
            style={{
              width: "100px",
              height: "200px",
              marginLeft: "40px",
              marginRight: "40px",
            }}
          ></img>
        </div>
        <div
          style={{
            marginLeft: "40px",
            marginTop: "20px",
          }}
        >
          <Button
            style={{ width: "100px" }}
            ref={elRefsCV[i]}
            hidden={hidden}
            disabled={buttonDisabled}
            onClick={() => handleCVClick(cv)}
          >
            {cv}
          </Button>
        </div>
      </>
    )
  }

  if (!airReplacementsSelected) {
    if (side === GlobalUnitsModel.Side.US) {
      availableCVImages = availableUSCVs.map((cv, i) => {
        return (
          <>
            <div>{createImage(cv, i)}</div>
          </>
        )
      })
    } else {
      availableCVImages = availableJapanCVs.map((cv, i) => {
        return (
          <>
            <div>{createImage(cv, i)}</div>
          </>
        )
      })
      // if (availableJapanCVs.length === 1) {
      //   setSelectedCV(availableJapanCVs[0])
      // }
    }
  }
  let rep = true
  if (selectedCV && showCarrierDisplay && !airReplacementsSelected) {
    // rep = false
    setAirReplacementsSelected(true)
    moveAirUnitFromEliminatedBox(controller, side, selectedCV, selectedAirUnit, setAirUnitUpdate)
  }
  if (side === GlobalUnitsModel.Side.US) {
    if (selectedCV && availableUSCVs.length === 1 && !airReplacementsSelected) {
      // rep = false
      setAirReplacementsSelected(true)
      moveAirUnitFromEliminatedBox(controller, side, selectedCV, selectedAirUnit, setAirUnitUpdate)
    }
  } else {
    if (selectedCV && availableJapanCVs.length === 1 && !airReplacementsSelected) {
      // rep = false
      setAirReplacementsSelected(true)
      moveAirUnitFromEliminatedBox(controller, side, selectedCV, selectedAirUnit, setAirUnitUpdate)
    }
  }

  return (
    <>
      {showCarrierDisplay && (
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
              {availableCVImages}
              {msg}
            </p>
            <p
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
              }}
            >
              Select carrier hangar to receive air unit
            </p>
          </div>
          {selectedCV && (
            <p
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
              }}
            >
              CV Hangar for replacement step =&nbsp;<strong>{selectedCV}</strong>&nbsp;
            </p>
          )}
        </>
      )}
      {selectedAirUnit && (
        <div>
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
            }}
          >
            Selected Air Unit =&nbsp;<strong>{selectedAirUnit.name}</strong>&nbsp;
          </p>
        </div>
      )}
    </>
  )
}
