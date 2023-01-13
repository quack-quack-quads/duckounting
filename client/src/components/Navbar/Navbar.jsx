import "./Navbar.scss";
import { ConnectButton, Dropdown, Input } from 'web3uikit';
import Ducklogo from '../../assets/images/ducklogo.png'
import { useState } from "react";
import { Modal } from "react-bootstrap";

const Navbar = () => {
    const [showLogin, setShowLogin] = useState(false);

    const connectWallet = () => {
        setShowLogin(true);
    }
    const hideLogin = () => {
        setShowLogin(false);
    }

    const [pan, setPan] = useState("");
    const [name, setName] = useState("");

    const handlePan = event => {
        setPan(event.target.value);
    }
    const handleName = event => {
        setName(event.target.value);
    }

    const submitHandler = () => {
        console.log(pan);
        console.log(name);
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
                <button type="button" class="btn infobutton d-none d-sm-inline">Learn More</button>

                <a className="nav-link dropdown-toggle d-inline d-sm-none" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img src={Ducklogo} className='logodrop' role="button" id="navbarDropdown" data-bs-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false"></img>
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <h3 className="logotext droplogo">
                        Duckounting
                    </h3>
                    <a class="dropdown-item" href="#">Learn More</a>
                    {/* <a class="dropdown-item" href="#">Something else here</a> */}
                </div>
            </div>
            <div className="col-4 navcol2">
                <ConnectButton moralisAuth={true} color="yellow" className="connect"
                    onClick={connectWallet}
                />
            </div>
        </div>

        {/* login modal */}
        <Modal show={showLogin} onHide={hideLogin} className = 'loginModal'>
            <Modal.Title className="loginTitle">We need some deets...</Modal.Title>
            <Modal.Body className ="loginBody">
                <label for="nameinp">Name</label>
                <input type="text" class="form-control" id="nameinp" placeholder="Ducky Duckington" onChange = {handleName}/>
                <div className="space"></div>
                <label for="paninp">PAN Number</label>
                <input type="text" class="form-control" id="paninp" placeholder="DUCKS9669D" onChange={handlePan}/>
                <div className="row btnrow">
                    <button className="btn modbuttons" onClick={hideLogin}>
                        Skip
                    </button>
                    <button className="btn modbuttons">
                        Save Locally
                    </button>
                </div>
            </Modal.Body>
        </Modal>

    </div >
}

export default Navbar;