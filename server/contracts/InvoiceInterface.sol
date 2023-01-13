// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface InvoiceInterface {
    struct Person {
        string PAN;
        string name;
        string email;
        string phone;
        Review[] reviews;
    }

    struct Review {
        string review;
        uint32 rating;
        string PAN;
    }

    struct Invoice {
        uint8 paymentMode;
        uint32 amountMonthly;
        uint32 monthsToPay;
        bool status;
        uint256 id;
        address reciepient;
        string sellerPAN;
        string buyerPAN;
        string date;
        string url;
    }

    enum PersonType {
        SELLER,
        BUYER
    }
    enum PaymentMode {
        ONETIME_ETH,
        RECURRING_ETH,
        OFFLINE_CASH
    }
}
