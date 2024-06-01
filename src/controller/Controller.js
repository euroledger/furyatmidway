import BoxModel from "../model/BoxModel";
import CardModel from "../model/CardModel";
import GlobalUnitsModel from "../model/GlobalUnitsModel";
import ViewEventAirUnitSetupHandler from './ViewEventAirUnitSetupHandler'

export default class Controller {
  static EventTypes = {
    AIR_UNIT_SETUP: "AirUnitSetup",
  };

  constructor() {
    this.boxModel = new BoxModel();
    this.cardModel = new CardModel();
    this.airUnitSetupHandler = new ViewEventAirUnitSetupHandler(this)
  }

  addAirUnitToBox = (boxName, index, value) => {
    this.boxModel.addAirUnitToBox(boxName, index, value);
  };

  removeAirUnitFromBox = (boxName, index) => {
    this.boxModel.removeAirUnitFromBox(boxName, index);
  };

  getAllAirUnitsInBox = (boxName) => {
    return this.boxModel.getAllAirUnitsInBox(boxName);
  };

  getAirUnitInBox = (boxName, index) => {
    return this.boxModel.getAirUnitInBox(boxName, index);
  };

  isAirUnitInBox = (boxName, airUnitName) => {
    return this.boxModel.isAirUnitInBox(boxName, airUnitName);
  };

  getAirUnitLocation = (airUnitName) => {
    return this.boxModel.getAirUnitLocation(airUnitName);
  };

  addAirUnitToCarrier(carrier, value) {
    this.boxModel.addAirUnitToCarrier(carrier, value);
  }

  getAirUnitsForCarrier(carrier) {
    return this.boxModel.getAirUnitsForCarrier(carrier);
  }

  getAirUnitsDeployed(carrier) {
    return this.boxModel.getAirUnitsDeployed(carrier);
  }

  getAirUnit(name) {
    return GlobalUnitsModel.jpAirUnits.get(name)
  }
  
  drawJapanCards(num, initial) {
    this.cardModel.drawJapanCards(num, initial)
  }

  drawUSCards(num, initial) {
    this.cardModel.drawUSCards(num, initial)
  }

  viewEventHandler(event) {
    // event contains type and data

    // TODO for air unit move events, check if it is initial set up or not
    switch (event.type) {
      case Controller.EventTypes.AIR_UNIT_SETUP:
        this.airUnitSetupHandler.handleEvent(event)
        break;

      default:
        console.log(`Unknown event type: ${event.type}`);
    }
  }
}