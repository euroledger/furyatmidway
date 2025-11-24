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

  // for restoring objects during load
  setState(state) {
    this.currentState = state
  }

  getState() {
    return this.currentState.getState()
  }

  async finishStateChange() {
    const { setEnabledJapanBoxes, setEnabledUSBoxes, getJapanEnabledAirBoxes, getUSEnabledAirBoxes } = this.stateObject

    GlobalGameState.updateGlobalState()
    // const enabledBoxes = getJapanEnabledAirBoxes()
    // setEnabledJapanBoxes(() => enabledBoxes)
    const enabledUSBoxes = getUSEnabledAirBoxes()
    setEnabledUSBoxes(() => enabledUSBoxes)
  }
}

export default PlayerStateHandler
