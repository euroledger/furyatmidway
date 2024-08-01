import Modal from "react-bootstrap/Modal"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Button from "react-bootstrap/Button"
import Die from "./Die"
import "./modal.css"

function DicePanel(props) {
  const { numDice, headerText, headers, footers, disabled, onHide, doRoll, ...rest } = props
  // const numDice = props.numDice

  const bg = "#293a4b"
  const rowClass = `g-${numDice}`

  const myBigBollocks = "modal-width" + numDice
  //   const sizey = numDice >= 4 ? "xl" : "lg"
  return (
    <Modal
      {...rest}
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
        <p className="text-center">{headerText}</p>
      </Modal.Header>
      <Modal.Body style={{ background: `${bg}`, color: "black" }}>
        <div style={{ marginLeft: "28px" }}>
          {headers}
          <Row xs={1} md={numDice} className={rowClass}>
            {Array.from({ length: numDice }).map((_, idx) => {
              const dieName = "dice" + (idx + 1)
              return (
                <Col key={idx} className="d-flex">
                  <Die name={dieName}></Die>
                </Col>
              )
            })}
          </Row>
          {footers}
        </div>
      </Modal.Body>

      <Modal.Footer style={{ background: `${bg}`, color: "black" }}>
        <Button disabled={disabled} onClick={(e) => doRoll(e)}>
          Roll Dice
        </Button>
        <Button disabled={!disabled} onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DicePanel
