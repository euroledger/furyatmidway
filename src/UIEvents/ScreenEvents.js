import GlobalGameState from "../model/GlobalGameState"
import Controller from "../controller/Controller"


export function targetSelectionButtonClick(controller, target) {
    GlobalGameState.taskForceTarget = target

    controller.viewEventHandler({
      type: Controller.EventTypes.TARGET_SELECTION,
      data: {
        target: target,
        side: GlobalGameState.sideWithInitiative,
      },
    })
}