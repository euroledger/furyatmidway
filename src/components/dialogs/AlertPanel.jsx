import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import "./modal.css"

function AlertPanel(props) {
  // TODO set different colors/header for different alert level, info, warning etc
  const bg = "#293a4b"
  return (
    <Modal {...props} size="sm" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Body style={{ background: `${bg}`, color: "white" }}>{props.children}</Modal.Body>
      <Modal.Footer style={{ background: `${bg}`, color: "black" }}>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AlertPanel
