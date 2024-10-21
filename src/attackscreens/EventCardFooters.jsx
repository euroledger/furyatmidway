import GlobalGameState from "../model/GlobalGameState"
import Die from "../components/dialogs/Die"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"

export function EventCardFooter({ cardNumber, showCardFooter, setShowDice }) {
//   if (cardNumber === 5) {
//     setShowDice(() => true)
//     return (
//       <>
//         {showCardFooter && (
//           <div
//             style={{
//               marginTop: "10px",
//               marginLeft: "-28px",
//             }}
//           >
//             <p
//               style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 color: "white",
//               }}
//             >
//               Roll the die. Midway Garrison reduced by die roll / 2 (rounded down)
//               <br></br>
//             </p>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 color: "white",
//               }}
//             >
//                <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               >
//                 <Row xs={1}>
//                   {Array.from({ length: 1 }).map((_, idx) => {
//                     const dieName = "dice" + (idx + 1)
//                     return (
//                       <Col key={idx} className="d-flex">
//                         <div>
//                           <Die name={dieName}></Die>
//                         </div>
//                       </Col>
//                     )
//                   })}
//                 </Row>
             
//               </div>
//             </div>
//           </div>
//         )}
//       </>
//     )
//   }

  if (cardNumber === 6) {
    setShowDice(false)
    GlobalGameState.SearchValue.JP_AF = 8
    return (
      <>
        {showCardFooter && (
          <div
            style={{
              marginTop: "10px",
              marginLeft: "-28px",
            }}
          >
            <p
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
              }}
            >
              The IJN Search Value for the 1AF is 8 for this turn.
              <br></br>
            </p>
          </div>
        )}
      </>
    )
  }
}
