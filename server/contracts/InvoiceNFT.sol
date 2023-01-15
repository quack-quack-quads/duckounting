// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

error InvaidRating();

contract InvoiceNFT is ERC721 {
    uint256 internal s_tokenCounter;
    string private s_commonImageURI;
    string private s_mediumImageURI;
    string private s_rareImageURI;

    // events
    event CreatedNFT(uint256 indexed tokenId, int256 highValue);

    constructor(
        string memory _commonURI,
        string memory _mediumURI,
        string memory _rareURI
    ) ERC721("InvoiceNFT", "INV") {
        s_tokenCounter = 0;
        s_commonImageURI = _commonURI;
        s_mediumImageURI = _mediumURI;
        s_rareImageURI = _rareURI;
    }

    function mintNFT(address personAddr, uint256 _invoiceId) internal {
        _safeMint(personAddr, _invoiceId);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function _getImageURI(uint8 rating) internal view returns (string memory) {
        if (rating > 5 || rating < 0) {
            revert InvaidRating();
        }
        if (rating == 5) {
            return s_rareImageURI;
        } else if (rating >= 3) {
            return s_mediumImageURI;
        }
        return s_commonImageURI;
    }
}
