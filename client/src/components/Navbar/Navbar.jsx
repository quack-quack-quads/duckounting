import "./Navbar.scss";
import { ConnectButton, Dropdown } from 'web3uikit';
import Ducklogo from '../../assets/images/ducklogo.png'

const Navbar = () => {
    return <div className="Navbar">
        <div className="row">
            <div className="col-8 navcol1">
                <span className="logospan d-none d-sm-inline">
                    <img src={Ducklogo} className='logo' role="button" id="navbarDropdown" data-bs-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false"></img>
                    <h3 className="logotext">
                        Duckounting
                    </h3>
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
                <ConnectButton moralisAuth={true} color="yellow" className="connect" />
            </div>
        </div>
    </div>
}

export default Navbar;