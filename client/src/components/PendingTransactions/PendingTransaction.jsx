import { useState, useEffect } from "react";
import "./PendingTransaction.scss";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material";
import InvoiceDisplay from '../InvoiceDisplay/InvoiceDisplay';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        black: {
            main: '#000000'

        }
    }
})

const PendingTransaction = (props) => {

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
        setshow(val[0] - 1);
        console.log(listing[val[0] - 1].amt);
    }

    return (
        <div className="container">
            <div className="row">
                <div className="container col-4 ">
                    <div className="pending-txn">
                        <div className="row">
                            <div className="d-flex justify-content-center">
                                <h3>Pending Transaction</h3>
                            </div>
                        </div>
                        <div className="row pending-txn-table">
                            <ThemeProvider theme={darkTheme} >
                                <DataGrid rows={rows} columns={columns} align="center" onSelectionModelChange={handleClick} />
                            </ThemeProvider>
                        </div>
                    </div>


                </div>
                <div className="col-7 container">
                    {show === -1 ? null : <InvoiceDisplay
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