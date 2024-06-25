import "./style.css"
import { randomDice } from "./DiceUtils"

function App() {
  return (
    <div className="App">
      {/* <div className="container"> */}
        <div className="dice">
          <div className="face front"></div>
          <div className="face back"></div>
          <div className="face top"></div>
          <div className="face bottom"></div>
          <div className="face right"></div>
          <div className="face left"></div>
        </div>
        <p>fuck</p>
        <div className="dice2">
          <div className="face front"></div>
          <div className="face back"></div>
          <div className="face top"></div>
          <div className="face bottom"></div>
          <div className="face right"></div>
          <div className="face left"></div>
        </div>
        <p>fuck</p>
        <div className="dice3">
          <div className="face front"></div>
          <div className="face back"></div>
          <div className="face top"></div>
          <div className="face bottom"></div>
          <div className="face right"></div>
          <div className="face left"></div>
        </div>
        <button className="roll" onClick={(e) => randomDice()}>Roll Dice</button>
      </div>
    // </div>
  )
}

export default App
