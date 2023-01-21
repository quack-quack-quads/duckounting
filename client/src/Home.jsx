import CreateInvoice from './components/CreateInvoive/CreateInvoice';
import DuckBoard from './screens/DuckBoard/DuckBoard'
import App from './App';
import {
  Routes, Route,
}
from 'react-router-dom';
import { useState } from "react";
const Home = () => {
    const [accountAddress, setAccountAddress] = useState("");
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="createInvoice" element={<CreateInvoice />} />
            <Route path="/duckboard" element={<DuckBoard/>} />
        </Routes>
    )
}

export default Home