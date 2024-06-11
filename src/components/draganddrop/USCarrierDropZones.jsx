import React from "react";
import DragAndDropSmall from "./DragAndDropSmall";
import USAirBoxOffsets from "./USAirBoxOffsets"
import "../board.css";
import GlobalGameState from "../../model/GlobalGameState";
import GlobalUnitsModel from "../../model/GlobalUnitsModel";

function USCarrierDropZones({ handleDragEnter, show }) {
  const usZones = USAirBoxOffsets.map((box, index) => {
    let enabled = true;

    // console.log("CURRENT PHASE = ", GlobalGameState.gamePhase)
   if (GlobalGameState.gamePhase === GlobalGameState.PHASE.US_SETUP_AIR) {
      console.log("box name= ", box.name)
      if (
        !box.name.includes(GlobalGameState.getUSCarrier().toUpperCase()) &&
        box.name != GlobalUnitsModel.AirBox.US_TF16_CAP &&
        box.name != GlobalUnitsModel.AirBox.US_TF17_CAP
      ) {
        console.log(
          ">>>>>>>>>>>>> DO NOT DISPLAY, carrier = ",
          GlobalGameState.getUSCarrier().toUpperCase(),
          ", box name = ",
          box.name
        );
        return;
      }
    //   console.log(">>>>>>>>>>>>>>>>>>>>> CARRIER DIV= ", GlobalGameState.currentTaskForce, "BOX NAME = ", box.name)

      if (
        box.name === GlobalUnitsModel.AirBox.US_TF17_CAP &&
        GlobalGameState.currentTaskForce === 1
      ) {
        return;
      }
      if (
        box.name === GlobalUnitsModel.AirBox.US_TF16_CAP &&
        GlobalGameState.currentTaskForce === 2
      ) {
        return;
      }
      if (box.name.includes("RETURN")) {
        enabled = false;
      }
    } else {
      enabled = true
    }
    // console.log(`+++++++++ box name: ${box.name}, enabled = ${enabled}`);
    return (
      <DragAndDropSmall
        key={index}
        name={box.name}
        handleDragEnter={handleDragEnter}
        zones={box.offsets}
        enabled={enabled && show}
      ></DragAndDropSmall>
    );
  });
  return <>{usZones}</>;
}

export default USCarrierDropZones;
