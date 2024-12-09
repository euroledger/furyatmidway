export function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export function getRandomElementFrom (array) {
  return array[Math.floor((Math.random()*array.length))];
}
