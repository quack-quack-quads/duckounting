import "./Navbar.scss";
import Ducklogo from "../../assets/images/ducklogo.png";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import ConnectButton from "../ConnectButton/ConnectButton";
import { AiOutlineLogout } from 'react-icons/ai'

const Navbar = (props) => {
  const [showLogin, setShowLogin] = useState(false);
  const [pan, setPan] = useState("");
  const [name, setName] = useState("");

  const hideLogin = () => {
    setShowLogin(false);
  };

  const handlePan = (event) => {
    setPan(event.target.value);
  };
  const handleName = (event) => {
    setName(event.target.value);
  };

  const submitHandler = () => {
    localStorage.setItem("pan", pan);
    localStorage.setItem("name", name);
    hideLogin();
  };
  

  return (
    <div className="Navbar">
      <div className="row">
        <div className="col-8 navcol1">
          <a
            className="nav-link dropdown-toggle"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <img
              src={Ducklogo}
              className="logodrop"
              role="button"
              id="navbarDropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            ></img>
          </a>

          {/* list of dropdown items */}

          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <button className="btn btn-light logoutbtn"
              onClick={props.logout}
              >
                  Logout &nbsp; <AiOutlineLogout color="red"
                  />
              </button>
          </div>
        </div>
        <div className="col-4 navcol2">
          <ConnectButton setShowLogin={setShowLogin} />
        </div>
      </div>

      {/* login modal */}
      <Modal show={showLogin} onHide={hideLogin} className="loginModal">
        <Modal.Title className="loginTitle">We need some deets...</Modal.Title>
        <Modal.Body className="loginBody">
          <label htmlFor="nameinp">Name</label>
          <input
            type="text"
            className="form-control"
            id="nameinp"
            placeholder="Ducky Duckington"
            onChange={handleName}
          />
          <div className="space"></div>
          <label htmlFor="paninp">PAN Number</label>
          <input
            type="text"
            className="form-control"
            id="paninp"
            placeholder="DUCKS9669D"
            onChange={handlePan}
          />
          <div className="row btnrow">
            <button className="btn modbuttons btn-warning" onClick={hideLogin}>
              Skip
            </button>
            <button className="btn modbuttons btn-warning" onClick={submitHandler}>
              Save Locally
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Navbar;
