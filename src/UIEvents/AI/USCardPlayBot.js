import GlobalGameState from "../../model/GlobalGameState"
import GlobalUnitsModel from "../../model/GlobalUnitsModel"

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
      // If this card is eligible to be played always play it
      return true
    case 3:
      console.log("PLAY CARD 3???????")
      const reducedUnits = controller.getAllReducedUnitsForSide(side)
      const eliminatedAirUnits = controller.getAllEliminatedUnits(side)

      console.log("reducedUnits=", reducedUnits, "eliminatedAirUnits=", eliminatedAirUnits)

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
      console.log("PLAY CARD 4???????")

      // TODO
      // If any IJN CVs still afloat -> true
      return controller.anyTargets(GlobalUnitsModel.Side.JAPAN)

    // Q: Can this card be played against a DMCV ?

    // Submarine
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

    case 13:
      setAttackResolved(false)
      // critical hit - always play at first opportunity
      return true
    default:
      return false // for now
  }
}
