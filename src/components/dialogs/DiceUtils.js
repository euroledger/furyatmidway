import GlobalGameState from "../../model/GlobalGameState";
	
export const randomDice = (num) => {
  const rolls = new Array()
  for (let i = 0; i < num; i++) {
    const random = Math.floor(Math.random() * 6) + 1
    rolls.push(random)
  }
  rollDice(rolls)
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
const rollDice = (rolls) => {
  console.log("ROLLS LEN=",rolls.length)
  const diceElements = new Array()
  var audio = new Audio("/sounds/dice.wav");

  audio.play();
  for (let i = 0; i < rolls.length; i++) {
    const dice = document.querySelector(".dice" + (i+1))
   
    dice.style.animation = `rolling${i+1} 1s`
    // dice.style.animation = "rolling 1s"
    // dicey.style.animation = "rolling2 1s"
    // dicew.style.animation = "rolling3 1s"   
    diceElements.push(dice)
  }

  // const dice = document.querySelector(".dice1")
  // const dicey = document.querySelector(".dice2")
  // const dicew = document.querySelector(".dice3")

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

// rollBtn.addEventListener("click", randomDice)
