import GlobalGameState from "../model/GlobalGameState"

export function AirOpsHeaders({ show }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <img
          src="/images/japanflag.jpg"
          style={{
            width: "100px",
            height: "60px",
            marginLeft: "-25px",
            marginRight: "45px",
          }}
        />
        <p
          style={{
            marginLeft: "-24px",
            color: "white",
          }}
        >
          Japan Die Roll
        </p>
      </div>
      <div>
        <img
          src="/images/usaflag.jpg"
          style={{
            width: "100px",
            height: "60px",
            marginRight: "14px",
          }}
        />
        <p
          style={{
            marginLeft: "10px",

            color: "white",
          }}
        >
          US Die Roll
        </p>
      </div>
    </div>
  )
}

export function AirOpsFooters({ controller }) {
  const rolls = GlobalGameState.dieRolls
  const show = GlobalGameState.dieRolls.length > 0
  console.log("GlobalGameState.dieRolls.length=", GlobalGameState.dieRolls.length, "SHOW AIR OPS FOOTERS=", show)

  const sideWithInitiative = controller.determineInitiative(rolls[0], rolls[1])

  const initText = sideWithInitiative !== null ? `${sideWithInitiative} has initiative` : "re roll required"
  return (
    <>
      {show && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "15px",
          }}
        >
          <div
            style={{
              color: "white",
            }}
          >
            <p>
              Japan {rolls[0]} + {GlobalGameState.airOperationPoints.japan} Air Ops - TOTAL{" "}
              <strong>{rolls[0] + GlobalGameState.airOperationPoints.japan}</strong>
            </p>
            <p>
              US {rolls[1]} + {GlobalGameState.airOperationPoints.us} Air Ops - TOTAL{" "}
              <strong>{rolls[1] + GlobalGameState.airOperationPoints.us}</strong>
            </p>
            <p>{initText}</p>
          </div>
        </div>
      )}
    </>
  )
}
