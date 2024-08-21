export function doIntiativeRoll(roll0, roll1) {
    // for automated testing
    let sideWithInitiative
    let jpRolls, usRolls
    if (roll0 && roll1) {
      sideWithInitiative = GlobalInit.controller.determineInitiative(roll0, roll1)
      jpRolls = [roll0]
      usRolls = [roll1]
    } else {
      const rolls = randomDice(2)
      sideWithInitiative = GlobalInit.controller.determineInitiative(rolls[0], rolls[1])
      jpRolls = [rolls[0]]
      usRolls = [rolls[1]]
    }
    GlobalGameState.sideWithInitiative = sideWithInitiative

    GlobalInit.controller.viewEventHandler({
      type: Controller.EventTypes.INITIATIVE_ROLL,
      data: {
        jpRolls,
        usRolls,
      },
    })
    setSideWithInitiative(() => sideWithInitiative)
    GlobalGameState.updateGlobalState()
  }
