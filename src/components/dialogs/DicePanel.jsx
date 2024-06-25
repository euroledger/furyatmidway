import Modal from "react-bootstrap/Modal"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Button from "react-bootstrap/Button"
import Die from "./Die"
import { randomDice } from "./DiceUtils"
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
function DicePanel(props) {
  const numDice = props.numDice

  const bg = "#293a4b"
  const rowClass = `g-${numDice}`

  const myBigBollocks = "modal-width" + numDice
  //   const sizey = numDice >= 4 ? "xl" : "lg"
  return (
    <Modal
      {...props}
      size={"lg"}
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName={myBigBollocks}
      centered
    >
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
        <p className="text-center">Dice Roller</p>
      </Modal.Header>
      <Modal.Body style={{ background: `${bg}`, color: "black" }}>
        <Row xs={1} md={numDice} className={rowClass}>
          {Array.from({ length: numDice }).map((_, idx) => {
            const dieName = "dice" + (idx+1)
            return (
              <Col key={idx} className="d-flex">
                <Die name={dieName}></Die>
                {/* <CentredButton /> */}
              </Col>
            )
          })}
        </Row>
      </Modal.Body>
      <Modal.Footer style={{ background: `${bg}`, color: "black" }}>
        <Button onClick={(e) => randomDice(numDice)}>Roll Dice</Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DicePanel
