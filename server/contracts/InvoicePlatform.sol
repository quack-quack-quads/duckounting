// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract InvoicePlatform {
    // State variables
    bool internal locked;

    modifier noReentrant() {
        require(!locked, "No reentrancy allowed");
        locked = true;
        _;
        locked = false;
    }

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
        uint256 id;
        string sellerPAN;
        string buyerPAN;
        uint32 amountMonthly;
        string date;
        bool status;
        uint32 monthsToPay;
        string url;
    }

    enum PersonType {
        SELLER,
        BUYER
    }

    mapping(string => Invoice[]) internal buyerInvoices;
    mapping(string => Invoice[]) internal sellerInvoices;

    constructor() {}

    function getInvoices(
        string memory PAN,
        uint8 personType
    ) public view returns (Invoice[] memory) {
        if (uint8(PersonType.SELLER) == personType) {
            return sellerInvoices[PAN];
        } else {
            return buyerInvoices[PAN];
        }
    }

    function addInvoice(
        uint256 id,
        string memory sellerPAN,
        string memory buyerPAN,
        uint32 amountMonthly,
        string memory date,
        bool status,
        uint32 monthsToPay,
        string memory url
    ) public {
        Invoice memory invoice = Invoice(
            id,
            sellerPAN,
            buyerPAN,
            amountMonthly,
            date,
            status,
            monthsToPay,
            url
        );
        sellerInvoices[sellerPAN].push(invoice);
        buyerInvoices[buyerPAN].push(invoice);
    }

    function pay(
        address sellerAddress,
        string memory buyerPan,
        string memory sellerPan,
        uint256 id
    ) public noReentrant() {
        Invoice[] memory invoices = sellerInvoices[sellerPan];
        Invoice memory invoiceFound;
        for (uint256 i = 0; i < invoices.length; i++) {
            if (invoices[i].id == id) {
                invoiceFound = invoices[i];
                break;
            }
        }
    }
}
