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
            <Hero />
            

            <PendingTransaction listing={list} />

        </div>
    );
}

export default App;
