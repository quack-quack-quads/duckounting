import { useState, useEffect, useRef } from "react";
import "./TransactionHistory.scss"
import TransactionHistoryCard from "./TransactionHistoryCard";
import TransactionHistoryMiniCard from "./TransactionHistoryMiniCard";
import TransactionHistoryTableHeader from "./TransactionHistoryTableHeader";
import InvoiceDisplay from "../InvoiceDisplay/InvoiceDisplay";
import { gsap } from "gsap";
import { BsFillCaretRightFill } from "react-icons/bs";
import { Diversity1 } from "@mui/icons-material";
import { useWeb3Contract } from "react-moralis";
import { ethers } from "ethers";

const TransactionHistory = ({
    contractAbi,
    invoicePlatformAddress
}) => {
    const [listing_orig, setListing_orig] = useState([]);
    const [listing, setListing] = useState([]);
    const [toDisplayProps, setToDisplayProps] = useState({});

    const [sortBy, setSortBy] = useState("");
    const [filterState, setFilterState] = useState("");
    const [search, setSearch] = useState("");

    const [animate, setAnimate] = useState(false);
    const [show, setShow] = useState(false);

    const [collapse, setCollapse] = useState(false);

    const txn_card_ref = useRef();
    const invoice_ref = useRef();

    const giveEthVal = (val) => {
        return `${ethers.utils.formatEther(val)} ETH`;
    }
    const giveStatus = (status) => {
        return (status == true ? "paid": "pending")
    }
    const giveRole = (sellerpan) => {
        if (sellerpan === localStorage.getItem("pan")) {
            return "seller";
        } else {
            return "buyer";
        }
    }
    const giveMode = (mode) => {
        if (mode == 0) {
        return "ETH";
        } else if (mode == 1) {
        return "Recurring";
        } else{
        return "Cash";
        }
    }

    const {runContractFunction: getInvoicesSeller} = useWeb3Contract({
        abi: contractAbi,
        contractAddress: invoicePlatformAddress,
        functionName: "getInvoices",
        params: {
            PAN: localStorage.getItem("pan") || "",
            personType: 0
        }
    })

    const {runContractFunction: getInvoicesBuyer} = useWeb3Contract({
        abi: contractAbi,
        contractAddress: invoicePlatformAddress,
        functionName: "getInvoices",
        params: {
            PAN: localStorage.getItem("pan") || "",
            personType: 1
        }
    })

    const fetchInvoices = async () => {
        await getInvoicesSeller()
        .then(res => {
            if(res !== undefined)
            {
                // console.log("fetched this", res);
                let newList = []
                for (var i = 0; i < res.length; i++) {
                    let tmpObj = {}
                    tmpObj["role"] = giveRole(res[i].sellerPAN);
                    tmpObj["invoiceID"] = (res[i].id).toString();
                    tmpObj["status"] = giveStatus(res[i].status);
                    tmpObj["sellerPAN"] = res[i].sellerPAN;
                    tmpObj["partnerPAN"] = res[i].buyerPAN;
                    tmpObj["amount"] = giveEthVal((res[i].amountMonthly).toString());
                    tmpObj["date"] = res[i].date;
                    tmpObj["mode"] = giveMode((res[i].paymentMode).toString());
                    // ! new props
                    tmpObj["monthsToPay"] = (res[i].monthsToPay).toString();
                    tmpObj["walletAddress"] = res[i].sellerAddress;
                    tmpObj["proof"] = res[i].url;
                    newList.push(tmpObj);
                }
                setListing_orig(newList);
                setListing(newList);
            }
        })
        .catch(err => {console.log(`Error: ${err}`)})

        await getInvoicesBuyer()
        .then(res => {
            if(res !== undefined)
            {
                console.log("fetched this", res);
                let newList = []
                for (var i = 0; i < res.length; i++) {
                    let tmpObj = {}
                    tmpObj["role"] = giveRole(res[i].sellerPAN);
                    tmpObj["invoiceID"] = (res[i].id).toString();
                    tmpObj["status"] = giveStatus(res[i].status);
                    tmpObj["sellerPAN"] = res[i].sellerPAN;
                    tmpObj["partnerPAN"] = res[i].buyerPAN;
                    tmpObj["amount"] = giveEthVal((res[i].amountMonthly).toString());
                    tmpObj["date"] = res[i].date;
                    tmpObj["mode"] = giveMode((res[i].paymentMode).toString());
                    // ! new props
                    tmpObj["monthsToPay"] = (res[i].monthsToPay).toString();
                    tmpObj["walletAddress"] = res[i].sellerAddress;
                    tmpObj["proof"] = res[i].url;
                    newList.push(tmpObj);
                }
                setListing_orig(prevArr => [...prevArr, ...newList]);
                setListing(prevArr => [...prevArr, ...newList]);
            }
        })
        .catch(err => {console.log(`Error: ${err}`)})   
    }

    useEffect(() => {
        // fetch the data from the blockchain
        fetchInvoices();  
    },[contractAbi, invoicePlatformAddress])

    useEffect(() => {
        var listing_dup = listing_orig;
        if (sortBy !== "") {
            listing_dup.sort((a, b) => {
                // console.log(a, sortBy[0], a[sortBy[0]]);
                if (sortBy[1] == 'dec') {
                    return (a[sortBy[0]] > b[sortBy[0]] ? 1 : a[sortBy[0]] < b[sortBy[0]] ? -1 : 0);
                }
                else {
                    return (a[sortBy[0]] < b[sortBy[0]] ? 1 : a[sortBy[0]] > b[sortBy[0]] ? -1 : 0);
                }

            })
            setListing(listing_dup);
        }

        var listing_dup = listing_orig;
        var ret = false;
        for (var i = 0; i < filterState.length; i++) {
            if (filterState[i]) ret = true;
        }

        function fil(a) {
            if (!ret) return true;

            if (filterState[0]) {
                if (a.role !== "buyer") {
                    return false;
                }
            }

            if (filterState[1]) {
                if (a.role !== "seller") {
                    return false;
                }
            }

            if (filterState[2]) {
                if (a.status !== "paid") {
                    return false;
                }
            }

            if (filterState[3]) {
                if (a.status !== "pending") {
                    return false;
                }
            }

            if (filterState[4]) {
                if (a.mode !== "ETH") {
                    return false;
                }
            }
            if (filterState[5]) {
                if (a.mode !== "Recurring") {
                    return false;
                }
            }
            if (filterState[6]) {
                if (a.mode !== "Cash") {
                    return false;
                }
            }

            return true;
        }

        var new_list = []
        for (var i = 0; i < listing_dup.length; i++) {
            if (fil(listing_dup[i]) === true) {
                new_list.push(listing_dup[i]);
            }
        }
        setListing(new_list);

        if (search !== "") {
            const search1 = (a, searchVal) => {
                for (var key in a) {
                    var curr = a[key].toUpperCase();
                    if (curr.includes(searchVal.toUpperCase())) {
                        return true;
                    }
                }
                return false;
            }
            var new_list = []
            for (var i = 0; i < listing_dup.length; i++) {
                if (search1(listing_dup[i], search) === true) {
                    new_list.push(listing_dup[i]);
                }
            }
            setListing(new_list);
        }

        if (animate) {

        }

    }, [sortBy, filterState, search]);

    const toggleTable = () => {
        setCollapse(!collapse);
        setShow(!show);
        console.log("btn click")
    }

    const handleCardClick = (props) => {
        // setAnimate(true);    
        console.log("card click",props)
        setToDisplayProps(props);
        setShow(true);
        setCollapse(true);
    }


    return (
        <div className="txn-main bkg">
            <div className="row centerrow">
                <div className="title">
                    Transaction History
                </div>
            </div>
            <div className="row backrow">
                {
                    collapse ?
                        <div className="tableCollapsed">
                            <button className="btn btn-warning collapsebutton"
                                onClick={toggleTable}
                            >
                                <div className="row">
                                    Show Table
                                </div>
                                <div className="row row2">
                                    <BsFillCaretRightFill />
                                </div>
                            </button>
                        </div>

                        :


                        <div className="txn-main-row1 row" ref={txn_card_ref}>
                            <div className="col-12 col-md-6 transactioncol">
                                <TransactionHistoryTableHeader className="header-content-inside" sort={setSortBy} filter={setFilterState} search={setSearch} />
                            </div>

                            <div className="col-12 col-md-6 transactioncol">
                                <div className="row body">
                                    <div className="txn-card scrolloverflow">
                                        { listing.length > 0 ?
                                            listing.map((obj) => {
                                                return (
                                                    (window.innerWidth > 992  ? <TransactionHistoryCard 
                                                        role={obj.role}
                                                        invoiceID={obj.invoiceID}
                                                        status={obj.status}
                                                        partnerPAN={obj.partnerPAN}
                                                        amount={obj.amount}
                                                        date={obj.date}
                                                        mode={obj.mode}
                                                        sellerPAN={obj.sellerPAN}
                                                        handleCardClick={handleCardClick}
                                                        // ! new fields
                                                        monthsToPay={obj.monthsToPay}
                                                        walletAddress={obj.walletAddress}
                                                        proof={obj.proof}
                                                    /> :
                                                        <TransactionHistoryMiniCard 
                                                            role={obj.role}
                                                            invoiceID={obj.invoiceID}
                                                            status={obj.status}
                                                            partnerPAN={obj.partnerPAN}
                                                            amount={obj.amount}
                                                            date={obj.date}
                                                            mode={obj.mode}
                                                            handleCardClick = {handleCardClick}
                                                            // ! new fields
                                                            monthsToPay={obj.monthsToPay}
                                                            walletAddress={obj.walletAddress}
                                                            proof={obj.proof}
                                                        />)
                                                )
                                            })
                                            :
                                            ""
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                }
                <div className="invoicediv">
                    {collapse ? <InvoiceDisplay
                        date={toDisplayProps.date}
                        invoiceId={toDisplayProps.invoiceID}
                        buyerPan={toDisplayProps.partnerPAN}
                        sellerPan={toDisplayProps.sellerPAN}
                        amt={toDisplayProps.amount}
                        months={toDisplayProps.monthsToPay}
                        proof={toDisplayProps.proof}
                        // TODO - 
                        transactionType={toDisplayProps.mode}
                        walletAddress={toDisplayProps.walletAddress}
                    /> : null}
                </div>
            </div>

        </div>
    )
}

export default TransactionHistory;