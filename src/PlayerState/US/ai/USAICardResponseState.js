import GlobalGameState from "../../../model/GlobalGameState"
import GlobalInit from "../../../model/GlobalInit"
import { delay } from "../../../Utils"
import { setNextStateFollowingCardPlay } from "../../StateUtils"
import GlobalUnitsModel from "../../../model/GlobalUnitsModel"
import HexCommand from "../../../commands/HexCommand"

class USAICardResponseState {
  isTorpedoPlane(unit) {
    return unit.aircraftUnit.attack && !unit.aircraftUnit.diveBomber
  }
  async doAction(stateObject) {
    const { cardNumber, setCarrierPlanesDitchPanelShow, setCardAlertPanelShow } = stateObject
    console.log("**************** DO CARD RESPONSE cardNumber=", cardNumber)
    if (cardNumber === 2) {
      GlobalGameState.testCarrierSelection = -1
      GlobalGameState.updateGlobalState()
      let damagedCarriers = GlobalInit.controller.getDamagedCarriersOneOrTwoHits(GlobalUnitsModel.Side.US)

      damagedCarriers = damagedCarriers.filter((cv) => !GlobalInit.controller.getCarrier(cv).dmcv)

      // TODO should choose the carrier with most planes in the hangar
      let selection = damagedCarriers.findIndex((cv) => GlobalInit.controller.getCarrierHits(cv) === 2)

      if (selection === -1) {
        selection = damagedCarriers.findIndex((cv) => GlobalInit.controller.getCarrierHits(cv) === 1)
      }
      await delay(500)
      GlobalGameState.testCarrierSelection = selection
      GlobalGameState.updateGlobalState()
      await delay(100)
    }
    if (cardNumber === 3) {
      GlobalGameState.testStepLossSelection = -1
      GlobalGameState.updateGlobalState()

      GlobalInit.controller.setCardPlayed(3, GlobalUnitsModel.Side.US)
      const reducedUnits = GlobalInit.controller.getAllReducedUnitsForSide(GlobalUnitsModel.Side.US)
      const eliminatedAirUnits = GlobalInit.controller.getAllEliminatedUnits(GlobalUnitsModel.Side.US)

      const allUnits = reducedUnits.concat(eliminatedAirUnits)
      const selection = Math.floor(Math.random() * allUnits.length)
      await delay(200)
      GlobalGameState.testStepLossSelection = selection
      GlobalGameState.updateGlobalState()

      if (selection < reducedUnits.length) {
        return // selected reduced air unit, no need to select CV
      }
      await delay(100)

      GlobalGameState.testCarrierSelection = -1
      GlobalGameState.updateGlobalState()
      await delay(1800)

      const usCVs = [
        GlobalUnitsModel.Carrier.ENTERPRISE,
        GlobalUnitsModel.Carrier.YORKTOWN,
        GlobalUnitsModel.Carrier.HORNET,
      ]
      let availableUSCVs = usCVs.filter((carrier) => {
        return !GlobalInit.controller.isSunk(carrier, true) && GlobalInit.controller.isHangarAvailable(carrier)
      })

      // Always send air replacement to undamaged carrier if possible
      let allCarriersDamaged = true
      for (const cv of availableUSCVs) {
        if (GlobalInit.controller.getCarrierHits(cv) === 0) {
          allCarriersDamaged = false
          break
        }
      }

      if (!allCarriersDamaged) {
        availableUSCVs = availableUSCVs.filter((cv) => GlobalInit.controller.getCarrierHits(cv) === 0)
      }
      const selectionCV = Math.floor(Math.random() * availableUSCVs.length)

      GlobalGameState.testCarrierSelection = selectionCV
      GlobalGameState.updateGlobalState()
      await delay(800)
      return
    }
    if (cardNumber === 4) {
      GlobalGameState.rollDice = false
      GlobalGameState.testCarrierSelection = -1
      GlobalGameState.updateGlobalState()
      await delay(10)

      let allCarriers = GlobalInit.controller.getAllCarriersForSide(GlobalUnitsModel.Side.JAPAN, true)

      // remove any DMCV carriers in Fleet Box
      allCarriers = allCarriers.filter((carrier) => {
        const location = GlobalInit.controller.getFleetLocation("IJN-DMCV", GlobalUnitsModel.Side.JAPAN)
        return !carrier.dmcv || (carrier.dmcv && location.boxName !== HexCommand.FLEET_BOX)
      })
      console.log("DEBUG >>>>>>>>> SUBMARINE TARGETS FOR US:", allCarriers)
      // Choose CV with 2 damage as target, otherwise 1 damage, otherwise check for planes on deck
      let selection = allCarriers.findIndex((cv) => GlobalInit.controller.getCarrierHits(cv.name) === 2)
      if (selection === -1) {
        selection = allCarriers.findIndex((cv) => GlobalInit.controller.getCarrierHits(cv.name) === 1)
      }
      if (selection === -1) {
        // If no damage select carrier which has planes on deck otherwise random
        selection = allCarriers.findIndex((cv) => {
          return GlobalInit.controller.getNumAircraftOnDeckForNamedCarrier(GlobalUnitsModel.Side.JAPAN, cv.name) === 2
        })

        if (selection === -1) {
          selection = allCarriers.findIndex(
            (cv) =>
              GlobalInit.controller.getNumAircraftOnDeckForNamedCarrier(GlobalUnitsModel.Side.JAPAN, cv.name) === 1
          )
        }
        if (selection === -1) {
          selection = Math.floor(Math.random() * allCarriers.length)
        }
      }
      // let selection = Math.floor(Math.random() * allCarriers.length) // quack testing

      await delay(500)
      GlobalGameState.testCarrierSelection = selection
      GlobalGameState.updateGlobalState()
      await delay(1000)
      GlobalGameState.rollDice = true
      GlobalGameState.updateGlobalState()
    }
    if (cardNumber === 10) {
      setCardAlertPanelShow(false)
      GlobalGameState.testStepLossSelection = -1
      GlobalGameState.updateGlobalState()
      setCarrierPlanesDitchPanelShow(true)
      GlobalInit.controller.setCardPlayed(10, GlobalUnitsModel.Side.JAPAN)
      const unitsInGroup = GlobalInit.controller.getAllUSCarrierPlanesInReturnBoxes()
      const selection = Math.floor(Math.random() * unitsInGroup.length)
      await delay(1000)
      GlobalGameState.testStepLossSelection = selection
      GlobalGameState.updateGlobalState()
      return
    }
    if (cardNumber === 11) {
      for (let i = 0; i < 2; i++) {
        await delay(500)
        let unitsInGroup = GlobalInit.controller.getAttackingStrikeUnits()
        // select TBD as step loss if present
        let unit = unitsInGroup.find((unit) => this.isTorpedoPlane(unit))
        let selection

        if (!unit) {
          selection = Math.floor(Math.random() * unitsInGroup.length)
        } else {
          selection = unitsInGroup.findIndex((u) => u.name === unit.name)
        }
        GlobalGameState.testStepLossSelection = selection
        GlobalGameState.updateGlobalState()

        await delay(10)
        GlobalGameState.testStepLossSelection = -1
        GlobalGameState.updateGlobalState()
      }
    }
  }

  async nextState(stateObject) {
    console.log("MOVE ON FROM CARD RESPONSE...")
    await setNextStateFollowingCardPlay(stateObject)
  }

  getState() {
    return GlobalGameState.PHASE.CARD_RESPONSE
  }
}

export default USAICardResponseState
