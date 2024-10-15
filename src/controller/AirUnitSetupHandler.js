import GlobalUnitsModel from "../model/GlobalUnitsModel"
import GlobalGameState from "../model/GlobalGameState"

export function determineAllUnitsDeployedForCarrier(controller, side, carrier) {
  if (side === GlobalUnitsModel.Side.JAPAN) {
    const airUnitsDeployed = controller.getJapaneseAirUnitsDeployed(carrier)
    if (airUnitsDeployed.length === 4) {
      // all units deployed -> activate button
      GlobalGameState.phaseCompleted = true
    } else {
      GlobalGameState.phaseCompleted = false
    }
  } else {
    const airUnitsDeployed = controller.getUSAirUnitsDeployed(carrier)
    const numAirUnitsInCarrier = GlobalGameState.currentCarrier === 3 ? 7 : 5
    if (airUnitsDeployed.length === numAirUnitsInCarrier) {
      // all units deployed -> activate button

      GlobalGameState.phaseCompleted = true
    } else {
      GlobalGameState.phaseCompleted = false
    }
  }
  GlobalGameState.updateGlobalState()
}
