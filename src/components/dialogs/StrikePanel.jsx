import "./panel.css"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"

function StrikeBox({ num, bg }) {
  return (
    <div
      style={{
        marginTop: "3px",
        marginLeft: "10px",
        marginRight: "10px",
        borderRadius: "10px",
        borderColor: "white",
        borderStyle: "solid",
        borderWidth: "1px",
        minHeight: "32px",
        background: `${bg}`,
        color: "black",
      }}
    >
      {`Strike Box ${num}`}
    </div>
  )
}
function StrikePanel({ side, enabled, zIndex }) {
  let txt = "US "
  let bg = "#CCE5FF"
  if (side === GlobalUnitsModel.Side.JAPAN) {
    txt = "Japanese "
    bg = "#FFCCCC"
  }

  let boxes = [1, 2, 3, 4, 5, 6, 7]

  const strikeBoxes = boxes.map((_, index) => {
    return <StrikeBox num={index + 1} bg={bg}></StrikeBox>
  })

  const left = side === GlobalUnitsModel.Side.US ? "82.8%" : "46%"
  return (
    <>
      {enabled && (
        <div
          style={{
            background: "#293a4b",
            color: "white",
            position: "absolute",
            width: "200px",
            height: "290px",
            left: left,
            top: "59%",
            justifyContent: "center",
            borderRadius: "4px",
            borderColor: "white",
            borderStyle: "solid",
            borderWidth: "1px",
            zIndex:zIndex
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <p style={{ fontSize: "12px" }}>{`${txt} Strike Groups`}</p>
          </div>
          <div
            style={{
              textAlign: "center",
            }}
          >
            {strikeBoxes}
          </div>
        </div>
      )}
    </>
  )
}

export default StrikePanel
