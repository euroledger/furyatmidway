// Midway Garrison track

import GlobalUnitsModel from "../../model/GlobalUnitsModel";

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
    name: GlobalUnitsModel.AirBox.JP_AKAGI_HANGER,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_1,
    carriers: [GlobalUnitsModel.Carrier.AKAGI],
    offsets: [
      {
        left: 14.7,
        top: 90.5,
      },
      {
        left: 14.7,
        top: 93.7,
      },
      {
        left: 16.9,
        top: 90.5,
      },
      {
        left: 16.9,
        top: 93.7,
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
        top: 86.0,
      },
      {
        left: 15.7,
        top: 79.5,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.JP_KAGA_CAP_RETURN1,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_1,
    carriers: [GlobalUnitsModel.Carrier.AKAGI, GlobalUnitsModel.Carrier.KAGA],
    offsets: [
      {
        left: 7.5,
        top: 81.0,
      },
      {
        left: 9.7,
        top: 84.2,
      },
      {
        left: 7.5,
        top: 84.2,
      },
     
      {
        left: 9.7,
        top: 81.0,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.JP_CD1_CAP_RETURN2,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_1,
    carriers: [GlobalUnitsModel.Carrier.KAGA, GlobalUnitsModel.Carrier.KAGA],
    offsets: [
      {
        left: 7.5,
        top: 90.0,
      },
      {
        left: 9.7,
        top: 90.0,
      },
      {
        left: 7.5,
        top: 93.2,
      },
      {
        left: 9.7,
        top: 93.2,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.JP_KAGA_HANGER,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_1,
    carriers: [GlobalUnitsModel.Carrier.KAGA],
    offsets: [
      {
        left: 20.7,
        top: 90.5,
      },
      {
        left: 20.7,
        top: 93.7,
      },
      {
        left: 22.9,
        top: 90.5,
      },
      {
        left: 22.9,
        top: 93.7,
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
        top: 86.0,
      },
      {
        left: 22.1,
        top: 79.5,
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
    name: GlobalUnitsModel.AirBox.JP_HIRYU_HANGER,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_2,
    carriers: [GlobalUnitsModel.Carrier.HIRYU],
    offsets: [
      {
        left: 33.7,
        top: 90.5,
      },
      {
        left: 33.7,
        top: 93.7,
      },
      {
        left: 35.9,
        top: 90.5,
      },
      {
        left: 35.9,
        top: 93.7,
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
        top: 86.0,
      },
      {
        left: 34.5,
        top: 79.5,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.JP_CD2_CAP_RETURN2,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_2,
    carriers: [GlobalUnitsModel.Carrier.HIRYU, GlobalUnitsModel.Carrier.SORYU],
    offsets: [
      {
        left: 26.5,
        top: 81.0,
      },
      {
        left: 28.7,
        top: 84.2,
      },
      {
        left: 26.5,
        top: 84.2,
      },
     
      {
        left: 28.7,
        top: 81.0,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.JP_HIRYU_CAP_RETURN1,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_2,
    carriers: [GlobalUnitsModel.Carrier.HIRYU, GlobalUnitsModel.Carrier.SORYU],
    offsets: [
      {
        left: 26.5,
        top: 90.0,
      },
      {
        left: 28.7,
        top: 93.2,
      },
      {
        left: 26.5,
        top: 93.2,
      },
     
      {
        left: 28.7,
        top: 90.0,
      },
    ],
  },

  // SORYU
  {
    name: GlobalUnitsModel.AirBox.JP_SORYU_HANGER,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_2,
    carriers: [GlobalUnitsModel.Carrier.SORYU],
    offsets: [
      {
        left: 39.7,
        top: 90.5,
      },
     
      {
        left: 41.9,
        top: 90.5,
      },
      {
        left: 39.7,
        top: 93.7,
      },
      {
        left: 41.9,
        top: 93.7,
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
        top: 86.0,
      },
      {
        left: 40.9,
        top: 79.5,
      },
    ],
  },
];

export default JapanAirBoxOffsets;
