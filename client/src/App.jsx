// import "./App.scss";
import React from 'react';
import ReactDOM from 'react-dom/client';
import {MoralisProvider} from "react-moralis"
import {
  BrowserRouter,
  Routes,
  Route,
}
from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import CreateInvoice from './components/CreateInvoive/CreateInvoice';
import DuckBoard from './screens/DuckBoard/DuckBoard'
import { useMoralis } from "react-moralis";
import { useState } from 'react';

function App() {
  const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3 } = useMoralis();
  const logout = ()=>{
    window.localStorage.removeItem("connected");
    deactivateWeb3();
  }
  return (
    <div className="App">
        <Navbar logout = {logout}/>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="createInvoice" element={<CreateInvoice />} />
            <Route path="/duckboard" element={<DuckBoard logout = {logout}/>} />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;

