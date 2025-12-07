import { distanceBetweenHexes, isMidwayHex, allHexesWithinDistance, interveningHexes } from "../src/components/HexUtils"

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
  let region = allHexesWithinDistance({ q: 5, r: 1 }, 2, false, false)
  const r1 = region.map((element) => {
    return { q: element.q, r: element.r }
  })

  expect(r1).toEqual([
    { q: 3, r: 1 },
    { q: 3, r: 2 },
    { q: 3, r: 3 },
    { q: 4, r: 0 },
    { q: 4, r: 1 },
    { q: 4, r: 2 },
    { q: 4, r: 3 },
    { q: 5, r: -1 },
    { q: 5, r: 0 },
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
  const r2 = region.map((element) => {
    return { q: element.q, r: element.r }
  })
  expect(r2).toEqual([
    { q: 5, r: 1 },
    { q: 5, r: 2 },
    { q: 5, r: 3 },
    { q: 6, r: 0 },
    { q: 6, r: 1 },
    { q: 6, r: 2 },
    { q: 7, r: -1 },
    { q: 7, r: 0 },
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

test("Find intervening hexes on Two Hex Path", () => {
  // A2 -> C3 only one intervening hex (B3)

  let hex1 = {
    q: 1,
    r: 2,
  } // Hex A, 2

  let hex2 = {
    q: 3,
    r: 2,
  } // Hex C, 3

  let ih = interveningHexes(hex1, hex2)

  expect(ih.length).toEqual(1) // should be (2,2) -> [B,3]
  expect(ih[0].q).toEqual(2)
  expect(ih[0].r).toEqual(2)

  // A2 -> C2 two intervening hexes (B-2 and B-3)

  hex2 = {
    q: 3,
    r: 1,
  } // Hex C, 3

  ih = interveningHexes(hex1, hex2)
  expect(ih.length).toEqual(2) // should be (2,2) -> [B,3] and (2,1) [B,2]
  expect(ih[0].q).toEqual(2)
  expect(ih[0].r).toEqual(1)

  expect(ih[1].q).toEqual(2)
  expect(ih[1].r).toEqual(2)
})
