import React from "react";
import DragAndDropSmall from "./DragAndDropSmall";
import JapanAirBoxOffsets from "./JapanAirBoxOffsets";
import "../board.css";
import GlobalGameState from "../../model/GlobalGameState";
import GlobalUnitsModel from "../../model/GlobalUnitsModel";

function CarrierDropZones({ handleDragEnter }) {
  const japanZones = JapanAirBoxOffsets.map((box, index) => {
    let enabled = true;

    if (GlobalGameState.gamePhase === GlobalGameState.PHASE.SETUP) {
      if (
        !box.name.includes(GlobalGameState.getCarrier().toUpperCase()) &&
        box.name != GlobalUnitsModel.AirBox.JP_CD1_CAP &&
        box.name != GlobalUnitsModel.AirBox.JP_CD2_CAP
      ) {
        // console.log(">>>>>>>>>>>>> RETURN, box name = ", box.name);
        return;
      }
      if (box.name.indexOf("RETURN") != -1) {
        enabled = false;
      }
    }

    console.log(">>>>>>>>>>>>> Carrier name = ", GlobalGameState.getCarrier());

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
