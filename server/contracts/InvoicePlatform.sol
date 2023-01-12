// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// imports
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// errors
error RefundFailed();
error NotEnoughETHSend();
error InvoiceNotExist();

contract InvoicePlatform is ReentrancyGuard {
    // State variables
    uint256 internal invoiceID = 0;

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

    mapping(string => Invoice[]) internal buyerInvoices;
    mapping(string => Invoice[]) internal sellerInvoices;
    mapping(address => uint256) internal pendingWithdrawals;

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
        uint8 _paymentMode,
        uint32 _amountMonthly,
        uint32 _monthsToPay,
        bool _status,
        uint256 _id,
        string memory _sellerPAN,
        string memory _buyerPAN,
        string memory _date,
        string memory _url
    ) public {
        Invoice memory invoice = Invoice(
            _paymentMode,
            _amountMonthly,
            _monthsToPay,
            _status,
            _id,
            _sellerPAN,
            _buyerPAN,
            _date,
            _url
        );
        sellerInvoices[_sellerPAN].push(invoice);
        buyerInvoices[_buyerPAN].push(invoice);
        invoiceID++;
    }

    function _safePay(
        uint256 _id,
        uint256 _invoiceIndex,
        address _sellerAddress,
        string memory _sellerPan
    ) internal {
        if (
            msg.value >= sellerInvoices[_sellerPan][_invoiceIndex].amountMonthly
        ) {
            uint256 refundAmount = msg.value -
                sellerInvoices[_sellerPan][_invoiceIndex].amountMonthly;
            if (refundAmount != 0) {
                (bool success, ) = payable(msg.sender).call{
                    value: refundAmount
                }("");
                if (!success) {
                    revert RefundFailed();
                }
            }
            // now we update blockchain data
            pendingWithdrawals[_sellerAddress] += msg.value - refundAmount;
        } else {
            // paid less
            revert NotEnoughETHSend();
        }
    }

    function pay(
        address _sellerAddress,
        string memory _buyerPan,
        string memory _sellerPan,
        uint256 _id
    ) public payable nonReentrant {
        Invoice[] memory invoices = sellerInvoices[_sellerPan];
        Invoice memory invoiceFound;
        uint256 invoiceIndex = 0;
        for (invoiceIndex; invoiceIndex < invoices.length; invoiceIndex++) {
            if (invoices[invoiceIndex].id == _id) {
                invoiceFound = invoices[invoiceIndex];
                break;
            }
        }
        if ((bytes(invoiceFound.sellerPAN)).length > 0) {
            if (uint8(PaymentMode.ONETIME_ETH) == invoiceFound.paymentMode) {
                _safePay(_id, invoiceIndex, _sellerAddress, _sellerPan);
            }
        } else {
            // invoice not exists
            revert InvoiceNotExist();
        }
    }
}
