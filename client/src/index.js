import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
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
import TransactionHistory from './components/TransactionHistory/TransactionHistory';

const listing = [{
  role:"buyer",
  invoiceID:"InvoiceIDl1",
  date:"18/01/2023",
  status:"pending",
  partnerPAN:"123ASB1234",
  mode:"ETH",
  amount:"₹50000"
},
{
  role:"seller",
  invoiceID:"InvoiceIDl2",
  date:"08/02/2023",
  status:"paid",
  partnerPAN:"GH123JKJ12",
  mode:"Cash",
  amount:"₹21000"
},
{
  role:"seller",
  invoiceID:"InvoiceID32",
  date:"08/02/2023",
  status:"paid",
  partnerPAN:"LH123JMJ12",
  mode:"Cash",
  amount:"₹21002"
},
{
  role:"buyer",
  invoiceID:"InvoiceID22",
  date:"18/01/2023",
  status:"pending",
  partnerPAN:"123KSV5678",
  mode:"ETH",
  amount:"₹24000"
},
{
  role:"buyer",
  invoiceID:"InvoiceIDl2",
  date:"18/01/2023",
  status:"pending",
  partnerPAN:"123ASB1235",
  mode:"ETH",
  amount:"₹50020"
}
]

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MoralisProvider initializeOnMount={false}>
    <Navbar/>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="createInvoice" element={<CreateInvoice />} />
        <Route path="/duckboard" element={<DuckBoard/>} />
        <Route path="/transactionhistory" element={<TransactionHistory listing={listing}/>} />
      </Routes>
    </BrowserRouter>
  </MoralisProvider>
);

reportWebVitals();
