// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface InvoiceInterface {
    struct Person {
        address addr;
        uint8 rating;   
        uint16 percentSuccess;
        string name;
    }

    struct Invoice {
        uint8 paymentMode;
        uint256 amountMonthly;
        uint32 monthsToPay;
        bool status;
        uint256 id;
        address recipient;
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
