import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import GlobalGameState from "../../model/GlobalGameState"
import "./modal.css"

function YesNoDialog(props) {
  const bg = GlobalGameState.gameTurn === 4 ? "black" :"#293a4b"
  return (
    <Modal {...props} size="sm" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Body style={{ background: `${bg}`, color: "white" }}>{props.children}</Modal.Body>
      <Modal.Footer style={{ background: `${bg}`, color: "black" }}>
        <Button onClick={props.yesHandler}>Yes</Button>
        <Button onClick={props.noHandler}>No</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default YesNoDialog
