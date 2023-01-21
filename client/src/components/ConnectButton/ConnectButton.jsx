import { useMoralis } from "react-moralis";
import { useState, useEffect } from "react";
import './ConnectButton.scss'

const ConnectButton = ({ connectToWallet, account}) => {
    return (
        <>
            {
                account ?
                    <div className="btn-address">{account.slice(0, 8)}...
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