import Modal from "react-bootstrap/Modal"
import Card from "react-bootstrap/Card"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Button from "react-bootstrap/Button"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"
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

  const bg = "#293a4b"
  const header = `${props.side} Hand`
  const rowClass = `g-${cardArray.length}`
  const sizey = cardArray.length >= 4 ? "xl" : "lg"
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
        <Row xs={1} md={cardArray.length} className={rowClass}>
          {Array.from({ length: cardArray.length }).map((_, idx) => {
            const cardIndex =
              cardArray[idx] < 10
                ? "0" + cardArray[idx]
                : "" + cardArray[idx]
            const image = `/images/cards/MID_Card${cardIndex}.gif`
            return (
              <Col key={idx}>
                <Card>
                  <Card.Img variant="top" src={image} />
                  {/* <Card.Body>
                    <Card.Title>Card title</Card.Title>
                  </Card.Body> */}
                </Card>
                <CentredButton />
              </Col>
            )
          })}
        </Row>
      </Modal.Body>
      <Modal.Footer style={{ background: `${bg}`, color: "black" }}>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CardPanel
