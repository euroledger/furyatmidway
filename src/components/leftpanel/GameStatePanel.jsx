import React, { useState } from "react"
import GlobalGameState from "../../model/GlobalGameState"
import Accordion from "react-bootstrap/Accordion"
import GlobalInit from "../../model/GlobalInit"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import "./accordion.css"

export default class GameStatePanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gs: props.gameState,
    }
    this.messagesEndRef = React.createRef()
  }

  componentDidMount() {
    this.scrollToBottom()
  }
  componentDidUpdate() {
    this.scrollToBottom()
  }
  scrollToBottom = () => {
    this.messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  appendUSSunkDMCVTowed(carrier) {
    if (GlobalInit.controller.isSunk(carrier, false)) {
      return " -> SUNK"
    }
    const cv = GlobalUnitsModel.usFleetUnits.get(carrier)
    if (cv.towed) {
      return " -> BEING TOWED"
    }

    if (cv.dmcv) {
      // edge case -> do not show DMCV if it was just placed and we are in IJN Fleet Movement
      // (this shouldn't be revealed at this point)
      if (
        GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_FLEET_MOVEMENT &&
        GlobalGameState.usDMCVTurnPlaced === GlobalGameState.gameTurn
      ) {
        return ""
      }
      return " -> DMCV"
    }
    return ""
  }
  render() {
    const logRows = GlobalGameState.logItems.map((logItem, index) => {
      return (
        <div key={index}>
          {logItem} <div ref={this.messagesEndRef}></div>
        </div>
      )
    })
    const mg = GlobalGameState.midwayGarrisonLevel > 0 ? GlobalGameState.midwayGarrisonLevel : "X"
    const mif = GlobalGameState.midwayInvasionLevel > 0 ? GlobalGameState.midwayInvasionLevel : "X"

    let yh = GlobalInit.controller.getCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN)
    let eh = GlobalInit.controller.getCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE)
    let hh = GlobalInit.controller.getCarrierHits(GlobalUnitsModel.Carrier.HORNET)
    const mh = GlobalGameState.totalMidwayHits

    yh = yh + this.appendUSSunkDMCVTowed(GlobalUnitsModel.Carrier.YORKTOWN)
    eh = eh + this.appendUSSunkDMCVTowed(GlobalUnitsModel.Carrier.ENTERPRISE)
    hh = hh + this.appendUSSunkDMCVTowed(GlobalUnitsModel.Carrier.HORNET)

    const mas = GlobalInit.controller.getMidwayAttackAirStrength(GlobalUnitsModel.Side.US)
    const cas = GlobalInit.controller.getCarrierAttackAirStrength(GlobalUnitsModel.Side.US)

    const mfs = GlobalInit.controller.getMidwayFighterAirStrength(GlobalUnitsModel.Side.US)
    const cfs = GlobalInit.controller.getCarrierFighterAirStrength(GlobalUnitsModel.Side.US)
    return (
      <>
        <Accordion defaultActiveKey="1">
          <Accordion.Item eventKey="0" className="bg-dark text-light">
            <Accordion.Header>Game Status</Accordion.Header>
            <Accordion.Body>
              <p className="text-left">
                Turn: {GlobalGameState.gameTurn} - {GlobalGameState.turnText[GlobalGameState.gameTurn - 1]}
              </p>
              <p className="text-left">Japan Air Ops: {GlobalGameState.airOperationPoints.japan}</p>
              <p style={{ marginTop: "-15px" }} className="text-left">
                US Air Ops: {GlobalGameState.airOperationPoints.us}
              </p>
              <p className="text-left">Midway Invasion Force: {mif}</p>
              <p style={{ marginTop: "-15px" }} className="text-left">
                Midway Garrison: {mg}
              </p>
              {/* <p className="text-left">Midway Attack Declaration: {mad}</p> */}
              <p className="text-left">Enterprise Damage: {eh}</p>
              <p style={{ marginTop: "-15px" }} className="text-left">
                Yorktown Damage: {yh}
              </p>
              <p style={{ marginTop: "-15px" }} className="text-left">
                Hornet Damage: {hh}
              </p>
              <p style={{ marginTop: "-15px" }} className="text-left">
                Midway Runway Damage: {mh}
              </p>

              <p style={{ marginTop: "15px" }} className="text-left">
                Midway Attack Strength: {mas} steps
              </p>
              <p style={{ marginTop: "-15px" }} className="text-left">
                Midway Fighter Strength: {mfs} steps
              </p>

              <p className="text-left">US Carrier Attack Strength: {cas} steps</p>
              <p style={{ marginTop: "-15px" }} className="text-left">
                US Carrier Fighter Strength: {cfs} steps
              </p>
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
