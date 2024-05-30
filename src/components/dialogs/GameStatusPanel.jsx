import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import GameStatePanel from "../leftpanel/GameStatePanel"
import "./modal.css";

function GameStatusPanel(props) {
  // TODO set different colors/header for different alert level, info, warning etc
  const bg = "#FFCCCC";
  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <GameStatePanel gameState={props.gameState} />
      <Modal.Footer style={{backgroundColor: '#293a4b', color: 'black' }}>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default GameStatusPanel;
