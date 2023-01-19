import { useState, useEffect, useLayoutEffect, useRef } from "react";
import "./PendingTransaction.scss";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material";
import InvoiceDisplay from '../InvoiceDisplay/InvoiceDisplay';
import { gsap } from "gsap";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        black: {
            main: '#000000'

        }
    }
})

const PendingTransaction = (props) => {

    const [upd,setupd] = useState(false);
    const app = useRef();
    
    useEffect(() => {
        console.log(show);
        let tl = gsap.timeline();
        console.log("window width: " + window.innerWidth);
        if (show !== -1 && selectionModel.length !== 0) {
            console.log(app);
            console.log("hi", show);
            if (window.innerWidth >= 992) {
                gsap.from(app.current, {
                    x: -700, duration: 0.5
                })
                gsap.from(app.current, {
                    y: -500, duration: 0.5
                })
                gsap.fromTo(app.current, 0.5, {
                    scale: 0
                }, {
                    scale: 1
                })
            }
            else {
                // gsap.to(window, {duration: 2, scrollTo: 400});
                window.scrollTo(0,1000);
                gsap.from(app.current, {
                    y: -1200, duration: 1
                })
                gsap.fromTo(app.current, 1, { scale: 0 }, { scale: 1 });
            }
        }
        

    });

    const listing = props.listing;

    const columns = [
        { field: 'id', headerName: 'SI', width: 80 },
        { field: 'txns', headerName: 'Transactions', width: 370 }
    ]

    const rows = []

    for (var i = 0; i < listing.length; i++) {
        var obj = {
            id: i + 1,
            txns: listing[i].sellerPan + '=>' + listing[i].buyerPan,
            align: "center"
        }
        rows.push(obj);
    }

    const [selectionModel, setSelectionModel] = useState([]);
    const [show, setshow] = useState(-1);

    const handleClick = (val) => {
        console.log(val);
        if (val.length === 0) {
            setshow(-1);
            return;
        }
        setshow(val[0] - 1);
        setSelectionModel(val);
        console.log(listing[val[0] - 1].amt);
    }

    return (
        <div className="container invoice-whole-container">
            <div className="row">
                <div className="container col-lg-4 col-12">
                    <div className="pending-txn">
                        <div className="row">
                            <div className="d-flex justify-content-center">
                                <h3>Pending Transaction</h3>
                            </div>
                        </div>
                        <div className="row pending-txn-table">
                            <ThemeProvider theme={darkTheme} >
                                <DataGrid rows={rows} columns={columns} align="center" checkboxSelection
                                    onSelectionModelChange={handleClick} isRowSelectable={(params) => (params.row.id === show + 1 || show == -1)} />
                            </ThemeProvider>
                        </div>
                    </div>


                </div>
                <div className="col-lg-7 col-12 container invoice" ref={app}>
                    {show === -1 || selectionModel.length === 0 ? null : <InvoiceDisplay
                        transactionType="PAID ON CHAIN"
                        invoiceId={listing[show].invoiceId}
                        date={listing[show].date}
                        buyerPan={listing[show].buyerPan}
                        sellerPan={listing[show].sellerPan}
                        walletAddress={listing[show].walletAddress}
                        amt={listing[show].amt}
                        months={listing[show].months}
                        proof={listing[show].proof}
                    />}
                </div>
            </div>
        </div>

    )
}

export default PendingTransaction;