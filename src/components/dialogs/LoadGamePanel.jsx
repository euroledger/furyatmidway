import { useState } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col"
import GlobalGameState from "../../model/GlobalGameState"
import "./modal.css"
import GlobalUIConstants from "../UIConstants"
import { deleteAllAutoSavedGames } from "../../PlayerState/StateUtils"
import "./CustomModal.css"
import MinimizeButton from "./MinimizeButton"

function getSavedKey(idx) {
  let keys = Object.keys(localStorage)
  const savedGameArray = keys.filter((key) => key.startsWith("fam-")).map((item) => item.replace("fam-", ""))
  return savedGameArray[idx]
}
function ConfirmPanel({ idx, setShowConfirmPanel }) {
  const key = getSavedKey(idx)
  const fullKey = "fam-" + key

  function removeItem(e, key) {
    localStorage.removeItem(key)
    GlobalGameState.updateGlobalState()
    setShowConfirmPanel(false)
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p style={{ paddingBottom: "50px", paddingTop: "20px" }}></p>
      <p>
        Do you really want to delete <strong>{key}</strong>?{" "}
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button style={{ marginLeft: "10px" }} onClick={(e) => removeItem(e, fullKey, setShowConfirmPanel)}>
            Yes
          </Button>
          <Button style={{ marginLeft: "5px" }} onClick={() => setShowConfirmPanel(false)}>
            No
          </Button>
        </div>
      </p>
    </div>
  )
}

function ConfirmPanelAuto({ setShowConfirmPanelAuto }) {
  function remove(e, key) {
    deleteAllAutoSavedGames()
    setShowConfirmPanelAuto(false)
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      <p style={{ paddingBottom: "50px" }}></p>
      <p>
        Do you really want to delete all auto saved games?{" "}
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button style={{ marginLeft: "10px" }} onClick={(e) => remove(setShowConfirmPanelAuto)}>
            Yes
          </Button>
          <Button style={{ marginLeft: "5px" }} onClick={() => setShowConfirmPanelAuto(false)}>
            No
          </Button>
        </div>
      </p>
    </div>
  )
}

function LoadGamePanel(props) {
  const [idx, setIdx] = useState("")
  const [showConfirmPanel, setShowConfirmPanel] = useState(false)
  const [showConfirmPanelAuto, setShowConfirmPanelAuto] = useState(false)
  const bg = GlobalUIConstants.Colors.BOTH
  const size = props.size ? "modal-width" + props.size : "sm"

  let keys = Object.keys(localStorage)
  const savedGameArray = keys.filter((key) => key.startsWith("fam-")).map((item) => item.replace("fam-", ""))

  function showPanel(e, idx) {
    setIdx(() => idx)
    setShowConfirmPanel(true)
  }

  function minimizeWindow() {
    props.setButtonModalShow(true)
    props.onHide()
  }
  function showAutoPanel() {
    setShowConfirmPanelAuto(true)
  }
  function loadGame(e, idx) {
    const key = "fam-" + savedGameArray[idx]
    props.loadIdHandler(key)
    props.loadMyGameHandler(key)
    props.onHide()
  }

  return (
    <Modal
      {...props}
      dialogClassName={"modal-minimized-modal"}
      aria-labelledby="contained-modal-title-vcenter"
      keyboard={false}
      backdrop="static"
      show={props.show}
    >
      <Modal.Header style={{ background: `${bg}`, color: "white", justifyContent: "center", alignItems: "center" }}>
        <h4>Load Game</h4>
        <MinimizeButton clickHandler={minimizeWindow}></MinimizeButton>
        {/* <Button
          onClick={(e) => minimizeWindow(e)}
          className="d-flex align-items-center"
          variant="outline-primary"
          style={{ color: "white", borderColor: "white", position: "absolute", top: "2%", right: "2%" }}
        >
          <FaWindowMinimize />
        </Button> */}
      </Modal.Header>
      <Modal.Body style={{ paddingTop: "20px", background: `${bg}`, color: "white" }}>
        <p>Select Game to Load or Delete</p>
        <p style={{ paddingTop: "50px" }}></p>
        {savedGameArray.length === 0 && (
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            No Games Saved
          </p>
        )}
        {Array.from({ length: savedGameArray.length }).map((_, idx) => {
          return (
            <>
              <row key={idx} style={{ display: "flex", paddingLeft: "10px", paddingTop: "5px", height: "50px" }}>
                <Col style={{ minWidth: "600px" }} key={idx}>
                  {savedGameArray[idx]}
                </Col>
                <Col style={{ paddingLeft: "50px" }}>
                  <Button
                    onClick={(e) => loadGame(e, idx)}
                    style={{ position: "absolute", right: "20%" }}
                    as="input"
                    type="reset"
                    value="Load"
                  />
                </Col>
                <Col>
                  <Button
                    onClick={(e) => showPanel(e, idx)}
                    style={{ position: "absolute", right: "3%" }}
                    className="delete"
                    as="input"
                    type="reset"
                    value="Delete"
                  />
                </Col>
              </row>
            </>
          )
        })}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "2rem",
          }}
        >
          <Button
            className="delete"
            onClick={(e) => showAutoPanel()}
            as="input"
            type="reset"
            value="Delete Auto Saved Games"
          />
        </div>
        {showConfirmPanel && <ConfirmPanel idx={idx} setShowConfirmPanel={setShowConfirmPanel}></ConfirmPanel>}
        {showConfirmPanelAuto && (
          <ConfirmPanelAuto setShowConfirmPanelAuto={setShowConfirmPanelAuto}></ConfirmPanelAuto>
        )}
      </Modal.Body>
      <Modal.Footer style={{ background: `${bg}`, color: "black" }}>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default LoadGamePanel
