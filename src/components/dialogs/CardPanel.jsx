import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import "./modal.css";

function CardPanel(props) {
  const bg = "#f0f0f5";
  const header = `Hand of Cards: ${props.side}`
  const rowClass = `g-${props.cardArray.length}`
  const sizey = props.cardArray.length >= 4 ? "xl" : "lg"
  return (
    <Modal {...props} size={sizey} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header
        className="text-center"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: `${bg}`
        }}
      >
        <p className="text-center">{header}</p>
      </Modal.Header>
      <Modal.Body style={{ background: `${bg}`, color: "black" }}>
        <Row xs={1} md={props.cardArray.length} className={rowClass}>
          {Array.from({ length: props.cardArray.length }).map((_, idx) => {
            const cardIndex = props.cardArray[idx] < 10 ? "0" + props.cardArray[idx] : "" + props.cardArray[idx];
            const image = `/images/cards/MID_Card${cardIndex}.gif`;
            return (
              <Col key={idx}>
                <Card>
                  <Card.Img variant="top" src={image} />
                  {/* <Card.Body>
                    <Card.Title>Card title</Card.Title>
                  </Card.Body> */}
                </Card>
                <p
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    className="justify-content-center btn btn-success btn-sm"
                    disabled="true"
                    style={{ marginTop: "10px" }}
                  >
                    Play
                  </Button>
                </p>
              </Col>
            );
          })}
        </Row>
      </Modal.Body>
      <Modal.Footer style={{ background: `${bg}`, color: "black" }}>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CardPanel;
