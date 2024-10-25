import { React, useEffect, useState, createRef } from "react"
import "./cap.css"
import GlobalGameState from "../model/GlobalGameState"
import GlobalUnitsModel from "../model/GlobalUnitsModel"
import { doDamageAllocation } from "../DiceHandler"

export function CarrierPlanesDitchDamageHeaders({
  controller,
  eliminatedSteps,
  setEliminatedSteps,
  cardNumber,
  setStepsLeft,
}) {
  const [elRefs, setElRefs] = useState([])

  const msg = "One US Plane step is lost. Select a step to Eliminate."

  // let unitsInGroup = controller.getAttackingStrikeUnits()

  // Get all US planes in TF16 and TF17 return boxes
  const airUnitsTF16Return1 = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_TF16_RETURN1)
  const airUnitsTF16Return2 = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_TF16_RETURN2)
  const airUnitsTF17Return1 = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_TF17_RETURN1)
  const airUnitsTF17Return2 = controller.getAllAirUnitsInBox(GlobalUnitsModel.AirBox.US_TF17_RETURN2)

  const unitsInGroup = airUnitsTF16Return1
    .concat(airUnitsTF16Return2)
    .concat(airUnitsTF17Return1)
    .concat(airUnitsTF17Return2)

  const arrLength = unitsInGroup.length
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

  let totalSteps = 0

  const airCounterImage = (airUnit, i) => {
    totalSteps += airUnit.aircraftUnit.steps

    return (
      <div>
        <input
          ref={elRefs[i]}
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
  const airCountersTF16Return1 = airUnitsTF16Return1.map((airUnit, i) => {
    return airCounterImage(airUnit, i)
  })
  const airCountersTF16Return2 = airUnitsTF16Return2.map((airUnit, i) => {
    return airCounterImage(airUnit, i)
  })
  const airCountersTF17Return1 = airUnitsTF17Return1.map((airUnit, i) => {
    return airCounterImage(airUnit, i)
  })
  const airCountersTF17Return2 = airUnitsTF17Return2.map((airUnit, i) => {
    return airCounterImage(airUnit, i)
  })

  setStepsLeft(totalSteps)
  GlobalGameState.attackingStepsRemaining = totalSteps

  const handleClick = (airUnit) => {
    const hits = cardNumber === 11 ? 2 : 1

    if (eliminatedSteps === hits) {
      return
    }

    doDamageAllocation(controller, airUnit)
    setEliminatedSteps(() => eliminatedSteps + 1)
    GlobalGameState.updateGlobalState()
  }

  const hitsToAllocate = 1
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
                TF16 RETURN 1 BOX
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {airCountersTF16Return1}
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
                TF16 RETURN 2 BOX
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {airCountersTF16Return2}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "table-row",
              height: "25px",
            }}
          ></div>
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
              }}
            >
              <p
                style={{
                  margin: "5px",
                }}
              >
                TF17 RETURN 1 BOX
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {airCountersTF17Return1}
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
                TF17 RETURN 2 BOX
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {airCountersTF17Return2}
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
          (click on air unit to eliminate a step)
        </p>
      </div>
      <div>
        <p
          style={{
            display: "flex",
            marginTop: "50px",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          Steps Eliminated: &nbsp;<strong>{eliminatedSteps}</strong>&nbsp;
        </p>
      </div>
    </>
  )
}

export function CarrierPlanesDitchDamageFooters({ eliminatedSteps }) {
  const show = eliminatedSteps === 1 // card is 10

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
            All Done!
          </p>
        </div>
      )}
    </>
  )
}
