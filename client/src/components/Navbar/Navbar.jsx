import "./Navbar.scss";
import Ducklogo from "../../assets/images/ducklogo.png";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import ConnectButton from "../ConnectButton/ConnectButton";
import { abi, contractAddress } from "../../constants/index";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const { account } = useMoralis();
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const invoicePlatformAddress = chainId in contractAddress ? contractAddress[chainId][0] : null;

  
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

  const handleSuccess = () => {
      console.log("success");
      toast.success("Sucessfully Registered!", { position: toast.POSITION.TOP_CENTER });
  }

  
  const { runContractFunction: registerPerson } = useWeb3Contract({
    abi: abi[chainId],
    contractAddress: invoicePlatformAddress,
    functionName: "registerPerson",
    params: {
      _pan: pan,
      _name: name,
    }
  });
  
  const submitHandler = async() => {
    localStorage.setItem("pan", pan);
    localStorage.setItem("name", name);
    hideLogin();
    await registerPerson({
      onSuccess: handleSuccess,
      onError: (error) => {
        console.log("error", error);
        toast.error("Error in Registration!", { position: toast.POSITION.TOP_CENTER });
      }
    })
  };

  return (
    <div className="Navbar">
      <ToastContainer />
      <div className="row">
        <div className="col-8 navcol1">
          <span className="logospan d-none d-sm-inline">
            <img
              src={Ducklogo}
              className="logo"
              role="button"
              id="navbarDropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            ></img>
            {/* <h3 className="logotext">
                        Duckounting
                    </h3> */}
          </span>
          {/* <button type="button" className="btn infobutton d-none d-sm-inline">Learn More</button> */}

          <a
            className="nav-link dropdown-toggle d-inline d-sm-none"
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
          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <h3 className="logotext droplogo">Duckounting</h3>
            <a className="dropdown-item" href="#">
              Learn More
            </a>
            {/* <a className="dropdown-item" href="#">Something else here</a> */}
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
            <button className="btn modbuttons" onClick={hideLogin}>
              Skip
            </button>
            <button className="btn modbuttons" onClick={submitHandler}>
              Register
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Navbar;
