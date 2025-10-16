import GlobalGameState from "../model/GlobalGameState"
import GlobalInit from "../model/GlobalInit"
import GlobalUnitsModel from "../model/GlobalUnitsModel"

export function EventCardFooter({ cardNumber, showCardFooter, setShowDice, doCriticalHit, attackResolved }) {
  if (cardNumber === 6 && showCardFooter) {
    setShowDice(false)
    GlobalGameState.JP_AF = 8
    return (
      <>
        {showCardFooter && (
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
              The IJN Search Value for the 1AF is 8 for this turn.
              <br></br>
            </p>
          </div>
        )}
      </>
    )
  }
  if (cardNumber === 8 && showCardFooter) {
    let garrisonStr = "No Increase in Garrison Level."

    const mgl = GlobalGameState.midwayGarrisonLevel + 1
    if (GlobalGameState.midwayGarrisonLevel < 6) {
      garrisonStr =
        "Midway Garrison increases from " +
        GlobalGameState.midwayGarrisonLevel +
        " to " +
        (GlobalGameState.midwayGarrisonLevel + 1)
      GlobalGameState.midwayGarrisonLevel++
    }
    setShowDice(false)
    GlobalGameState.semperFi = true
    return (
      <>
        {showCardFooter && (
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
              {garrisonStr} <br></br>
              <br></br>
              Midway Garrison fires first in land combat.
            </p>
          </div>
        )}
      </>
    )
  }
  if (cardNumber === 9 && showCardFooter) {
    setShowDice(false)
    // remove US Fighter From Strike Group
    let airMsg = ""
    let airMsg2 = ""

    const units = GlobalInit.controller.getAllStrikeUnits(GlobalUnitsModel.Side.US)
    for (const unit of units) {
      if (!unit.aircraftUnit.attack) {
        unit.aircraftUnit.separated = true
        airMsg = "Fighter Unit Removed from Air Strike: " + unit.name
        airMsg2 = "(Move to Return Box Following Completion of Air Strike)"
        break
      }
    }
    return (
      <>
        {showCardFooter && (
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
              {airMsg}
            </p>
            <p
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
              }}
            >
              {airMsg2}
            </p>
          </div>
        )}
      </>
    )
  }
  if (cardNumber === 12) {
    setShowDice(false)
    // set DRM For Japanese Fighters to 1 and elite pilots flag to true (reverses order of
    // combat for Midway attacks)
    let airMsg =
      GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
        ? "Elite Japanese Pilots: +1 DRM for CAP Combat Die Rolls this Air Op."
        : "Elite Japanese Pilots: +1 DRM for Escort Die Rolls this Air Op."
    if (showCardFooter) {
      GlobalGameState.elitePilots = true
    }

    return (
      <>
        {showCardFooter && (
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
              {airMsg}
            </p>
          </div>
        )}
      </>
    )
  }
  if (cardNumber === 13) {
    setShowDice(false)
    // Add additional damage to just attacked carrier
    let airMsg = "Additional Hit Added to " + GlobalGameState.currentCarrierAttackTarget

    if (showCardFooter && !attackResolved) {
      GlobalGameState.carrierAttackHits = 1
      doCriticalHit()
    }

    return (
      <>
        {showCardFooter && (
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
              {airMsg}
            </p>
          </div>
        )}
      </>
    )
  }
}
