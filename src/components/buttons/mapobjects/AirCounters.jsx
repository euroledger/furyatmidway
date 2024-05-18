import React, { useState } from "react";
import "../../board.css";
import DropCommand from "../../../commands/DropCommand";
import COMMAND_TYPE from "../../../commands/COMMAND_TYPE";
import GlobalGameState from "../../../model/GlobalGameState";
import AirCounter from "./AirCounter";

function AirCounters({ onDrag, onStop, getAirBox, counterData }) {
    const vals = Array.from(counterData.values())
    const airCounters = vals.map((airUnit) => {
        if (airUnit.constructor.name === 'AirUnit') {
            return (
                <AirCounter
                    key={airUnit.name}
                    onDrag={onDrag}
                    onStop={onStop}
                    counterData={airUnit}
                    getAirBox={getAirBox}
                ></AirCounter>
            );
        }
    });
    return <>{airCounters}</>;
}

export default AirCounters