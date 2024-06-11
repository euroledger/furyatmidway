import GlobalUnitsModel from "../../model/GlobalUnitsModel"

const USAirBoxOffsets = [
  {
    name: GlobalUnitsModel.AirBox.US_TF16_CAP,
    taskForce: GlobalUnitsModel.TaskForce.TASK_FORCE_16,
    carriers: [GlobalUnitsModel.Carrier.ENTERPRISE, GlobalUnitsModel.Carrier.HORNET],
    offsets: [
      {
        left: 55.4,
        top: 70.5,
      },
      {
        left: 57.7,
        top: 70.5,
      },
      {
        left: 59.9,
        top: 70.5,
      },
      {
        left: 62.1,
        top: 70.5,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.US_TF16_CAP_RETURN,
    taskForce: GlobalUnitsModel.TaskForce.TASK_FORCE_16,
    carriers: [GlobalUnitsModel.Carrier.ENTERPRISE, GlobalUnitsModel.Carrier.HORNET],
    offsets: [
      {
        left: 50.0,
        top: 72.2,
      },
      {
        left: 50.0,
        top: 74.9,
      },
      {
        left: 52.0,
        top: 72.2,
      },
      {
        left: 52.0,
        top: 74.9,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.US_TF16_RETURN2,
    taskForce: GlobalUnitsModel.TaskForce.TASK_FORCE_16,
    carriers: [GlobalUnitsModel.Carrier.ENTERPRISE, GlobalUnitsModel.Carrier.HORNET],
    offsets: [
      {
        left: 47.2,
        top: 78.3,
      },
      {
        left: 49.1,
        top: 78.3,
      },
      {
        left: 50.8,
        top: 78.3,
      },
      {
        left: 47.2,
        top: 81.0,
      },
      {
        left: 49.1,
        top: 81.0,
      },
      {
        left: 50.8,
        top: 81.0,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.US_TF16_RETURN1,
    taskForce: GlobalUnitsModel.TaskForce.TASK_FORCE_16,
    carriers: [GlobalUnitsModel.Carrier.ENTERPRISE, GlobalUnitsModel.Carrier.HORNET],
    offsets: [
      {
        left: 47.2,
        top: 87.0,
      },
      {
        left: 49.1,
        top: 87.0,
      },
      {
        left: 50.8,
        top: 87.0,
      },
      {
        left: 47.2,
        top: 89.8,
      },
      {
        left: 49.1,
        top: 89.8,
      },
      {
        left: 50.8,
        top: 89.8,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGER,
    taskForce: GlobalUnitsModel.TaskForce.TASK_FORCE_16,
    carriers: [GlobalUnitsModel.Carrier.ENTERPRISE],
    offsets: [
      {
        left: 54.2,
        top: 89.0,
      },
      {
        left: 54.2,
        top: 91.8,
      },
      {
        left: 56.0,
        top: 89.0,
      },
      {
        left: 56.0,
        top: 91.8,
      },
      {
        left: 57.8,
        top: 90.5,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.US_ENTERPRISE_FLIGHT_DECK,
    taskForce: GlobalUnitsModel.TaskForce.TASK_FORCE_16,
    carriers: [GlobalUnitsModel.Carrier.ENTERPRISE],
    offsets: [
      {
        left: 55.5,
        top: 79.2,
      },
      {
        left: 55.5,
        top: 85.0,
      },
    ],
  },
]

export default USAirBoxOffsets
