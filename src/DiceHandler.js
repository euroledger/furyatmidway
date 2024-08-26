import { randomDice } from "./components/dialogs/DiceUtils"
import GlobalGameState from "./model/GlobalGameState"
import Controller from "./controller/Controller"
import GlobalUnitsModel from "./model/GlobalUnitsModel"


export function doIntiativeRoll(controller, roll0, roll1) {
    // for automated testing
    let sideWithInitiative
    let jpRolls, usRolls
    if (roll0 && roll1) {
      sideWithInitiative = controller.determineInitiative(roll0, roll1)
      jpRolls = [roll0]
      usRolls = [roll1]
    } else {
      const rolls = randomDice(2)
      sideWithInitiative = controller.determineInitiative(rolls[0], rolls[1])
      jpRolls = [rolls[0]]
      usRolls = [rolls[1]]
    }
    GlobalGameState.sideWithInitiative = sideWithInitiative

    console.log("controller.EventTypes=", controller.EventTypes)
    controller.viewEventHandler({
      type: Controller.EventTypes.INITIATIVE_ROLL,
      data: {
        jpRolls,
        usRolls,
      },
    })
    return sideWithInitiative
  }

  export function doSelectionRoll(controller, roll0) {
    GlobalGameState.dieRolls = 0

    // for automated testing
    let actualTarget
    let theRoll
    if (roll0) {
      actualTarget = controller.determineTarget(roll0) 
      theRoll = [roll0]
    } else {
      const rolls = randomDice(1)
      actualTarget = controller.determineTarget(rolls[0])
      theRoll = [rolls[0]]
    }
    GlobalGameState.airAttackTarget = actualTarget  

    console.log("QUACK target=", actualTarget)
   controller.viewEventHandler({
      type: Controller.EventTypes.TARGET_SELECTION_ROLL,
      data: {
        theRoll,
        target: actualTarget,
        side: GlobalGameState.sideWithInitiative
      },
    })
  }

  export function doCAP(controller) {
    GlobalGameState.dieRolls = 0

    const sideBeingAttacked =
    GlobalGameState.sideWithInitiative === GlobalUnitsModel.Side.US
      ? GlobalUnitsModel.Side.JAPAN
      : GlobalUnitsModel.Side.US
    const capBox = controller.getCAPBoxForTaskForce(GlobalGameState.airAttackTarget, sideBeingAttacked)

    const capUnits = controller.getAllAirUnitsInBox(capBox)

    const rolls = randomDice(capUnits.length * 2)

  }
