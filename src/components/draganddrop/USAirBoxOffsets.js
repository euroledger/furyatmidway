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
  {
    name: GlobalUnitsModel.AirBox.US_HORNET_HANGER,
    taskForce: GlobalUnitsModel.TaskForce.TASK_FORCE_16,
    carriers: [GlobalUnitsModel.Carrier.HORNET],
    offsets: [
      {
        left: 60.2,
        top: 89.0,
      },
      {
        left: 60.2,
        top: 91.8,
      },
      {
        left: 62.0,
        top: 89.0,
      },
      {
        left: 62.0,
        top: 91.8,
      },
      {
        left: 63.8,
        top: 90.5,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.US_HORNET_FLIGHT_DECK,
    taskForce: GlobalUnitsModel.TaskForce.TASK_FORCE_16,
    carriers: [GlobalUnitsModel.Carrier.HORNET],
    offsets: [
      {
        left: 62.0,
        top: 79.2,
      },
      {
        left: 62.0,
        top: 85.0,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.US_TF17_CAP,
    taskForce: GlobalUnitsModel.TaskForce.TASK_FORCE_17,
    carriers: [GlobalUnitsModel.Carrier.YORKTOWN],
    offsets: [
      {
        left: 77.7,
        top: 70.5,
      },
      {
        left: 79.8,
        top: 70.5,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.US_TF17_CAP_RETURN,
    taskForce: GlobalUnitsModel.TaskForce.TASK_FORCE_17,
    carriers: [GlobalUnitsModel.Carrier.YORKTOWN],
    offsets: [
      {
        left: 71.5,
        top: 72.6,
      },
      {
        left: 73.3,
        top: 72.6,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.US_TF17_RETURN2,
    taskForce: GlobalUnitsModel.TaskForce.TASK_FORCE_17,
    carriers: [GlobalUnitsModel.Carrier.YORKTOWN],
    offsets: [
      {
        left: 66.7,
        top: 78.7,
      },
      {
        left: 68.6,
        top: 78.7,
      },
      {
        left: 70.5,
        top: 78.7,
      },
      {
        left: 66.7,
        top: 81.5,
      },
      {
        left: 68.6,
        top: 81.5,
      },
      {
        left: 70.5,
        top: 81.5,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.US_TF17_RETURN1,
    taskForce: GlobalUnitsModel.TaskForce.TASK_FORCE_17,
    carriers: [GlobalUnitsModel.Carrier.YORKTOWN],
    offsets: [
      {
        left: 66.7,
        top: 87.7,
      },
      {
        left: 68.6,
        top: 87.7,
      },
      {
        left: 70.5,
        top: 87.7,
      },
      {
        left: 66.7,
        top: 90.6,
      },
      {
        left: 68.6,
        top: 90.6,
      },
      {
        left: 70.5,
        top: 90.6,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.US_YORKTOWN_HANGER,
    taskForce: GlobalUnitsModel.TaskForce.TASK_FORCE_17,
    carriers: [GlobalUnitsModel.Carrier.YORKTOWN],
    offsets: [
      {
        left: 75.2,
        top: 89.0,
      },
      {
        left: 77.2,
        top: 89.0,
      },
      {
        left: 79.2,
        top: 90.1,
      },
      {
        left: 75.2,
        top: 91.8,
      },
      {
        left: 77.2,
        top: 91.8,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.US_YORKTOWN_FLIGHT_DECK,
    taskForce: GlobalUnitsModel.TaskForce.TASK_FORCE_17,
    carriers: [GlobalUnitsModel.Carrier.YORKTOWN],
    offsets: [
      {
        left: 77.6,
        top: 79.2,
      },
      {
        left: 77.6,
        top: 85.0,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.US_MIDWAY_CAP,
    taskForce: GlobalUnitsModel.TaskForce.MIDWAY,
    carriers: [GlobalUnitsModel.Carrier.MIDWAY],
    offsets: [
      {
        left: 81.3,
        top: 24.0,
      },
      {
        left: 81.3,
        top: 27.1,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.US_MIDWAY_CAP_RETURN,
    taskForce: GlobalUnitsModel.TaskForce.MIDWAY,
    carriers: [GlobalUnitsModel.Carrier.MIDWAY],
    offsets: [
      {
        left: 84.5,
        top: 15.0,
      },
      {
        left: 84.5,
        top: 18.2,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.US_MIDWAY_RETURN2,
    taskForce: GlobalUnitsModel.TaskForce.MIDWAY,
    carriers: [GlobalUnitsModel.Carrier.MIDWAY],
    offsets: [
      {
        left: 83.5,
        top: 41.0,
      },
      {
        left: 83.5,
        top: 43.8,
      },
      {
        left: 83.5,
        top: 46.6,
      },
      {
        left: 85.4,
        top: 41.0,
      },
      {
        left: 85.4,
        top: 43.8,
      },
      {
        left: 85.4,
        top: 46.6,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.US_MIDWAY_RETURN1,
    taskForce: GlobalUnitsModel.TaskForce.MIDWAY,
    carriers: [GlobalUnitsModel.Carrier.MIDWAY],
    offsets: [
      {
        left: 83.5,
        top: 50.0,
      },
      {
        left: 83.5,
        top: 52.8,
      },
      {
        left: 83.5,
        top: 55.6,
      },
      {
        left: 85.4,
        top: 50.0,
      },
      {
        left: 85.4,
        top: 52.8,
      },
      {
        left: 85.4,
        top: 55.6,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.US_MIDWAY_HANGER,
    taskForce: GlobalUnitsModel.TaskForce.MIDWAY,
    carriers: [GlobalUnitsModel.Carrier.MIDWAY],
    offsets: [
      {
        left: 88.7,
        top: 22.0,
      },
      {
        left: 88.7,
        top: 24.7,
      },
      {
        left: 88.7,
        top: 27.4,
      },
      {
        left: 88.7,
        top: 30.1,
      },
      {
        left: 88.7,
        top: 32.8,
      },
      {
        left: 88.7,
        top: 35.5,
      },
      {
        left: 88.7,
        top: 38.2,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.US_MIDWAY_FLIGHT_DECK,
    taskForce: GlobalUnitsModel.TaskForce.MIDWAY,
    carriers: [GlobalUnitsModel.Carrier.MIDWAY],
    offsets: [
      {
        left: 84.9,
        top: 26.4,
      },
      {
        left: 84.9,
        top: 31.0,
      },
      {
        left: 84.9,
        top: 35.6,
      },
    ],
  },
]

export default USAirBoxOffsets
