import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import GameStatePanel from "../leftpanel/GameStatePanel"
import "./modal.css"

function GameStatusPanel(props) {
  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Body style={{ backgroundColor: "#003300", color: "black" }}>
        <GameStatePanel gameState={props.gameState} />
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#003300", color: "black" }}>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default GameStatusPanel
