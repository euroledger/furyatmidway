import { React, useState } from "react"

import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import "./modal.css"
import GlobalInit from "../../model/GlobalInit"

function SubmarineAlertPanel(props) {
  const {
    controller,
    headerText,
    setShowCardFooter,
    cardNumber,
    onHide,
    nextAction,
    width,
    eventHandler,
    margin,
    setSubmarineDamagePanelShow,
    setSubmarineAlertPanelShow,
    setTowedCVSelected,
    towedCV,
    ...rest
  } = props

  const [closeButtonDisabled, setCloseButtonDisabled] = useState(true)
  const [footers, setFooters] = useState([])

  const closeHandler = (e) => {
    onHide(e)
  }

  const noHandler = (e) => {
    onHide(e)
    setSubmarineDamagePanelShow(true)
  }

  const yesHandler = (e) => {

    // negate the effects of Card #1 Towed to Friendly Port

    let msg = `Carrier ${towedCV} is no longer being towed`

    setFooters(
      <div
        style={
          {
            // marginTop: "10px",
            // marginLeft: "-28px",
          }
        }
      >
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          {msg}
        </p>
      </div>
    )
    const carrier = controller.getCarrier(towedCV)
    carrier.towed = false
    setTowedCVSelected("")
    setCloseButtonDisabled(false)
  }

  const bg = "#293a4b"

  let myBigBollocks = "modal-width" + 2

  if (width) {
    myBigBollocks = `maxWidth: ${width}%`
  }

  if (margin) {
    myBigMargin = margin
  }

  const headers = (
    <>
      <div
        style={{
          marginTop: "10px",
          marginLeft: "-28px",
        }}
      >
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          Card #1 'Towed to a Friendly Port':
        </p>
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          Click &nbsp;<strong>'Yes'</strong>&nbsp; to negate, &nbsp;<strong>'No'</strong>&nbsp; to Proceed to #4 &nbsp;
          <strong>Submarine</strong>&nbsp; Panel
        </p>
      </div>
    </>
  )
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
        <p className="text-center">
          <h4>{headerText}</h4>
        </p>
      </Modal.Header>
      <Modal.Body style={{ background: `${bg}`, color: "black" }}>
        <div style={{ marginLeft: "28px" }}>
          {headers}

          {footers}
        </div>
      </Modal.Body>

      <Modal.Footer style={{ background: `${bg}`, color: "black" }}>
        <Button disabled={!closeButtonDisabled} onClick={(e) => yesHandler(e)}>
          Yes
        </Button>
        <Button
          disabled={!closeButtonDisabled}
          onClick={(e) => {
            noHandler(e)
          }}
        >
          No
        </Button>
        <Button disabled={closeButtonDisabled} onClick={(e) => closeHandler(e)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default SubmarineAlertPanel
