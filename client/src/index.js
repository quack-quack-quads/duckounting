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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MoralisProvider initializeOnMount={false}>
    <Navbar/>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>} />
      </Routes>
    </BrowserRouter>
  </MoralisProvider>
);

reportWebVitals();
