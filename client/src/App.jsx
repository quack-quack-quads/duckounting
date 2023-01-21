import "./App.scss";
import React, { useEffect } from 'react';
import { abi, contractAddress } from "./constants/index";
import {
  BrowserRouter,
  Routes,
  Route,
}
from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import CreateInvoice from './components/CreateInvoive/CreateInvoice';
import DuckBoard from './screens/DuckBoard/DuckBoard'
import Home from './Home';
import { useMoralis } from "react-moralis";
import { useState } from 'react';

function App() {
  const { enableWeb3, account, isWeb3Enabled, deactivateWeb3, Moralis } = useMoralis();

  const { chainId: chainIdHex } = useMoralis();
  const [chainId, setChainId] = useState(parseInt(chainIdHex));
  const [invoicePlatformAddress, setInvoicePlatformAddress] = useState(null);
  const [contractAbi, setContractAbi] = useState(null);

  useEffect(() => {
    setChainId(parseInt(chainIdHex));
    try{
      setInvoicePlatformAddress(contractAddress[parseInt(chainIdHex)][0]);
      setContractAbi(abi[parseInt(chainIdHex)]); 
    }
  catch(err){
  }
  },[chainIdHex])

  const logout = ()=>{
    deactivateWeb3();
    window.localStorage.removeItem("connected");
  }

  return (
    <div className="App">
        <Navbar 
        logout = {logout}  
        account={account}
        chainId={chainId}
        invoicePlatformAddress={invoicePlatformAddress}
        contractAbi={contractAbi}
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="createInvoice" element={<CreateInvoice contractAbi={contractAbi}
            invoicePlatformAddress={invoicePlatformAddress}
            />} />
            <Route path="/duckboard" element={<DuckBoard account={account}
            logout = {logout} contractAbi={contractAbi} invoicePlatformAddress={invoicePlatformAddress}/>} />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;

