import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import GlobalGameState from "../../model/GlobalGameState"
import "./modal.css"

function CentredButton() {
  return (
    <p
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button className="justify-content-center btn btn-success btn-sm" disabled="true" style={{ marginTop: "10px" }}>
        Play
      </Button>
    </p>
  )
}
function CardPanel(props) {
  const cardArray =
    props.side === GlobalUnitsModel.Side.JAPAN
      ? GlobalUnitsModel.jpCards.map((c) => c._number)
      : GlobalUnitsModel.usCards.map((c) => c._number)

  const bg = GlobalGameState.gameTurn === 4 ? "black" :"#293a4b"
  const header = `${props.side} Hand`
  const sizey = cardArray.length >= 4 ? "xl" : "lg"

  const createImage = (image) => {
    return (
      <>
        <div>
          <img
            src={image}
            style={{
              width: "200px",
              height: "280px",
              marginLeft: "10px",
              marginRight: "10px"
            }}
          ></img>
        </div>
      </>
    )
  }
  const cards = cardArray.map((card, idx) => {
    const cardIndex = cardArray[idx] < 10 ? "0" + cardArray[idx] : "" + cardArray[idx]
    const image = `/images/cards/MID_Card${cardIndex}.gif`

    return (
      <>
        <div>{createImage(image)}</div>
      </>
    )
  })
  return (
    <Modal {...props} size={sizey} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header
        className="text-center"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: `${bg}`,
          color: "white",
        }}
      >
        <p className="text-center">{header}</p>
      </Modal.Header>
      <Modal.Body style={{ background: `${bg}`, color: "black" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            marginTop: "5px",
          }}
        >
          {cards}
        </div>
      </Modal.Body>
      <Modal.Footer style={{ background: `${bg}`, color: "black" }}>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CardPanel
