// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract InvoicePlatform {
    // State variables
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
        string sellerPAN;
        string buyerPAN;
        uint32 amountMonthly;
        string date;
        bool status;
        uint32 monthsToPay;
        string url;
    }

    mapping(string => Invoice[]) internal invoiceRecords;

    constructor() {}

    function getInvoices(
        string memory PAN
    ) public view returns (Invoice[] memory) {
        return invoiceRecords[PAN];
    }

    function addInvoice(
        string memory sellerPAN,
        string memory buyerPAN,
        uint32 amountMonthly,
        string memory date,
        bool status,
        uint32 monthsToPay,
        string memory url
    ) public {
        Invoice memory invoice = Invoice(
            sellerPAN,
            buyerPAN,
            amountMonthly,
            date,
            status,
            monthsToPay,
            url
        );
        invoiceRecords[buyerPAN].push(invoice);
    }
}
