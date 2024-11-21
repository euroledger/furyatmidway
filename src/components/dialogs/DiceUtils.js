import GlobalGameState from "../../model/GlobalGameState";

// just get the result, no dice graphics
export const randomDieRolls = (num) => {
  const rolls = new Array()
  for (let i = 0; i < num; i++) {
    const random = Math.floor(Math.random() * 6) + 1
    rolls.push(random)
  }
  return rolls
}

export const randomDice = (num, testRolls) => {
  if (testRolls) {
    rollDice(testRolls)
    return testRolls
  }
  const rolls = new Array()
  for (let i = 0; i < num; i++) {
    const random = Math.floor(Math.random() * 6) + 1
    rolls.push(random)
  }
  rollDice(rolls)
  return rolls
}

export const randomDiceWithOffset = (num, offset) => {
  const rolls = new Array()
  for (let i = 0; i < num; i++) {
    const random = Math.floor(Math.random() * 6) + 1
    rolls.push(random)
  }
  rollDice(rolls, offset)
  return rolls
}

const spin = (r, dice) => {
  switch (r) {
    case 1:
      dice.style.transform = "rotateX(0deg) rotateY(0deg)"
      break

    case 6:
      dice.style.transform = "rotateX(180deg) rotateY(0deg)"
      break

    case 2:
      dice.style.transform = "rotateX(-90deg) rotateY(0deg)"
      break

    case 5:
      dice.style.transform = "rotateX(90deg) rotateY(0deg)"
      break

    case 3:
      dice.style.transform = "rotateX(0deg) rotateY(90deg)"
      break

    case 4:
      dice.style.transform = "rotateX(0deg) rotateY(-90deg)"
      break

    default:
      break
  }
}
const rollDice = (rolls, ix) => {
  const diceElements = new Array()
  var audio = new Audio("/sounds/dice.wav");

  audio.play();
  for (let i = 0; i < rolls.length; i++) {
    let dix = i
    if (ix) {
      dix = i + ix
    }
    const dice = document.querySelector(".dice" + (dix+1))
   
    dice.style.animation = `rolling${i+1} 1s`  
    diceElements.push(dice)
  }

  setTimeout(() => {
   
    for (let i = 0; i < rolls.length; i++) {
      spin(rolls[i], diceElements[i])
    }
    for (let i = 0; i < rolls.length; i++) {
      diceElements[i].style.animation = "none"
    }
    GlobalGameState.dieRolls = rolls
    GlobalGameState.updateGlobalState()
   
  }, 400)
}