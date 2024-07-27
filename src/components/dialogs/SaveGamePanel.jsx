import { React, useState } from "react"
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import GlobalInit from "../../model/GlobalInit"
import "./modal.css"

function SaveGamePanel(props) {
  const [id, setId] = useState("")

  const bg = "#293a4b"
  const size = props.size ? "modal-width" + props.size : "sm"
  
  function handleChange(e) {
    setId(e.target.value)
    props.handler(e.target.value)
  }

  function handleSubmit() {
    props.onHide()
    props.saveGameState(GlobalInit.controller, `fam-${id}`)
    props.setSaveAlertShow(true)
  }
  return (
    <Modal {...props} size={size} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header
        style={{ background: `${bg}`, color: "white", justifyContent: "center", alignItems: "center" }}
      >
        <h4>Save Current Game</h4>
      </Modal.Header>
      <Modal.Body style={{ paddingTop: "100px", background: `${bg}`, color: "white" }}>
        <Form.Control
          style={{ color: "black" }}
          type="text"
          placeholder="Game Id for Game to be Saved"
          onChange={handleChange}
        />
      </Modal.Body>
      <Modal.Footer style={{ background: `${bg}`, color: "black" }}>
        <Button onClick={handleSubmit}>Save</Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default SaveGamePanel
