import { React } from "react"
import "./cap.css"

export function NightHeaders({ controller, side, setNightLandingDone }) {
  let unitsReturn2 = controller.getAllAirUnitsInReturn2Boxes(side)

  const airCounters = unitsReturn2.map((airUnit) => {
    return (
      <div>
        <input
          type="image"
          src={airUnit.image}
          style={{
            width: "80px",
            height: "80px",
            marginLeft: "15px",
            marginRight: "35px",
          }}
          id="bollocks"
        />
        <p
          style={{
            marginLeft: "5px",
            color: "white",
          }}
        >
          {airUnit.name}
        </p>
      </div>
    )
  })

  return (
    <>
      <div>
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          Night Landing: For each air step roll one die: 1-4 landing successful, 5-6 step lost
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {airCounters}
      </div>
    </>
  )
}

export function NightFooters({ totalHits }) {
//   // const show = GlobalGameState.dieRolls.length > 0

//   const show = true
//   const hits = totalHits === -1 ? "" : totalHits
//   const msg = "Total Number of Hits:"


//   return (
//     <>
//       <div
//         style={{
//           marginTop: "10px",
//           marginLeft: "-28px",

//           color: "white",
//         }}
//       >
//         {show && (
//           <>
//             <div>
//               <p
//                 style={{
//                   color: "white",
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               >
//                 {msg} &nbsp;<strong>{hits}</strong>&nbsp;
//               </p>
//             </div>

//             <div
//               style={{
//                 color: "white",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <p>
//                 (click <strong>Next...</strong> to continue)
//               </p>
//             </div>
//           </>
//         )}
//       </div>
//     </>
//   )
}
