// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InvoiceNFT is ERC721, Ownable {
    uint256 private s_tokenCounter;
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

}
