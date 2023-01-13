import { useMoralis } from "react-moralis";
import { useState, useEffect } from "react";
import './ConnectButton.scss'
const ConnectButton = ({setShowLogin}) => {

    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis();
    useEffect(() => {
        if(isWeb3Enabled) return;
        if(typeof window !== "undefined"){
            if(window.localStorage.getItem("connected")){
                enableWeb3();
            }
        }
    },[isWeb3Enabled]);

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log("Account changed", account);
            if(account == null)
            {
                window.localStorage.removeItem("connected");
                deactivateWeb3();
                console.log("Null account found");
            }
        })
    },[account])

    const connectToWallet = async() => {
        await enableWeb3();
        if(typeof window !== "undefined"){
            window.localStorage.setItem("connected", "injected");
        }
        console.log("account", account);
        setShowLogin(true);
    }

    return(
        <>
            {
                account ? <div className="btn-address">{account}</div> :
                <button color="yellow" className="connect"
                    onClick={connectToWallet}>Connect</button>
            }
        </>
    )
}
export default ConnectButton;