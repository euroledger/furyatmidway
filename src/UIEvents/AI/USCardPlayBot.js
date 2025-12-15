import GlobalGameState from "../../model/GlobalGameState"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"
import { distanceBetweenHexes } from "../../components/HexUtils"

function allCarriersDamagedOrAtCapacity(controller) {
  if (
    (controller.getCarrierHits(GlobalUnitsModel.Carrier.ENTERPRISE) >= 2 ||
      !controller.isHangarAvailable(GlobalUnitsModel.Carrier.ENTERPRISE)) &&
    (controller.getCarrierHits(GlobalUnitsModel.Carrier.HORNET) >= 2 ||
      !controller.isHangarAvailable(GlobalUnitsModel.Carrier.HORNET)) &&
    (controller.getCarrierHits(GlobalUnitsModel.Carrier.YORKTOWN) >= 2 ||
      !controller.isHangarAvailable(GlobalUnitsModel.Carrier.YORKTOWN))
  )
    return true
}
export function playCardAction(controller, cardNumber, setAttackResolved, side) {
  switch (cardNumber) {
    case 1:
      // Towed to a Friendly Port
      // If it is turn 3 or later and this card is eligible to be played always play it
      //  Hold back if turns 1 or 2 to prevent IJN player knowing the CV is towed
      return GlobalGameState.gameTurn >= 3
    case 2:
      // Damage Control
      // If any damaged carriers - true
      // (DMCV not eligible)
      let damagedCarriers = controller.getDamagedCarriersOneOrTwoHits(side)
      damagedCarriers = damagedCarriers.filter((cv) => !controller.getCarrier(cv).dmcv)
      return damagedCarriers.length > 0
    case 3:
      // Air Replacements
      const reducedUnits = controller.getAllReducedUnitsForSide(side)
      const eliminatedAirUnits = controller.getAllEliminatedUnits(side)
      if (reducedUnits.length === 0) {
        if (eliminatedAirUnits.length > 0) {
          // make sure there is somewhere for restored unit to go
          if (allCarriersDamagedOrAtCapacity(controller)) {
            return false
          }
        }
      }
      return reducedUnits.length > 0 || eliminatedAirUnits.length > 0

    case 4:
      // Submarine
      return controller.anyTargets(GlobalUnitsModel.Side.JAPAN)
    case 7:
      if (controller.getCardPlayed(6, GlobalUnitsModel.Side.JAPAN)) {
        return true
      }

      // factor would be position of CSF fleet, e.g., if too far away this card be useless

      const locationCSF = controller.getFleetLocation("CSF", GlobalUnitsModel.Side.US)
      const location1AF = controller.getFleetLocation("1AF", GlobalUnitsModel.Side.JAPAN)
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

      console.log("++++++++++++++ distanceBetweenCSFand1AF=", distanceBetweenCSFand1AF)
      if (distanceBetweenCSFand1AF <= 2 || distanceBetweenUSDMCVand1AF <= 2 || GlobalGameState.gameTurn === 7) {
        return true
      }

      return false
    case 8:
      // Alwways play this even if Garrison Level 5 so as to get first roll
      return true

    case 13:
      setAttackResolved(false)
      // critical hit - always play at first opportunity
      return true
    default:
      return false // for now
  }
}
