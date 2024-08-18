import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";


function SplashScreen(props) {

  const { loady, splashy, ...rest } = props

  return (
    <Modal
      {...rest}
      // style={{ width: "1480px" }}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="false"
    >
      <div
        style={{         
          position: 'absolute',
           left: '50%',
           top: '50%',
           transform: 'translate(-50%, -50%)'
        }}
      >
        <img src="/images/furysplash.jpg"/>;
        <Button className="button-88" size="lg" onClick={loady} style={{width: "190px", position:"absolute", top: "68%", right:"61%"}}>LOAD GAME</Button>
        <Button className="button-88" size="lg" onClick={splashy} style={{width: "190px", position:"absolute", top: "68%", right:"7%"}}>NEW GAME</Button>
      </div>
    </Modal>
  );
}

export default SplashScreen;

