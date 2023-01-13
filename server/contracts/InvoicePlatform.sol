// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// imports
import "./InvoiceInterface.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

// errors
error RefundFailed();
error NotEnoughETHSend();
error InvoiceNotExist();
error TransactionNotValid();
error WrongBuyer();

contract InvoicePlatform is ReentrancyGuard, InvoiceInterface {
    // State variables
    uint256 internal invoiceIdCount;

    modifier validTransaction(string memory sellerPan, string memory buyerPan) {
        if (bytes(sellerPan).length == 0 || bytes(buyerPan).length == 0) {
            revert TransactionNotValid();
        }
        _;
    }

    mapping(string => Invoice[]) internal buyerInvoices;
    mapping(string => Invoice[]) internal sellerInvoices;
    mapping(address => uint256) internal pendingWithdrawals;

    constructor() {
        invoiceIdCount = 0;
    }

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
    ) public validTransaction(_sellerPAN, _buyerPAN) {
        // TODO: check if seller and buyer exists
        uint256 _id = invoiceIdCount;
        Invoice memory invoice = Invoice(
            _paymentMode,
            _amountMonthly,
            _monthsToPay,
            _status,
            _id,
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

    function _safePay(
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
    ) public payable nonReentrant validTransaction(_sellerPan, _buyerPan) {
        // TODO: check if seller and buyer exists
        Invoice[] memory sellerInvoiceList = sellerInvoices[_sellerPan];
        Invoice[] memory buyerInvoiceList = buyerInvoices[_buyerPan];
        uint256 sellerInvoiceIndex = 0;
        uint256 buyerInvoiceIndex = 0;

        for (
            sellerInvoiceIndex;
            sellerInvoiceIndex < sellerInvoiceList.length;
            sellerInvoiceIndex++
        ) {
            if (sellerInvoiceList[sellerInvoiceIndex].id == _id) {
                break;
            }
        }

        for (
            buyerInvoiceIndex;
            buyerInvoiceIndex < buyerInvoiceList.length;
            buyerInvoiceIndex++
        ) {
            if (buyerInvoiceList[buyerInvoiceIndex].id == _id) {
                break;
            }
        }

        // TODO: only buyer should be able to pay & change the records

        if (sellerInvoiceIndex == sellerInvoiceList.length) {
            // invoice not exists
            revert InvoiceNotExist();
        } else {
            if (msg.sender != sellerInvoiceList[sellerInvoiceIndex].recipient) {
                revert WrongBuyer();
            }

            if (
                uint8(PaymentMode.ONETIME_ETH) ==
                sellerInvoiceList[sellerInvoiceIndex].paymentMode
            ) {
                _safePay(sellerInvoiceIndex, _sellerAddress, _sellerPan);
                sellerInvoices[_sellerPan][sellerInvoiceIndex].monthsToPay -= 1;
                buyerInvoices[_buyerPan][buyerInvoiceIndex].monthsToPay -= 1;
                sellerInvoices[_sellerPan][sellerInvoiceIndex].status = true;
                buyerInvoices[_buyerPan][buyerInvoiceIndex].status = true;
            } else if (
                uint8(PaymentMode.RECURRING_ETH) ==
                sellerInvoiceList[sellerInvoiceIndex].paymentMode
            ) {
                _safePay(sellerInvoiceIndex, _sellerAddress, _sellerPan);
                sellerInvoices[_sellerPan][sellerInvoiceIndex].monthsToPay -= 1;
                buyerInvoices[_buyerPan][buyerInvoiceIndex].monthsToPay -= 1;
                if (
                    sellerInvoices[_sellerPan][sellerInvoiceIndex]
                        .monthsToPay ==
                    0 &&
                    buyerInvoices[_buyerPan][buyerInvoiceIndex].monthsToPay == 0
                ) {
                    sellerInvoices[_sellerPan][sellerInvoiceIndex]
                        .status = true;
                    buyerInvoices[_buyerPan][buyerInvoiceIndex].status = true;
                }
            } else if (
                uint8(PaymentMode.OFFLINE_CASH) ==
                sellerInvoiceList[sellerInvoiceIndex].paymentMode
            ) {
                sellerInvoices[_sellerPan][sellerInvoiceIndex].status = true;
                buyerInvoices[_buyerPan][buyerInvoiceIndex].status = true;
            }
        }
    }

    function withdrawMoney() public nonReentrant {
        uint256 amount = pendingWithdrawals[msg.sender];
        if (amount > 0) {
            pendingWithdrawals[msg.sender] = 0;
            (bool success, ) = payable(msg.sender).call{value: amount}("");
            if (!success) {
                pendingWithdrawals[msg.sender] = amount;
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
            Invoice[] memory sellerInvoiceList = sellerInvoices[PAN];
            return sellerInvoiceList;
        } else {
            Invoice[] memory buyerInvoiceList = buyerInvoices[PAN];
            return buyerInvoiceList;
        }
    }

    function getPendingWithdrawals(
        address _address
    ) public view returns (uint256) {
        return pendingWithdrawals[_address];
    }
}
