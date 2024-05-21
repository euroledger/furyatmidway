import React, { useState } from "react";
import "../../board.css";
import AirCounter from "./AirCounter";

function AirCounters({ controller, onDrag, onStop, getAirBox, setAirBox, counterData }) {
  const counters = Array.from(counterData.values())
  const airCounters = counters.map((airUnit) => {
    if (airUnit.constructor.name === 'AirUnit') {
      return (
        <AirCounter
          controller={controller}
          key={airUnit.name}
          onDrag={onDrag}
          onStop={onStop}
          counterData={airUnit}
          getAirBox={getAirBox}
          setAirBox={setAirBox}
        ></AirCounter>
      );
    }
  });
  return <>{airCounters}</>;
}

export default AirCounters