import React, { useState } from "react";

export default class GlobalGameState {
  static PHASE = {
    SETUP: 1,
    MOVE: 2
  }

  static SETUP_MESSAGES = [
    'Place Akagi Air Units',
    'Place Kaga Air Units',
    'Place Hiryu Air Units',
    'Place Soryu Air Units'
  ]

  
  static gameTurn = 1;

  static airOperationPoints = {
    japan: 0,
    us: 0,
  };

  static stateHandler;

  static midwayInvasionLevel = 5;

  static midwayGarrisonLevel = 6;

  static turnText = [
    "June 4, 1942 Morning",
    "June 4, 1942 Afternoon",
    "June 4, 1942 Evening",
    "June 5, 1942 Night",
    "June 5, 1942 Morning",
    "June 5, 1942 Afternoon",
    "June 5, 1942 Evening",
  ];

  static log = (message) => {
    this.logItems.push(message);
    this.stateHandler();
  };

  static logItems = ["Logging begin..."];

  static gamePhase = this.PHASE.SETUP
  static setupPhase = 0;

  static getSetupMessage = () => {
    return this.SETUP_MESSAGES[this.setupPhase]
  }
}
