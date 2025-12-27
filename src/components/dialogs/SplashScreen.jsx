import { React, useState } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import GlobalGameState from "../../model/GlobalGameState"

function SplashScreen(props) {
  const { loady, splashy, ...rest } = props
  const [showButtons, setShowButtons] = useState(true)
  const [showNewGameButtons, setShowNewGameButtons] = useState(false)
  const [japanPlayer, setJapanPlayer] = useState(GlobalUnitsModel.TYPE.HUMAN)
  const [usPlayer, setUSPlayer] = useState(GlobalUnitsModel.TYPE.HUMAN)
  const [usButton1Class, setUSButton1Class] = useState("button-poo-off")
  const [usButton2Class, setUSButton2Class] = useState("button-poo-off")
  const [jpButton1Class, setJpButton1Class] = useState("button-poo-off")
  const [jpButton2Class, setJpButton2Class] = useState("button-poo-off")
  const [player1Selected, setPlayer1Selected]  = useState(false)
  const [player2Selected, setPlayer2Selected]  = useState(false)

  const newGameHandler = () => {
    setShowButtons(false)
    setShowNewGameButtons(true)
  }

  const setUSPlayerType = (playerType) => {
    setPlayer1Selected(true)
    if (playerType === GlobalUnitsModel.TYPE.AI) {
      setUSButton2Class("button-poo-selected")
      setUSButton1Class("button-poo-off")
      console.log("SET US TO AI")

      GlobalGameState.usPlayerType = GlobalUnitsModel.TYPE.AI
    } else {
      setUSButton1Class("button-poo-selected")
      setUSButton2Class("button-poo-off")
      console.log("SET US TO HUMAN")

      GlobalGameState.usPlayerType = GlobalUnitsModel.TYPE.HUMAN
    }
  }

  
  const setJapanPlayerType = (playerType) => {
    setPlayer2Selected(true)
    if (playerType === GlobalUnitsModel.TYPE.AI) {
      setJpButton2Class("button-poo-selected")
      setJpButton1Class("button-poo-off")
      console.log("SET JAPAN TO AI")

      GlobalGameState.jpPlayerType = GlobalUnitsModel.TYPE.AI
    } else {
      setJpButton1Class("button-poo-selected")
      setJpButton2Class("button-poo-off")
      console.log("SET JAPAN TO HUMAN")
      GlobalGameState.jpPlayerType = GlobalUnitsModel.TYPE.HUMAN
    }
  }

  return (
    <Modal
      {...rest}
      // style={{ width: "1480px" }}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="false"
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <img src="/images/furysplash3.jpg" />
        {showButtons && (
          <Button
            className="button-88"
            size="lg"
            onClick={loady}
            style={{ width: "190px", position: "absolute", top: "68%", right: "61%" }}
          >
            LOAD GAME
          </Button>
        )}
        {showButtons && (
          <Button
            className="button-88"
            size="lg"
            onClick={newGameHandler}
            style={{ width: "190px", position: "absolute", top: "68%", right: "7%" }}
          >
            NEW GAME
          </Button>
        )}
        {showNewGameButtons && (
          <div
            className="div-poo"
            size="lg"
            // onClick={loady}
            style={{
              width: "230px",
              height: "40px",
              position: "absolute",
              top: "48%",
              right: "55%",
            }}
          >
            JAPAN PLAYER
          </div>
        )}
        {showNewGameButtons && (
          <Button
            className={jpButton1Class}
            size="lg"
            onClick={() => setJapanPlayerType(GlobalUnitsModel.TYPE.HUMAN)}
            style={{
              width: "130px",
              position: "absolute",
              top: "48%",
              right: "30%",
            }}
          >
            HUMAN
          </Button>
        )}
        {showNewGameButtons && (
          <Button
          className={jpButton2Class}
          size="lg"
            // onClick={newGameHandler}
            onClick={() => setJapanPlayerType(GlobalUnitsModel.TYPE.AI)}
            style={{
              width: "90px",
              position: "absolute",
              top: "48%",
              right: "10%",
            }}
          >
            AI
          </Button>
        )}
          {showNewGameButtons && (
          <div
            className="div-poo"
            size="lg"
            // onClick={loady}
            style={{
              width: "230px",
              height: "40px",
              position: "absolute",
              top: "38%",
              right: "55%",
            }}
          >
            US PLAYER
          </div>
        )}
        {showNewGameButtons && (
          <Button
            className={usButton1Class}
            size="lg"
            onClick={() => setUSPlayerType(GlobalUnitsModel.TYPE.HUMAN)}
            style={{
              width: "130px",
              position: "absolute",
              top: "38%",
              right: "30%",
            }}
          >
            HUMAN
          </Button>
        )}
        {showNewGameButtons && (
          <Button
            className={usButton2Class}
            size="lg"
            onClick={() => setUSPlayerType(GlobalUnitsModel.TYPE.AI)}
            style={{
              width: "90px",
              position: "absolute",
              top: "38%",
              right: "10%",
            }}
          >
            AI
          </Button>
        )}
         {showNewGameButtons && (
          <Button
          disabled={!(player1Selected && player2Selected)}
          className="button-88"
          size="lg"
            onClick={splashy}
            style={{
              width: "190px",
              position: "absolute",
              top: "64%",
              right: "10%",
            }}
          >
            BEGIN GAME
          </Button>
        )}
      </div>
    </Modal>
  )
}

export default SplashScreen
