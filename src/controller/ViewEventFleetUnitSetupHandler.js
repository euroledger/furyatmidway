import GlobalGameState from "../model/GlobalGameState";
import GlobalUnitsModel from "../model/GlobalUnitsModel";
import MoveCommand from "../commands/MoveCommand";
import COMMAND_TYPE from "../commands/COMMAND_TYPE";

class ViewEventFleetUnitSetupHandler {
  constructor(controller) {
    this.controller = controller;
  }
  handleEvent(event) {
    // event contains type and data
    console.log("Fleet Unit Event!")
    // const { counterData, name, index } = event.data;

    // const { boxName, boxIndex } = this.controller.getAirUnitLocation(
    //   counterData.name
    // );
    // const from =
    //   boxName === GlobalUnitsModel.AirBox.OFFBOARD
    //     ? "OFFBOARD"
    //     : boxName + " - box " + boxIndex;
    // const to = `${name} - box ${index}`;

    // // console.log(`Add air unit ${counte rData.name} to box ${name}, index ${index}`)
    // this.controller.addAirUnitToBox(name, index, counterData);
    // let command = new MoveCommand(
    //   COMMAND_TYPE.MOVE,
    //   counterData.longName,
    //   from,
    //   to
    // );
    // // console.log("Next free zone -> ", this.controller.getFirstAvailableZone(name))
    // const airUnitsDeployed = this.controller.getAirUnitsDeployed(
    //   counterData.carrier
    // );
    // if (airUnitsDeployed.length === 4) {
    //   // all units deployed -> activate button
    //   GlobalGameState.phaseCompleted = true;
    //   GlobalGameState.updateGlobalState();
    // }
    // GlobalGameState.log(`Command: ${command.toString()}`);

  }
}
export default ViewEventFleetUnitSetupHandler;
