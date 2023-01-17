import './App.scss';
import Hero from './components/Hero/Hero';
import InvoiceDisplay from './components/InvoiceDisplay/InvoiceDisplay';

function App() {
  return (
    <div className="App">
      <Hero/>
      <InvoiceDisplay
        transactionType = "PAID ON CHAIN"
        invoiceId = "0x384 jh3j4 343ke erer4 3949k jdkfj"
        date = "10 January 2023"
        buyerPan = "DUCKS6969D"
        sellerPan = "NOOBT8008S"
        walletAddress = "0x9bA fc495 84jk4 k5j45 8u45n klsd2"
        amt = "7000"
        months = "3"
        proof = "https://thumbs.dreamstime.com/b/invoice-16921374.jpg"
      />
    </div>
  );
}

export default App;
