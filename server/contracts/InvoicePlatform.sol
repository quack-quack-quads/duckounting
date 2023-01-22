// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// imports
import "./InvoiceNFT.sol";
import "./InvoicePlatformHelper.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "base64-sol/base64.sol";

// errors
error InvoiceNotExist();
error WrongBuyer();
error PersonAlreadyExists();
error NftNotExist();

contract InvoicePlatform is InvoiceNFT, InvoicePlatformHelper, ReentrancyGuard {
    // events
    event RegisterPerson(string pan);
    event Paid(string sellerPan, string buyerPan);

    mapping(string => uint256) public panToTokenId;

    constructor(
        string memory _commonURI,
        string memory _mediumURI,
        string memory _rareURI
    ) InvoiceNFT(_commonURI, _mediumURI, _rareURI) {
        invoiceIdCount = 0;
    }

    // ! overriding the tokenURI function of ERC721 to return the metadata URI
    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) {
            revert NftNotExist();
        }
        // since we're using dynamic metadata, we need to return the tokenURI based on the rating of the seller
        Person storage seller = persons[tokenIdToPan[tokenId]];
        uint8 rating = seller.rating;
        string memory imageURI = _getImageURI(rating);
        return
            string(
                abi.encodePacked(
                    _baseURI(),
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                name(),
                                '", "description":"An NFT that changes based on the rating that a seller has.", ',
                                '"attributes": [{"trait_type": "rating", "value":"',
                                Strings.toString(rating),
                                '"}],',
                                '"image":"',
                                imageURI,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    function registerPerson(string memory _pan) public {
        if (persons[_pan].addr != address(0)) {
            revert PersonAlreadyExists();
        }
        persons[_pan] = Person({
            addr: msg.sender,
            rating: 5,
            percentSuccess: 100
        });
        // should not register person if already exists
        // mint the NFT for him
        s_tokenCounter++;
        tokenIdToPan[s_tokenCounter] = _pan;
        _safeMint(msg.sender, s_tokenCounter);
        panToTokenId[_pan] = s_tokenCounter;
        emit RegisterPerson(_pan);
    }

    function pay(
        address _sellerAddress,
        string memory _buyerPan,
        string memory _sellerPan,
        uint256 _id
    ) public payable nonReentrant {
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

        if (sellerInvoiceIndex == sellerInvoiceList.length) {
            // invoice not exists
            revert InvoiceNotExist();
        } else {
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
            emit Paid(_sellerPan, _buyerPan);
        }
    }

    // getters
    function getTokenId(string memory _pan) public view returns (uint256) {
        return panToTokenId[_pan];
    }
}
