// Midway Garrison track

import GlobalUnitsModel from "../../model/GlobalUnitsModel"

const JapanAirBoxOffsets = [
  {
    name: GlobalUnitsModel.AirBox.JP_CD1_CAP,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_1,
    carriers: [GlobalUnitsModel.Carrier.AKAGI, GlobalUnitsModel.Carrier.KAGA],
    offsets: [
      {
        left: 15.4,
        top: 68.3,
      },
      {
        left: 17.7,
        top: 68.3,
      },
      {
        left: 19.9,
        top: 68.3,
      },
      {
        left: 22.1,
        top: 68.3,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.JP_AKAGI_HANGAR,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_1,
    carriers: [GlobalUnitsModel.Carrier.AKAGI],
    offsets: [
      {
        left: 13.8,
        top: 90.5,
      },
      {
        left: 13.8,
        top: 93.4,
      },
      {
        left: 15.9,
        top: 90.5,
      },
      {
        left: 15.9,
        top: 93.4,
      },
      {
        left: 17.9,
        top: 91.9,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.JP_AKAGI_FLIGHT_DECK,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_1,
    carriers: [GlobalUnitsModel.Carrier.AKAGI],
    offsets: [
      {
        left: 15.7,
        top: 79.5,
      },
      {
        left: 15.7,
        top: 86.0,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_1,
    carriers: [GlobalUnitsModel.Carrier.AKAGI, GlobalUnitsModel.Carrier.KAGA],
    offsets: [
      {
        left: 9.3,
        top: 72.0,
      },
      {
        left: 9.3,
        top: 74.7,
      },
      {
        left: 11.3,
        top: 72.0,
      },
      {
        left: 11.3,
        top: 74.7,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.JP_CD1_RETURN2,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_1,
    carriers: [GlobalUnitsModel.Carrier.AKAGI, GlobalUnitsModel.Carrier.KAGA],
    offsets: [
      {
        left: 6.5,
        top: 81.0,
      },
      {
        left: 8.3,
        top: 83.9,
      },
      {
        left: 6.5,
        top: 83.9,
      },
      {
        left: 8.3,
        top: 81.0,
      },
      {
        left: 10.0,
        top: 83.9,
      },
      {
        left: 10.0,
        top: 81.0,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.JP_CD1_RETURN1,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_1,
    carriers: [GlobalUnitsModel.Carrier.AKAGI, GlobalUnitsModel.Carrier.KAGA],
    offsets: [
      {
        left: 6.5,
        top: 90.0,
      },
      {
        left: 8.3,
        top: 90.0,
      },
      {
        left: 6.5,
        top: 93.0,
      },
      {
        left: 8.3,
        top: 93.0,
      },
      {
        left: 10.0,
        top: 90.0,
      },
      {
        left: 10.0,
        top: 93.0,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.JP_KAGA_HANGAR,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_1,
    carriers: [GlobalUnitsModel.Carrier.KAGA],
    offsets: [
      {
        left: 20.0,
        top: 90.5,
      },
      {
        left: 20.0,
        top: 93.4,
      },
      {
        left: 22.1,
        top: 90.5,
      },
      {
        left: 22.1,
        top: 93.4,
      },
      {
        left: 24.1,
        top: 91.9,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.JP_KAGA_FLIGHT_DECK,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_1,
    carriers: [GlobalUnitsModel.Carrier.KAGA],
    offsets: [
      {
        left: 22.1,
        top: 79.5,
      },
      {
        left: 22.1,
        top: 86.0,
      },

    ],
  },

  // CAR DIV 2
  {
    name: GlobalUnitsModel.AirBox.JP_CD2_CAP,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_2,
    carriers: [GlobalUnitsModel.Carrier.HIRYU, GlobalUnitsModel.Carrier.SORYU],
    offsets: [
      {
        left: 34.5,
        top: 68.3,
      },
      {
        left: 36.6,
        top: 68.3,
      },
      {
        left: 38.8,
        top: 68.3,
      },
      {
        left: 41.0,
        top: 68.3,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.JP_HIRYU_HANGAR,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_2,
    carriers: [GlobalUnitsModel.Carrier.HIRYU],
    offsets: [
      {
        left: 32.8,
        top: 90.0,
      },
      {
        left: 32.8,
        top: 93.0,
      },
      {
        left: 34.9,
        top: 90.0,
      },
      {
        left: 34.9,
        top: 93.0,
      },
      {
        left: 36.9,
        top: 91.9,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.JP_HIRYU_FLIGHT_DECK,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_2,
    carriers: [GlobalUnitsModel.Carrier.HIRYU],
    offsets: [
      {
        left: 34.5,
        top: 79.5,
      },
      {
        left: 34.5,
        top: 86.0,
      },

    ],
  },
  {
    name: GlobalUnitsModel.AirBox.JP_CD2_CAP_RETURN,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_2,
    carriers: [GlobalUnitsModel.Carrier.HIRYU, GlobalUnitsModel.Carrier.SORYU],
    offsets: [
      {
        left: 28.4,
        top: 72.0,
      },
      {
        left: 28.4,
        top: 74.7,
      },
      {
        left: 30.4,
        top: 72.0,
      },
      {
        left: 30.4,
        top: 74.7,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.JP_CD2_RETURN2,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_2,
    carriers: [GlobalUnitsModel.Carrier.HIRYU, GlobalUnitsModel.Carrier.SORYU],
    offsets: [
      {
        left: 26.3,
        top: 81.0,
      },
      {
        left: 28.2,
        top: 83.9,
      },
      {
        left: 26.3,
        top: 83.9,
      },
      {
        left: 28.2,
        top: 81.0,
      },
      {
        left: 30.1,
        top: 83.9,
      },
      {
        left: 30.1,
        top: 81.0,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.JP_CD2_RETURN1,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_2,
    carriers: [GlobalUnitsModel.Carrier.HIRYU, GlobalUnitsModel.Carrier.SORYU],
    offsets: [
      {
        left: 26.3,
        top: 90.0,
      },
      {
        left: 28.2,
        top: 92.9,
      },
      {
        left: 26.3,
        top: 92.9,
      },
      {
        left: 28.2,
        top: 90.0,
      },
      {
        left: 30.1,
        top: 92.9,
      },
      {
        left: 30.1,
        top: 90.0,
      },
    ],
  },

  // SORYU
  {
    name: GlobalUnitsModel.AirBox.JP_SORYU_HANGAR,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_2,
    carriers: [GlobalUnitsModel.Carrier.SORYU],
    offsets: [
      {
        left: 38.9,
        top: 90.0,
      },

      {
        left: 41.0,
        top: 90.0,
      },
      {
        left: 38.9,
        top: 93.0,
      },
      {
        left: 41.0,
        top: 93.0,
      },
      {
        left: 43.0,
        top: 91.9,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.JP_SORYU_FLIGHT_DECK,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_2,
    carriers: [GlobalUnitsModel.Carrier.SORYU],
    offsets: [
      {
        left: 40.9,
        top: 79.5,
      },
      {
        left: 40.9,
        top: 86.0,
      },

    ],
  },
]

export default JapanAirBoxOffsets
