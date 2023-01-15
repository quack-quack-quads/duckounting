import "./Navbar.scss";
import Ducklogo from '../../assets/images/ducklogo.png'
import { useState } from "react";
import { Modal } from "react-bootstrap";
import ConnectButton from "../ConnectButton/ConnectButton";

const Navbar = () => {
    const [showLogin, setShowLogin] = useState(true);
    const [pan, setPan] = useState("");
    const [name, setName] = useState("");

    const hideLogin = () => {
        setShowLogin(false);
    }

    const handlePan = event => {
        setPan(event.target.value);
    }
    const handleName = event => {
        setName(event.target.value);
    }

    const submitHandler = () => {
        localStorage.setItem('name', name);
        localStorage.setItem('pan', pan);
        console.log(name, pan);
        hideLogin();
    }

    return <div className="Navbar">
        <div className="row">
            <div className="col-8 navcol1">
                <span className="logospan d-none d-sm-inline">
                    <img src={Ducklogo} className='logo' role="button" id="navbarDropdown" data-bs-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false"></img>
                    {/* <h3 className="logotext">
                        Duckounting
                    </h3> */}
                </span>
                <button type="button" className="btn infobutton d-none d-sm-inline">Learn More</button>

                <a className="nav-link dropdown-toggle d-inline d-sm-none" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img src={Ducklogo} className='logodrop' role="button" id="navbarDropdown" data-bs-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false"></img>
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <h3 className="logotext droplogo">
                        Duckounting
                    </h3>
                    <a className="dropdown-item" href="#">Learn More</a>
                    {/* <a className="dropdown-item" href="#">Something else here</a> */}
                </div>
            </div>
            <div className="col-4 navcol2">
                <ConnectButton setShowLogin={setShowLogin} />
            </div>
        </div>

        {/* login modal */}
        <Modal show={showLogin} onHide={hideLogin} className='loginModal'>
            <Modal.Title className="loginTitle">We need some deets...</Modal.Title>
            <Modal.Body className="loginBody">
                <label htmlFor="nameinp">Name</label>
                <input type="text" className="form-control" id="nameinp" placeholder="Ducky Duckington" onChange={handleName} />
                <div className="space"></div>
                <label htmlFor="paninp">PAN Number</label>
                <input type="text" className="form-control" id="paninp" placeholder="DUCKS9669D" onChange={handlePan} />
                <div className="row btnrow">
                    <button className="btn modbuttons" onClick={hideLogin}>
                        Skip
                    </button>
                    <button className="btn modbuttons" onClick={submitHandler}>
                        Save Locally
                    </button>
                </div>
            </Modal.Body>
        </Modal>

    </div >
}

export default Navbar;