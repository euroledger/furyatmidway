import GlobalGameState from "../model/GlobalGameState";
import GlobalUnitsModel from "../model/GlobalUnitsModel";
import MoveCommand from "../commands/MoveCommand";
import COMMAND_TYPE from "../commands/COMMAND_TYPE";

class ViewEventAirUnitSetupHandler {
  constructor(controller) {
    this.controller = controller;
  }
  handleEvent(event) {
    // event contains type and data
    const { counterData, name, index } = event.data;

    const { boxName, boxIndex } = this.controller.getAirUnitLocation(
      counterData.name
    );
    const from =
      boxName === GlobalUnitsModel.AirBox.OFFBOARD
        ? "OFFBOARD"
        : boxName + " - box " + boxIndex;
    const to = `${name} - box ${index}`;
    this.controller.addAirUnitToBox(name, index, counterData);
    let command = new MoveCommand(
      COMMAND_TYPE.MOVE,
      counterData.longName,
      from,
      to
    );
    const airUnitsDeployed = this.controller.getAirUnitsDeployed(
      counterData.carrier
    );
    if (airUnitsDeployed.length === 4) {
      // all units deployed -> activate button
      GlobalGameState.phaseCompleted = true;
      GlobalGameState.updateGlobalState();
    }
    GlobalGameState.log(`Command: ${command.toString()}`);

  }
}
export default ViewEventAirUnitSetupHandler;
