// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./InvoiceInterface.sol";

error InvalidTx();
error RefundFailed();
error NotEnoughETH();

contract InvoicePlatformHelper is InvoiceInterface {
    // State variables
    uint256 internal invoiceIdCount;

    // events
    event AddInvoice();
    event AddRating();

    mapping(string => Invoice[]) internal buyerInvoices; // buyerPAN => Invoice[]
    mapping(string => Invoice[]) internal sellerInvoices; // sellerPAN => Invoice[]
    mapping(string => Person) internal persons; // pan => Person
    mapping(uint256 => string) internal tokenIdToPan; // tokenId => pan
    mapping(address => string) internal addrToPan; // addr => pan

    function addInvoice(
        uint8 _paymentMode,
        uint256 _amountMonthly,
        uint32 _monthsToPay,
        bool _status,
        string memory _sellerPAN,
        string memory _buyerPAN,
        string memory _date,
        string memory _url
    ) public {
        if (persons[_sellerPAN].addr == address(0)) {
            revert InvalidTx();
        }
        Invoice memory invoice = Invoice(
            _paymentMode,
            _amountMonthly,
            _monthsToPay,
            _status,
            invoiceIdCount,
            payable(msg.sender),
            _sellerPAN,
            _buyerPAN,
            _date,
            _url
        );
        sellerInvoices[_sellerPAN].push(invoice);
        buyerInvoices[_buyerPAN].push(invoice);
        invoiceIdCount++;
        emit AddInvoice();
    }

    // TODO - only allow valid buyer to call this function
    function addRating(string memory _sellerPAN, uint8 _rating) public {
        if (persons[_sellerPAN].addr == address(0)) {
            revert InvalidTx();
        }
        persons[_sellerPAN].rating = (_rating + persons[_sellerPAN].rating) / 2;
        emit AddRating();
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
        if (persons[PAN].addr == address(0)) {
            revert InvalidTx();
        }
        return persons[PAN];
    }

    function getPersonPAN(address _addr) public view returns (string memory) {
        if (bytes(addrToPan[_addr]).length == 0) {
            revert InvalidTx();
        }
        return addrToPan[_addr];
    }
}
