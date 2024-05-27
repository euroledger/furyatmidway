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
    name: GlobalUnitsModel.AirBox.JP_CAP_RETURN1,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_1,
    carriers: [GlobalUnitsModel.Carrier.KAGA, GlobalUnitsModel.Carrier.KAGA],
    offsets: [
      {
        left: 5.3,
        top: 83.0,
      },
      {
        left: 7.5,
        top: 83.0,
      },
      {
        left: 9.7,
        top: 83.0,
      },
      {
        left: 11.9,
        top: 83.0,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.JP_CAP_RETURN2,
    taskForce: GlobalUnitsModel.TaskForce.CARRIER_DIV_1,
    carriers: [GlobalUnitsModel.Carrier.KAGA, GlobalUnitsModel.Carrier.KAGA],
    offsets: [
      {
        left: 5.3,
        top: 92.0,
      },
      {
        left: 7.5,
        top: 92.0,
      },
      {
        left: 9.7,
        top: 92.0,
      },
      {
        left: 11.9,
        top: 92.0,
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
];

export default JapanAirBoxOffsets;
