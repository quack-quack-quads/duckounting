import './App.scss';
import Hero from './components/Hero/Hero';
import InvoiceDisplay from './components/InvoiceDisplay/InvoiceDisplay';
import PendingTransaction from './components/PendingTransactions/PendingTransaction';

function App() {

    const list = [{ sellerPan: 'seller1', buyerPan: 'buyer1', invoiceId : 'id11',
                    date:'date', walletAddress:'walletAdd', amt:'709', months:'3', proof:"https://thumbs.dreamstime.com/b/invoice-16921374.jpg" }, 
                    { sellerPan: 'seller2', buyerPan: 'buyer2', invoiceId : 'id12',
                    date:'date', walletAddress:'walletAdd', amt:'1000', months:'1', proof:"https://thumbs.dreamstime.com/b/invoice-16921374.jpg" }]

    for (var i = 0; i < 100; i++) {
        list.push(list[0]);
    }

    return (
        <div className="App">
            {/* <Hero /> */}
            <InvoiceDisplay
                date = "13 January 2023"
                transactionType = "Paid on chain"
                invoiceId = "dkjf dkfjkd dkfj dkjfk djkfj kdjf"
                walletAddress = "dfjkd dkjfkd kdjf dkdjfkj ddkfj 54 k45j4"
                buyerPan = "DKJFEIJDKF"
                sellerPan = "DKFJKD343J"
                amt = "5869"
                months ="4"
                proof = "QmX2pLwriofRopVs1BVXSzsdTsuM5jPfuXtLV4RNxyHNh6"
            />
            <PendingTransaction listing={list} />

        </div>
    );
}

export default App;
