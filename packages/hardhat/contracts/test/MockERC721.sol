// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract MockERC721 is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    // metadata URI
    string private _baseTokenURI;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("TestNFT", "TNFT") {
        _baseTokenURI = "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/";
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function mint() public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Enumerable) returns (bool) {
      return super.supportsInterface(interfaceId);
    }

    function getOwnerTokens(address owner) public view returns (uint256[] memory) {
        uint256 owner_balance = super.balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](owner_balance);
        for(uint i = 0; i < owner_balance; i++){
            tokenIds[i] = super.tokenOfOwnerByIndex(owner, i);
        }
        return tokenIds;
    }
}
