import JapanAirBoxOffsets from "../components/draganddrop/JapanAirBoxOffsets";
import GlobalUnitsModel from "./GlobalUnitsModel";

export default function builModels() {
  // Top Level Map
  // GlobalUnitsModel.unitMap.set(
  //   GlobalUnitsModel.Side.JAPAN,
  //   GlobalUnitsModel.japanTaskForceMap
  // );
  // GlobalUnitsModel.unitMap.set(
  //   GlobalUnitsModel.Side.US,
  //   GlobalUnitsModel.usTaskForceMap
  // );

  // // Task Force Maps
  // GlobalUnitsModel.japanTaskForceMap.set(
  //   GlobalUnitsModel.TaskForce.CARRIER_DIV_1,
  //   GlobalUnitsModel.carrierDiv1Map
  // );
  // GlobalUnitsModel.japanTaskForceMap.set(
  //   GlobalUnitsModel.TaskForce.CARRIER_DIV_2,
  //   GlobalUnitsModel.carrierDiv2Map
  // );
  // GlobalUnitsModel.usTaskForceMap.set(
  //   GlobalUnitsModel.TaskForce.TASK_FORCE_16,
  //   GlobalUnitsModel.taskForce16Map
  // );

  // GlobalUnitsModel.usTaskForceMap.set(
  //   GlobalUnitsModel.TaskForce.TASK_FORCE_17,
  //   GlobalUnitsModel.taskForce17Map
  // );

  // // Carrier Maps
  // GlobalUnitsModel.carrierDiv1Map.set(GlobalUnitsModel.Carrier.AKAGI, GlobalUnitsModel.akagiMap) 
  // GlobalUnitsModel.carrierDiv1Map.set(GlobalUnitsModel.Carrier.KAGA, GlobalUnitsModel.kagaMap) 
  // GlobalUnitsModel.carrierDiv2Map.set(GlobalUnitsModel.Carrier.HIRYU, GlobalUnitsModel.hiryuMap) 
  // GlobalUnitsModel.carrierDiv2Map.set(GlobalUnitsModel.Carrier.SORYU, GlobalUnitsModel.soryuMap) 

  // GlobalUnitsModel.taskForce16Map.set(GlobalUnitsModel.Carrier.ENTERPRISE, GlobalUnitsModel.enterpriseMap) 
  // GlobalUnitsModel.taskForce16Map.set(GlobalUnitsModel.Carrier.HORNET, GlobalUnitsModel.hornetMap) 
  // GlobalUnitsModel.taskForce17Map.set(GlobalUnitsModel.Carrier.YORKTOWN, GlobalUnitsModel.yorktownMap)

  // // Box Maps, name -> array of boxes
  // // set up air offsets map
  // const sideMap = GlobalUnitsModel.unitMap.get(GlobalUnitsModel.Side.JAPAN)

  // for (const box of JapanAirBoxOffsets) {
  //   // get the right map for this side, tf, carrier
  //   const tfMap = sideMap.get(box.taskForce)
    
  //   for (const carrier of box.carriers) {
  //     const carrierMap = tfMap.get(carrier)
  //     carrierMap.set(box.name, box.offsets)
  //   }
  // }
}
