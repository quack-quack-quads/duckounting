import { useMoralis } from "react-moralis";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './ConnectButton.scss'
import {BsFillPersonFill} from "react-icons/bs";
const ConnectButton = ({ connectToWallet, account}) => {
    const navigate = useNavigate();
    return (
        <>
            {
                account ?
                    <div className="btn-address"            
                        onClick={()=>{
                            navigate("/duckboard");
                        }}
                    >
                        <BsFillPersonFill size={25}/>
                        &nbsp;
                        {account.slice(0, 8)}...
                    </div>
                    :
                    <button className="wallet-connect btn btn-warning"
                    onClick={connectToWallet}
                    >Connect Wallet
                    </button>
            }
        </>
    )
}
export default ConnectButton;