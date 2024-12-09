import GlobalGameState from "../model/GlobalGameState"

class PlayerStateHandler {
  constructor(stateObject, startingState) {
    this.actionComplete = false
    this.stateObject = stateObject
    this.currentState = startingState
  }

  isActionComplete() {
    return this.actionComplete
  }

  setActionComplete(ac) {
    this.actionComplete = ac
  }

  getState() {
    return this.currentState.getState()
  }

  async finishStateChange() {
    const { setEnabledJapanBoxes, setEnabledUSBoxes, getJapanEnabledAirBoxes, getUSEnabledAirBoxes } = this.stateObject
    GlobalGameState.setupPhase++

    GlobalGameState.updateGlobalState()
    const enabledBoxes = getJapanEnabledAirBoxes()
    setEnabledJapanBoxes(() => enabledBoxes)
    const enabledUSBoxes = getUSEnabledAirBoxes()
    setEnabledUSBoxes(() => enabledUSBoxes)
    console.log("GlobalGameState.setupPhase now", GlobalGameState.setupPhase)
  }
}

export default PlayerStateHandler
