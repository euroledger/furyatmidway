import { React, useState } from "react"
import "./cap.css"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import Button from "react-bootstrap/Button"
import { moveAirUnitFromEliminatedBox } from "../DiceHandler"

export function AirReplacementsHeaders({
  controller,
  setShowCarrierDisplay,
  setAirReplacementsSelected,
  setSelectedAirUnit,
}) {
  const [reducedAirUnits, setReducedAirUnits] = useState([])

  let side = GlobalUnitsModel.Side.JAPAN
  if (controller.getCardPlayed(3, GlobalUnitsModel.Side.US)) {
    side = GlobalUnitsModel.Side.US
  }

  const msg = "Select a one step air unit to flip to full strength or eliminated air unit to return to hangar"

  if (reducedAirUnits.length === 0 && controller.getAllReducedUnitsForSide(side) > 0) {
    const redAirUnits = controller.getAllReducedUnitsForSide(side)
    setReducedAirUnits(() => redAirUnits)
  }

  const eliminatedAirUnits = controller.getAllEliminatedUnits(side)

  // Get all One Step (reduced) and Eliminated air units

  // Display in two boxes

  // if user selects an eliminated unit, display all US or Japanese carriers with undamaged flight deck and
  // hangar capacity available with button to choose that CV's hangar

  const airCounterImage = (airUnit, i) => {
    return (
      <div>
        <input
          onClick={() => handleClick(airUnit)}
          type="image"
          src={airUnit.image}
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
    return airCounterImage(airUnit, i)
  })

  const handleClick = (airUnit) => {
    // if this unit has 1 step -> flip to full strength
    if (airUnit.aircraftUnit.steps === 1) {
      airUnit.aircraftUnit.steps = 2
      const newImage = airUnit.image.replace("back", "front")
      airUnit.image = newImage
      setAirReplacementsSelected(true)
      return
    }

    // if this unit has 0 steps -> set to 1 step and display the eligible carriers in which to place into hangar
    if (eliminatedAirUnits.includes(airUnit)) {
      const newImage = airUnit.image.replace("front", "back")
      airUnit.image = newImage
      setSelectedAirUnit(airUnit)
      setShowCarrierDisplay(() => true)
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
          (click on air unit to flip or restore)
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
}) {
  let side = GlobalUnitsModel.Side.JAPAN
  if (controller.getCardPlayed(3, GlobalUnitsModel.Side.US)) {
    side = GlobalUnitsModel.Side.US
  }
  let selectedCV

  const japanCVs = [
    GlobalUnitsModel.Carrier.AKAGI,
    GlobalUnitsModel.Carrier.KAGA,
    GlobalUnitsModel.Carrier.HIRYU,
    GlobalUnitsModel.Carrier.SORYU,
  ]
  const handleClick = (cv) => {
    setAirReplacementsSelected(true)

    selectedCV = cv
    // move the air unit from eliminated box to the hangar of the given cv
  }
  let availableCVImages = []

  const createImage = (cv) => {
    let image = "/images/fleetcounters/yorktown.jpg"
    if (cv === GlobalUnitsModel.Carrier.ENTERPRISE) {
      image = "/images/fleetcounters/enterprise.jpg"
    } else if (cv === GlobalUnitsModel.Carrier.HORNET) {
      image = "/images/fleetcounters/hornet.jpg"
    } else if (cv === GlobalUnitsModel.Carrier.AKAGI) {
      image = "/images/fleetcounters/akagi.jpg"
    } else if (cv === GlobalUnitsModel.Carrier.KAGA) {
      image = "/images/fleetcounters/kaga.jpg"
    } else if (cv === GlobalUnitsModel.Carrier.HIRYU) {
      image = "/images/fleetcounters/hiryu.jpg"
    } else if (cv === GlobalUnitsModel.Carrier.HORNET) {
      image = "/images/fleetcounters/soryu.jpg"
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
            marginLeft: "53px",
            marginTop: "20px",
          }}
        >
          <Button disabled={availableCVImages.length <= 1} onClick={() => handleClick(cv)}>
            {cv}
          </Button>
        </div>
      </>
    )
  }
  let msg = ""

  if (side === GlobalUnitsModel.Side.US) {
    const usCVs = [
      GlobalUnitsModel.Carrier.ENTERPRISE,
      GlobalUnitsModel.Carrier.YORKTOWN,
      GlobalUnitsModel.Carrier.HORNET,
    ]
    const availableUSCVs = usCVs.filter(
      (carrier) => !controller.isSunk(carrier) && controller.isHangarAvailable(carrier)
    )
    if (availableUSCVs.length === 0) {
      msg = "No carriers available to receive replacements"
      setAirReplacementsSelected(true)
    }
    availableCVImages = availableUSCVs.map((cv, idx) => {
      return (
        <>
          <div>{createImage(cv)}</div>
        </>
      )
    })
    if (availableUSCVs.length === 1) {
      selectedCV = availableUSCVs[0]
    }
  } else {
    const availableJapanCVs = japanCVs.filter(
      (carrier) => !controller.isSunk(carrier) && controller.isHangarAvailable(carrier)
    )
    if (availableJapanCVs.length === 0) {
      msg = "No carriers available to receive replacements"
      setAirReplacementsSelected(true)
    }
    availableCVImages = availableJapanCVs.map((cv, idx) => {
      return (
        <>
          <div>{createImage(cv)}</div>
        </>
      )
    })
    if (availableJapanCVs.length === 1) {
      selectedCV = availableJapanCVs[0]
    }
  }

  if (selectedCV && showCarrierDisplay && !airReplacementsSelected) {
    moveAirUnitFromEliminatedBox(controller, side, selectedCV, selectedAirUnit, setAirUnitUpdate)
    setAirReplacementsSelected(true)
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
    </>
  )
}
