import GlobalGameState from "../model/GlobalGameState"
import GlobalInit from "../model/GlobalInit"
import GlobalUnitsModel from "../model/GlobalUnitsModel"

export function EventCardFooter({ cardNumber, showCardFooter, setShowDice, doCriticalHit, attackResolved }) {

  if (cardNumber === 6 && showCardFooter) {
    setShowDice(false)
    GlobalGameState.SearchValue.JP_AF = 8
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
  if (cardNumber === 9) {
    setShowDice(false)
    // remove US Fighter From Strike Group
    let airMsg = ""
    if (showCardFooter) {
      const units = GlobalInit.controller.getAttackingStrikeUnits()
      for (const unit of units) {
        if (!unit.aircraftUnit.attack) {
          unit.aircraftUnit.separated = true
          airMsg = "Fighter Unit Removed From Air Strike: " + unit.name
          break
        }
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
    console.log("attackResolved=", attackResolved)
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
