import React, { useState } from "react";
import GlobalGameState from "../../model/GlobalGameState";
import Accordion from 'react-bootstrap/Accordion';
import "./accordion.css"

export default class GameStatePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gs: props.gameState,
    };
  }
  
  render() {
    const logRows = GlobalGameState.logItems.map((logItem, index) => {
      return <div key={index}>{logItem}</div>;
    });
    const initialLogItems = ["Logging Here buggy"];

    const mg = GlobalGameState.midwayGarrisonLevel > 0 ? GlobalGameState.midwayGarrisonLevel : "X";
    const mif = GlobalGameState.midwayInvasionLevel > 0 ? GlobalGameState.midwayInvasionLevel : "X";

    return (
      <>
       <Accordion defaultActiveKey="1">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Accordion Item #1</Accordion.Header>
        <Accordion.Body>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Accordion Item #2</Accordion.Header>
        <Accordion.Body>
        {logRows}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
          
        
      </>
    );
  }
}
