import { useMoralis } from "react-moralis";
import { useState, useEffect } from "react";
import './ConnectButton.scss'

const ConnectButton = ({ setShowLogin }) => {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3 } = useMoralis();
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
        // if localStorage does not have a pan, name then show login modal
        if (typeof window !== "undefined") {
            if (!window.localStorage.getItem("pan") || !window.localStorage.getItem("name")) {
                setShowLogin(true);
            }
        }
    }, [account])

    const connectToWallet = async () => {
        await enableWeb3();
        if (typeof window !== "undefined") {
            window.localStorage.setItem("connected", "injected");
        }
        console.log("Connected to wallet", account);
        // if localStorage does not have a pan, name then show login modal
        if(typeof window !== "undefined"){
            if(!window.localStorage.getItem("pan") || !window.localStorage.getItem("name")){
                setShowLogin(true);
            }
        }
    }

    return (
        <>
            {
                account ?
                    <div className="btn-address">             {account.slice(0, 8)}...
                    </div>
                    :
                    <button className="wallet-connect btn btn-warning"
                    // onClick={connectToWallet}
                    >Connect Wallet
                    </button>
            }
        </>
    )
}
export default ConnectButton;