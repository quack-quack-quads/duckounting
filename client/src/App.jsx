import "./App.scss";
import React, { useEffect } from "react";
import { abi, contractAddress } from "./constants/index";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import CreateInvoice from './components/CreateInvoive/CreateInvoice';
import DuckBoard from './screens/DuckBoard/DuckBoard'
import TransactionHistory from './components/TransactionHistory/TransactionHistory'
import Home from './Home';
import { useMoralis } from "react-moralis";
import { useState } from 'react';
import InvoiceDisplay from "./components/InvoiceDisplay/InvoiceDisplay";
import BuyerConfirmation from "./components/BuyerConfirmation/BuyerConfirmation";
import Footer from "./components/Footer/Footer";
import Review from "./components/Review/Review";
import EnsFetch from "./components/ENS_fetch/EnsFetch";
import OtherBoard from "./screens/DuckBoard/OtherBoard";



function App() {
  const { enableWeb3, account, isWeb3Enabled, deactivateWeb3, Moralis } =
    useMoralis();

  const { chainId: chainIdHex } = useMoralis();
  const [chainId, setChainId] = useState(parseInt(chainIdHex));
  const [invoicePlatformAddress, setInvoicePlatformAddress] = useState("");
  const [contractAbi, setContractAbi] = useState(null);

  const getContractDetails = () => {
    try {
      setInvoicePlatformAddress(contractAddress[parseInt(chainIdHex)][0]);
      setContractAbi(abi[parseInt(chainIdHex)]);
    } catch (err) {}
  };

  useEffect(() => {
    setChainId(parseInt(chainIdHex));
    getContractDetails();
  }, [chainIdHex]);

  const logout = () => {
    deactivateWeb3();
    window.localStorage.removeItem("connected");
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar
          logout={logout}
          account={account}
          chainId={chainId}
          invoicePlatformAddress={invoicePlatformAddress}
          contractAbi={contractAbi}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                contractAbi={contractAbi}
                invoicePlatformAddress={invoicePlatformAddress}
              />
            }
          />
          <Route
            path="/createInvoice"
            element={
              <CreateInvoice
                contractAbi={contractAbi}
                invoicePlatformAddress={invoicePlatformAddress}
              />
            }
          />
          <Route
            path="/transactionhistory"
            element={<TransactionHistory contractAbi={contractAbi} invoicePlatformAddress={invoicePlatformAddress} getContractDetails={getContractDetails}
            chainId={chainId} setChainid={setChainId} chainIdHex={chainIdHex}/>}
          />
          <Route
            path="/duckboard"
            element={
              <DuckBoard
                account={account}
                logout={logout}
                contractAbi={contractAbi}
                invoicePlatformAddress={invoicePlatformAddress}
              />
            }
          />
          <Route
            path="/otherboard"
            element={
              <OtherBoard
                account={account}
                logout={logout}
                contractAbi={contractAbi}
                invoicePlatformAddress={invoicePlatformAddress}
              />
            }
          />
        <Route path="/ens" element={<EnsFetch />} />
          <Route path="*" element={<Home />} />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

