import { useState, useEffect, useRef } from "react";
import "./TransactionHistory.scss"
import TransactionHistoryCard from "./TransactionHistoryCard";
import TransactionHistoryMiniCard from "./TransactionHistoryMiniCard";
import TransactionHistoryTableHeader from "./TransactionHistoryTableHeader";
import InvoiceDisplay from "../InvoiceDisplay/InvoiceDisplay";
import { gsap } from "gsap";

const TransactionHistory = (props) => {

    const [listing, setListing] = useState(props.listing);
    const [listing_orig, setListing_orig] = useState(props.listing);
    const [sortBy, setSortBy] = useState("");

    const [filterState, setFilterState] = useState("");

    const [search, setSearch] = useState("");

    const [animate, setAnimate] = useState(false);
    const [show, setShow] = useState(false);

    const txn_card_ref = useRef();
    const invoice_ref = useRef();

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

    const handleCardClick = () => {
        setAnimate(true);
        setShow(true);
        if (window.innerWidth >= 992) {
            console.log("curr")
            gsap.fromTo(txn_card_ref.current, {scale:1.4}, {scale:1});
            gsap.from(txn_card_ref.current, {x : 200})
            gsap.from(invoice_ref.current, {x:-200});
            gsap.fromTo(invoice_ref.current, {scale:0}, {scale:1});
        }
        
    }

    


    return (
        <div className="container txn-main">
            <div className="row ">
                <div className={`txn-main-row1 ${animate ? "col-12 col-lg-6" : "col-12"}`} ref={txn_card_ref}>
                    <div className={`container txn-table $`}>
                        <div className="row table-head-row">
                            <div className="col-12 d-flex justify-content-center table-header">
                                <h1>Transaction History</h1>
                            </div>
                        </div>
                        <div className="row header-content">
                            <TransactionHistoryTableHeader className="header-content-inside" sort={setSortBy} filter={setFilterState} search={setSearch} />
                        </div>
                        <div className="row body">
                            <div className={`txn-card `}>
                                {listing.map((obj) => {
                                    return (
                                        // console.log(window.innerWidth)

                                        (window.innerWidth > 772 && !animate ? <TransactionHistoryCard role={obj.role}
                                            invoiceID={obj.invoiceID}
                                            status={obj.status}
                                            partnerPAN={obj.partnerPAN}
                                            amount={obj.amount}
                                            date={obj.date}
                                            mode={obj.mode}
                                            handleCardClick={handleCardClick}
                                        /> :
                                            <TransactionHistoryMiniCard role={obj.role}
                                                invoiceID={obj.invoiceID}
                                                status={obj.status}
                                                partnerPAN={obj.partnerPAN}
                                                amount={obj.amount}
                                                date={obj.date}
                                                mode={obj.mode}
                                            />)
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-6" ref={invoice_ref}>
                    {show ? <InvoiceDisplay
                        date="13 January 2023"
                        transactionType="Paid on chain"
                        invoiceId="dkjf dkfjkd dkfj dkjfk djkfj kdjf"
                        walletAddress="dfjkd dkjfkd kdjf dkdjfkj ddkfj 54 k45j4"
                        buyerPan="DKJFEIJDKF"
                        sellerPan="DKFJKD343J"
                        amt="5869"
                        months="4"
                        proof="QmX2pLwriofRopVs1BVXSzsdTsuM5jPfuXtLV4RNxyHNh6"
                    /> : null}
                </div>
            </div>

        </div>
    )
}

export default TransactionHistory;