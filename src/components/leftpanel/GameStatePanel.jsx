import React, { useState } from "react"
import GlobalGameState from "../../model/GlobalGameState"
import Accordion from "react-bootstrap/Accordion"
import "./accordion.css"

export default class GameStatePanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gs: props.gameState,
    }
  }

  render() {
    const logRows = GlobalGameState.logItems.map((logItem, index) => {
      return <div key={index}>{logItem}</div>
    })
    const mg = GlobalGameState.midwayGarrisonLevel > 0 ? GlobalGameState.midwayGarrisonLevel : "X"
    const mif = GlobalGameState.midwayInvasionLevel > 0 ? GlobalGameState.midwayInvasionLevel : "X"
    const mad = GlobalGameState.midwayAttackDeclaration ? "Yes" : "No"

    return (
      <>
        <Accordion defaultActiveKey="1">
          <Accordion.Item eventKey="0" className="bg-dark text-light">
            <Accordion.Header>Game Status</Accordion.Header>
            <Accordion.Body>
              <p className="text-left">
                Turn: {GlobalGameState.gameTurn} - {GlobalGameState.turnText[GlobalGameState.gameTurn - 1]}
              </p>
              <p className="text-left">Japan Air Ops: {GlobalGameState.airOperationPoints["japan"]}</p>
              <p className="text-left">US Air Ops: {GlobalGameState.airOperationPoints["us"]}</p>
              <p className="text-left">Midway Invasion Force: {mif}</p>
              <p className="text-left">Midway Garrison: {mg}</p>
              <p className="text-left">Midway Attack Declaration: {mad}</p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1" className="bg-dark text-light">
            <Accordion.Header>Game Log</Accordion.Header>
            <Accordion.Body
              style={{
                maxHeight: "400px",
                overflowY: "scroll",
              }}
            >
              {logRows}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </>
    )
  }
}
