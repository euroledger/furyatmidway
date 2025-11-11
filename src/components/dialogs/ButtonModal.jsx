import { useState } from "react"
import { Modal, Button } from "react-bootstrap"
import "./CustomModal.css"

function ButtonModal(props) {
  const { show, ...rest } = props

  const [showy, setShowy] = useState(false)

  const handleClick = () => {
    setShowy(false)
    props.setButtonModalShow(false)
    props.restoreFunction(true)
  }
  if (show !== showy) {
    setShowy(show)
  }
  const image = "/images/japanflag.jpg"

  return (
    <Modal show={showy} contentClassName="modal-height" dialogClassName="my-modal" backdrop={false}>
      <Modal.Header style={{ borderBottom: "none" }}>
        <Button
          onClick={() => handleClick()}
          style={{ padding: "0", margin: "0", borderRadius: "5px", border: "2px solid white" }}
        >
          <img style={{ height: "40px", width: "50px" }} src={image} />
        </Button>
      </Modal.Header>
    </Modal>
  )
}

export default ButtonModal
