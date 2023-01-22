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

  const listing = [
    {
      role: "buyer",
      invoiceID: "InvoiceIDl1",
      date: "18/01/2023",
      status: "pending",
      partnerPAN: "123ASB1234",
      mode: "ETH",
      amount: "₹50000",
    },
    {
      role: "seller",
      invoiceID: "InvoiceIDl2",
      date: "08/02/2023",
      status: "paid",
      partnerPAN: "GH123JKJ12",
      mode: "Cash",
      amount: "₹21000",
    },
    {
      role: "seller",
      invoiceID: "InvoiceID32",
      date: "08/02/2023",
      status: "paid",
      partnerPAN: "LH123JMJ12",
      mode: "Cash",
      amount: "₹21002",
    },
    {
      role: "buyer",
      invoiceID: "InvoiceID22",
      date: "18/01/2023",
      status: "pending",
      partnerPAN: "123KSV5678",
      mode: "ETH",
      amount: "₹24000",
    },
    {
      role: "buyer",
      invoiceID: "InvoiceIDl2",
      date: "18/01/2023",
      status: "pending",
      partnerPAN: "123ASB1235",
      mode: "ETH",
      amount: "₹50020",
    },
  ];
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
            element={<TransactionHistory listing={listing} />}
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
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
