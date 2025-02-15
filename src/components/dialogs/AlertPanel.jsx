import { useEffect, useRef } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import "./modal.css"
import GlobalGameState from "../../model/GlobalGameState"
import GlobalUIConstants from "../UIConstants"

function AlertPanel(props) {
  let sidebg = GlobalGameState.gameTurn === 4 ? "black" : GlobalUIConstants.Colors.BOTH
  if (props.sidebg !== undefined && GlobalGameState.gameTurn !== 4) {
    sidebg = props.sidebg
  }

  const size = props.size ? "modal-width" + props.size : "sm"

  const buttonRef = useRef(null)

  useEffect(() => {
    if (buttonRef.current) {
      if (GlobalGameState.closePanel === true) {
        buttonRef.current.click()
      }
    }
  }, [GlobalGameState.closePanel])
  return (
    <Modal {...props} size={size} aria-labelledby="contained-modal-title-vcenter" centered backdrop="static">
      <Modal.Body style={{ background: `${sidebg}`, color: "white" }}>{props.children}</Modal.Body>
      <Modal.Footer style={{ background: `${sidebg}`, color: "black" }}>
        <Button ref={buttonRef} onClick={props.onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AlertPanel
