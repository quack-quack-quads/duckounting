import "./Navbar.scss";
import {Button } from '@web3uikit/core';
import { ConnectButton } from 'web3uikit';
import Ducklogo from '../../assets/images/ducklogo.png'

const Navbar = ()=>{
    return <div className="Navbar">
        <div className="row">
            <div className="col-6 navcol1">
                <span className="logospan">
                    <img src = {Ducklogo} className = 'logo'></img>
                    <h3 className="logotext">
                        Duckounting
                    </h3>
                </span>
                <button type="button" class="btn infobutton">Learn More</button>
            </div>
            <div className="col-6 navcol2">
                <ConnectButton moralisAuth={true} className ="connect"/>
            </div>
        </div>
    </div>
}

export default Navbar;