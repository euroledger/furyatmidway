import { distanceBetweenHexes, isMidwayHex, allHexesWithinDistance } from "../src/components/HexUtils"

const MIDWAY_HEX = {
  q: 6,
  r: 3,
}
test("Is Midway and Distances between two hexes on map", () => {
  let hex1 = MIDWAY_HEX
  expect(isMidwayHex(hex1)).toEqual(true)

  let hex2 = {
    q: 1,
    r: 2,
  } // Hex A, 2

  expect(isMidwayHex(hex2)).toEqual(false)
  expect(distanceBetweenHexes(hex1, hex2)).toEqual(6)

  hex1 = {
    q: 1,
    r: 1,
  } // A, 1
  hex2 = {
    q: 9,
    r: 1,
  } // I, 5
  expect(distanceBetweenHexes(hex1, hex2)).toEqual(8)

  hex1 = {
    q: 1,
    r: 1,
  } // A, 1
  hex2 = {
    q: 9,
    r: -2,
  } // I, 2
  expect(distanceBetweenHexes(hex1, hex2)).toEqual(8)
})

test("Generate regions within certain distance of hex", () => {
  let region = allHexesWithinDistance({ q: 5, r: 1 }, 2, false)
  expect(region).toEqual([
    { q: 3, r: 1 },
    { q: 3, r: 2 },
    { q: 3, r: 3 },
    { q: 4, r: 0 },
    { q: 4, r: 1 },
    { q: 4, r: 2 },
    { q: 4, r: 3 },
    { q: 5, r: -1 },
    { q: 5, r: 0 },
    { q: 5, r: 1 },
    { q: 5, r: 2 },
    { q: 5, r: 3 },
    { q: 6, r: -1 },
    { q: 6, r: 0 },
    { q: 6, r: 1 },
    { q: 6, r: 2 },
    { q: 7, r: -1 },
    { q: 7, r: 0 },
    { q: 7, r: 1 },
  ])

  // exclude Midway from region
  region = allHexesWithinDistance({ q: 7, r: 1 }, 2, true)
  expect(region).toEqual([
    { q: 5, r: 1 },
    { q: 5, r: 2 },
    { q: 5, r: 3 },
    { q: 6, r: 0 },
    { q: 6, r: 1 },
    { q: 6, r: 2 },
    { q: 7, r: -1 },
    { q: 7, r: 0 },
    { q: 7, r: 1 },
    { q: 7, r: 2 },
    { q: 7, r: 3 },
    { q: 8, r: -1 },
    { q: 8, r: 0 },
    { q: 8, r: 1 },
    { q: 8, r: 2 },
    { q: 9, r: -1 },
    { q: 9, r: 0 },
    { q: 9, r: 1 },
  ])
  expect(region.includes(MIDWAY_HEX)).toBe(false)
})
