import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import "./modal.css";

function ModalSplash(props) {
  // TODO set different colors/header for different alert level, info, warning etc
  return (
    <Modal {...props} size="xl" aria-labelledby="contained-modal-title-vcenter" centered backdrop="false">
      <Modal.Body>
        <Container>
          <Row className="justify-content-md-center">
            <Col xs={12} sm={4} md={4}>
              {/* <Image src="holder.js/171x180" rounded /> */}
              <Image src="/images/furysplash.jpg" className="img-fluid" />
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalSplash;
