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
]

export default USAirBoxOffsets