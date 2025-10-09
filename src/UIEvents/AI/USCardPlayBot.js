import GlobalGameState from "../../model/GlobalGameState"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"

export function playCardAction(controller, cardNumber) {
  switch (cardNumber) {
    case 7:
      // factor would be position of CSF fleet, e.g., if too far away this card be useless

      const locationCSF = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
      const location1AF = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.US)
      const locationUSDMCV = controller.getFleetLocation("US-DMCV", GlobalUnitsModel.Side.US)

      let distanceBetweenCSFand1AF, distanceBetweenUSDMCVand1AF
      if (
        locationCSF !== undefined &&
        locationCSF.currentHex !== undefined &&
        location1AF !== undefined &&
        location1AF.currentHex !== undefined
      ) {
        distanceBetweenCSFand1AF = distanceBetweenHexes(locationCSF.currentHex, location1AF.currentHex)
      }

      if (
        locationUSDMCV !== undefined &&
        locationUSDMCV.currentHex !== undefined &&
        location1AF !== undefined &&
        location1AF.currentHex !== undefined
      ) {
        distanceBetweenUSDMCVand1AF = distanceBetweenHexes(locationUSDMCV.currentHex, location1AF.currentHex)
      }

      if (distanceBetweenCSFand1AF <= 2 || distanceBetweenUSDMCVand1AF <= 2 || GlobalGameState.gameTurn === 7) {
        return true
      }
      return false
    case 8:
      // semper fi - always play if Midway Garrison is < 5
      return GlobalGameState.midwayGarrisonLevel < 5
    default:
      return false // for now
  }
}
