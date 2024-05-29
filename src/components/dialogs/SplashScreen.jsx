import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";


function SplashScreen(props) {
  return (
    <Modal
      {...props}
      style={{ width: "1480px" }}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="false"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src="/images/furysplash.jpg"/>;
        <Button className="button-88" size="lg" onClick={props.onSplash} style={{width: "190px", position:"absolute", top: "68%", right:"61%"}}>LOAD GAME</Button>
        <Button className="button-88" size="lg" onClick={props.onSplash} style={{width: "190px", position:"absolute", top: "68%", right:"1%"}}>NEW GAME</Button>
      </div>
    </Modal>
  );
}

export default SplashScreen;

