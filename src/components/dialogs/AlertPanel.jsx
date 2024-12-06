import { useEffect, useRef } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import "./modal.css"
import GlobalGameState from "../../model/GlobalGameState"


function AlertPanel(props) {
  const bg = GlobalGameState.gameTurn === 4 ? "black" :"#293a4b"
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
      <Modal.Body style={{ background: `${bg}`, color: "white" }}>{props.children}</Modal.Body>
      <Modal.Footer style={{ background: `${bg}`, color: "black" }}>
        <Button  ref={buttonRef} onClick={props.onHide} >Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AlertPanel
