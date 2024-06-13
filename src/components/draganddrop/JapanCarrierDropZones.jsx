import React from "react";
import DragAndDropSmall from "./DragAndDropSmall";
import JapanAirBoxOffsets from "./JapanAirBoxOffsets";
import "../board.css";
import GlobalGameState from "../../model/GlobalGameState";
import GlobalUnitsModel from "../../model/GlobalUnitsModel";

function JapanCarrierDropZones({ handleDragEnter, show }) {
  const japanZones = JapanAirBoxOffsets.map((box, index) => {
    let enabled = true;

    // console.log("CURRENT PHASE = ", GlobalGameState.gamePhase)
   if (GlobalGameState.gamePhase === GlobalGameState.PHASE.JAPAN_SETUP) {
      // console.log("box name= ", box.name)
      if (
        !box.name.includes(GlobalGameState.getJapanCarrier().toUpperCase()) &&
        box.name != GlobalUnitsModel.AirBox.JP_CD1_CAP &&
        box.name != GlobalUnitsModel.AirBox.JP_CD2_CAP
      ) {
        // console.log(
        //   ">>>>>>>>>>>>> DO NOT DISPLAY, carrier = ",
        //   GlobalGameState.getCarrier().toUpperCase(),
        //   ", box name = ",
        //   box.name
        // );
        return;
      }
      // console.log(">>>>>>>>>>>>>>>>>>>>> CARRIER DIV= ", GlobalGameState.currentCarrierDivision, "BOX NAME = ", box.name)

      if (
        box.name === GlobalUnitsModel.AirBox.JP_CD2_CAP &&
        GlobalGameState.currentCarrierDivision === 1
      ) {
        return;
      }
      if (
        box.name === GlobalUnitsModel.AirBox.JP_CD1_CAP &&
        GlobalGameState.currentCarrierDivision === 2
      ) {
        return;
      }
      if (box.name.includes("RETURN")) {
        enabled = false;
      }
    } else {
      enabled = false
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
  return <>{japanZones}</>;
}

export default JapanCarrierDropZones;
