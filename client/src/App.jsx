import "./App.scss";
import Hero from "./components/Hero/Hero";
import InvoiceDisplay from "./components/InvoiceDisplay/InvoiceDisplay";
import PendingTransaction from "./components/PendingTransactions/PendingTransaction";
import TransactionHistoryCard from "./components/TransactionHistory/TransactionHistoryCard";
import TransactionHistoryMiniCard from "./components/TransactionHistory/TransactionHistoryMiniCard";
import TransactionHistoryTableHeader from "./components/TransactionHistory/TransactionHistoryTableHeader";
import LandingPage from "./pages/LandingPage";

function App() {
  const list = [
    {
      sellerPan: "seller1",
      buyerPan: "buyer1",
      invoiceId: "id11",
      date: "date",
      walletAddress: "walletAdd",
      amt: "709",
      months: "3",
      proof: "https://thumbs.dreamstime.com/b/invoice-16921374.jpg",
    },
    {
      sellerPan: "seller2",
      buyerPan: "buyer2",
      invoiceId: "id12",
      date: "date",
      walletAddress: "walletAdd",
      amt: "1000",
      months: "1",
      proof: "https://thumbs.dreamstime.com/b/invoice-16921374.jpg",
    },
  ];

  // for (var i = 0; i < 100; i++) {
  //     list.push(list[0]);
  // }

  return (
    <div className="App">
      <div className="col-8 offset-2 my-auto">
        <TransactionHistoryTableHeader />
        <TransactionHistoryCard
          role="buyer"
          invoiceID="InvoiceIDl1"
          date="18/01/2023"
          status="pending"
          partnerPAN="123ASB1234"
          mode="ETH"
          amount="₹50000"
        />
        <TransactionHistoryCard
          role="seller"
          invoiceID="InvoiceIDl2"
          date="08/02/2023"
          status="paid"
          partnerPAN="GH123JKJ12"
          mode="Cash"
          amount="₹21000"
        />
      </div>
      <div className="col-sm-4 offset-sm-4 col-10 offset-1">
        <TransactionHistoryMiniCard
          role="buyer"
          invoiceID="InvoiceIDl1"
          status="pending"
          partnerPAN="123ASB1234"
          amount="₹50000"
        ></TransactionHistoryMiniCard>
        <TransactionHistoryMiniCard
          role="seller"
          invoiceID="InvoiceIDl2"
          status="paid"
          partnerPAN="GH123JKJ12"
          amount="₹21000"
          selected="true"
        ></TransactionHistoryMiniCard>
      </div>
    </div>
  );
}

export default App;
