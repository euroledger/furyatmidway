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
      {
        left: 45.5,
        top: 78.3,
      },
      {
        left: 45.5,
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
      {
        left: 45.5,
        top: 87.0,
      },
      {
        left: 45.5,
        top: 89.8,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.US_ENTERPRISE_HANGAR,
    taskForce: GlobalUnitsModel.TaskForce.TASK_FORCE_16,
    carriers: [GlobalUnitsModel.Carrier.ENTERPRISE],
    offsets: [
      {
        left: 54.0,
        top: 89.0,
      },
      {
        left: 54.0,
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
        left: 58.0,
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
    name: GlobalUnitsModel.AirBox.US_ENTERPRISE_DMCV,
    taskForce: GlobalUnitsModel.TaskForce.US_DMCV,
    carriers: [GlobalUnitsModel.Carrier.ENTERPRISE],
    offsets: [
      {
        left: 53.6,
        top: 82.0
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.US_HORNET_HANGAR,
    taskForce: GlobalUnitsModel.TaskForce.TASK_FORCE_16,
    carriers: [GlobalUnitsModel.Carrier.HORNET],
    offsets: [
      {
        left: 60.0,
        top: 89.0,
      },
      {
        left: 60.0,
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
        left: 64.0,
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
    name: GlobalUnitsModel.AirBox.US_HORNET_DMCV,
    taskForce: GlobalUnitsModel.TaskForce.US_DMCV,
    carriers: [GlobalUnitsModel.Carrier.HORNET],
    offsets: [
      {
        left: 60.1,
        top: 82.0
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
      {
        left: 72.2,
        top: 78.7
      },
      {
        left: 72.2,
        top: 81.5,
      }
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
      {
        left: 72.2,
        top: 87.7
      },
      {
        left: 72.2,
        top: 90.6,
      },
    ],
  },
  {
    name: GlobalUnitsModel.AirBox.US_YORKTOWN_HANGAR,
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
    name: GlobalUnitsModel.AirBox.US_YORKTOWN_DMCV,
    taskForce: GlobalUnitsModel.TaskForce.US_DMCV,
    carriers: [GlobalUnitsModel.Carrier.YORKTOWN],
    offsets: [
      {
        left: 75.7,
        top: 82.0
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
    name: GlobalUnitsModel.AirBox.US_MIDWAY_RETURN1,
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
    name: GlobalUnitsModel.AirBox.US_MIDWAY_RETURN2,
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
    name: GlobalUnitsModel.AirBox.US_MIDWAY_HANGAR,
    taskForce: GlobalUnitsModel.TaskForce.MIDWAY,
    carriers: [GlobalUnitsModel.Carrier.MIDWAY],
    offsets: [
      {
        left: 87.6,
        top: 23.5,
      },
      {
        left: 87.6,
        top: 27.2,
      },
      {
        left: 87.6,
        top: 30.9,
      },
      {
        left: 87.6,
        top: 34.6
      },
      {
        left: 89.7,
        top: 25.4,
      },
      {
        left: 89.7,
        top: 29.0,
      },
      {
        left: 89.7,
        top: 32.6,
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
  {
    name: GlobalUnitsModel.AirBox.US_STRIKE_BOX_0,
    offsets: [
      {
        left: 86.0,
        top: 64.1,
      },
      {
        left: 89.0,
        top: 64.1,
      },
      {
        left: 92.0,
        top: 64.1,
      },
    ]
  },
  {
    name: GlobalUnitsModel.AirBox.US_STRIKE_BOX_1,
    offsets: [
      {
        left: 86.0,
        top: 68.6,
      },
      {
        left: 89.0,
        top: 68.6,
      },
      {
        left: 92.0,
        top: 68.6,
      },
    ]
  },
  {
    name: GlobalUnitsModel.AirBox.US_STRIKE_BOX_2,
    offsets: [
      {
        left: 86.0,
        top: 72.8,
      },
      {
        left: 89.0,
        top: 72.8,
      },
      {
        left: 92.0,
        top: 72.8,
      },
    ]
  },
  {
    name: GlobalUnitsModel.AirBox.US_STRIKE_BOX_3,
    offsets: [
      {
        left: 86.0,
        top: 77.2,
      },
      {
        left: 89.0,
        top: 77.2,
      },
      {
        left: 92.0,
        top: 77.2,
      },
    ]
  },
  {
    name: GlobalUnitsModel.AirBox.US_STRIKE_BOX_4,
    offsets: [
      {
        left: 86.0,
        top: 81.5,
      },
      {
        left: 89.0,
        top: 81.5,
      },
      {
        left: 92.0,
        top: 81.5,
      },
    ]
  },
  {
    name: GlobalUnitsModel.AirBox.US_STRIKE_BOX_5,
    offsets: [
      {
        left: 86.0,
        top: 85.9,
      },
      {
        left: 89.0,
        top: 85.9,
      },
      {
        left: 92.0,
        top: 85.9,
      },
    ]
  },
  {
    name: GlobalUnitsModel.AirBox.US_STRIKE_BOX_6,
    offsets: [
      {
        left: 86.0,
        top: 90.2,
      },
      {
        left: 89.0,
        top: 90.2,
      },
      {
        left: 92.0,
        top: 90.2,
      },
    ]
  },
]

export default USAirBoxOffsets
