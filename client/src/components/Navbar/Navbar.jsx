import "./Navbar.scss";
import Ducklogo from "../../assets/images/ducklogo.png";
import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import ConnectButton from "../ConnectButton/ConnectButton";
import { AiOutlineLogout } from 'react-icons/ai'
import { useWeb3Contract, useMoralis } from "react-moralis";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Navbar = ({ account, logout, chainId, invoicePlatformAddress, contractAbi }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [pan, setPan] = useState("");
  const [name, setName] = useState("");

  const { enableWeb3, isWeb3Enabled, deactivateWeb3, Moralis } = useMoralis();

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

  useEffect(() => {
    if (isWeb3Enabled) return;
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("connected")) {
        enableWeb3();
      }
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log("Account changed", account);
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("Null account found");
      }
    })
  }, [account])


  const { runContractFunction: registerPerson } = useWeb3Contract({
    abi: contractAbi,
    contractAddress: invoicePlatformAddress,
    functionName: "registerPerson",
    params: {
      _pan: pan,
      _name: name,
    }
  });

  const submitHandler = async () => {
    console.log("submitHandler");
    localStorage.setItem("pan", pan);
    localStorage.setItem("name", name);
    hideLogin();
    console.log(invoicePlatformAddress, pan, name, contractAbi);
    await registerPerson({
      onSuccess: handleSuccess,
      onError: (error) => {
        console.log("error", error);
        toast.error("Error in Registration!", { position: toast.POSITION.TOP_CENTER });
      }
    })
  };

  let navigate = useNavigate();

  const connectToWallet = async () => {
    await enableWeb3();
    if (typeof window !== "undefined") {
      window.localStorage.setItem("connected", "injected");
    }
    console.log("Connected to wallet", account);
    // if localStorage does not have a pan, name then show login modal
    if (typeof window !== "undefined") {
      if (!window.localStorage.getItem("pan") || !window.localStorage.getItem("name")) {
        setShowLogin(true);
      }
    }
  }


  return (
    <div className="Navbar">
      <ToastContainer />
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

            <button className="btn btn-warning navbtn"
              onClick={() => {
                navigate("/")
              }}
            >
              Learn More
            </button>

            <button className="btn btn-light logoutbtn navbtn"
              onClick={logout}
            >
              Logout &nbsp; <AiOutlineLogout color="red"
              />
            </button>

          </div>
        </div>
        <div className="col-4 navcol2">
          <ConnectButton connectToWallet={connectToWallet} account={account} />
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
              Register
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Navbar;
