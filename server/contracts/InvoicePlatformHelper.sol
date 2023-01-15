// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./InvoiceInterface.sol";

error InvalidTx();
error RefundFailed();
error NotEnoughETH();

contract InvoicePlatformHelper is InvoiceInterface {
    // State variables
    uint256 internal invoiceIdCount;

    mapping(string => Invoice[]) internal buyerInvoices; // buyerPAN => Invoice[]
    mapping(string => Invoice[]) internal sellerInvoices; // sellerPAN => Invoice[]
    mapping(string => Person) internal persons; // pan => Person
    mapping(uint256 => string) internal tokenIdToPan; // tokenId => pan

    function addInvoice(
        uint8 _paymentMode,
        uint32 _amountMonthly,
        uint32 _monthsToPay,
        bool _status,
        address recipient,
        string memory _sellerPAN,
        string memory _buyerPAN,
        string memory _date,
        string memory _url
    ) public {
        if (bytes(_sellerPAN).length == 0 || bytes(_buyerPAN).length == 0) {
            revert InvalidTx();
        }
        Invoice memory invoice = Invoice(
            _paymentMode,
            _amountMonthly,
            _monthsToPay,
            _status,
            invoiceIdCount,
            recipient,
            _sellerPAN,
            _buyerPAN,
            _date,
            _url
        );
        sellerInvoices[_sellerPAN].push(invoice);
        buyerInvoices[_buyerPAN].push(invoice);
        invoiceIdCount++;
    }

    // TODO - only allow valid buyer to call this function
    function addRating(string memory _sellerPAN, uint8 _rating) public {
        if (bytes(persons[_sellerPAN].name).length == 0) {
            revert InvalidTx();
        }
        persons[_sellerPAN].rating = (_rating + persons[_sellerPAN].rating) / 2;
    }

    function _safePay(
        uint256 _invoiceIndex,
        address _sellerAddress,
        string memory _sellerPan
    ) internal {
        if (
            msg.value < sellerInvoices[_sellerPan][_invoiceIndex].amountMonthly
        ) {
            revert NotEnoughETH();
        } else {
            (bool success, ) = payable(_sellerAddress).call{value: msg.value}(
                ""
            );
            if (!success) {
                revert RefundFailed();
            }
        }
    }

    // getters
    function getInvoiceIdCount() public view returns (uint256) {
        return invoiceIdCount;
    }

    // returns a list of invoices - given a PAN and personType
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

    function getPerson(string memory PAN) public view returns (Person memory) {
        if (bytes(persons[PAN].name).length == 0) {
            revert InvalidTx();
        }
        return persons[PAN];
    }
}
