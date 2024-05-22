import React from "react";
import DragAndDropSmall from "./DragAndDropSmall";
import JapanAirBoxOffsets from "./JapanAirBoxOffsets";
import "../board.css";
import GlobalGameState from "../../model/GlobalGameState";

function CarrierDropZones({ handleDragEnter }) {
  const japanZones = JapanAirBoxOffsets.map((box, index) => {
    let enabled = true;
    if (
      GlobalGameState.gamePhase === GlobalGameState.PHASE.SETUP &&
      box.name.indexOf("RETURN") != -1
    ) {
      enabled = false;
    }
    return (
      <DragAndDropSmall
        key={index}
        name={box.name}
        handleDragEnter={handleDragEnter}
        zones={box.offsets}
        enabled={enabled}
      ></DragAndDropSmall>
    );
  });
  return <>{japanZones}</>;
}

export default CarrierDropZones;
