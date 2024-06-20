export const convertCoords = (q, r) => {
  const r1 = q >= 2 ? r + Math.floor(q / 2) : r

  const row = String.fromCharCode(q - 1 + "A".charCodeAt(0))
  return { q1: row, r1 }
}

export const hexOrigin = {
  x: -15.3,
  y: -20.5,
}

export const hexSize = 29.07

export const axialToCube = (hex) => {
    const q = hex.q
    const r = hex.r
    const s = -q-r
    return { q, r, s}
}
export const isMidwayHex = (hex) => {
  return hex.q === 6 && hex.r === 3
}

export const flatHexToPixel = (hex) => {
  const x = hexSize * ((3 / 2) * hex.q) + hexOrigin.x
  const y = hexSize * ((Math.sqrt(3) / 2) * hex.q + Math.sqrt(3) * hex.r) + hexOrigin.y
  return { x, y }
}

export const cubeSubtract = (a, b) => {
  const hexA = axialToCube(a)
  const hexB = axialToCube(b) 
  return { q: hexA.q - hexB.q, r: hexA.r - hexB.r, s: hexA.s - hexB.s }
}

export const distanceBetweenHexes = (a, b) => {
  const hexA = axialToCube(a)
  const hexB = axialToCube(b) 

  const { q, r, s } = cubeSubtract(hexA, hexB)
  return (Math.abs(q) + Math.abs(r) + Math.abs(s)) /2
}

// export const distanceBetweenHexes = (start, dest) => {
//   return Math.max(
//     Math.abs(dest.r - start.r),     
//     Math.abs(Math.ceil(dest.r / -2) + dest.q - Math.ceil(start.r / -2) - start.q),
//     Math.abs(-dest.r - Math.ceil(dest.r / -2) - dest.q + start.r  + Math.ceil(start.r / -2) + start.q)
// )
// }
