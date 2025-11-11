import { FaWindowMinimize } from "react-icons/fa6"
import Button from "react-bootstrap/Button"

function MinimizeButton({ clickHandler }) {
  return (
    <Button
      onClick={(e) => clickHandler(e)}
      className="d-flex align-items-center"
      variant="outline-primary"
      style={{ color: "white", borderColor: "white", position: "absolute", top: "2%", right: "2%" }}
    >
      <FaWindowMinimize />
    </Button>
  )
}

export default MinimizeButton
