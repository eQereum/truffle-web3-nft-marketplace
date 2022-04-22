// SPDX-License-Identifier: MIT

import './NFT/NFTLogics.sol';

pragma solidity ^0.8.13;

contract NFT is NFTLogics {
    constructor(address _marketplaceAddress) ERC721('My Digital Marketplace', 'MDM') {
        marketplaceAddress = _marketplaceAddress;
    }

    function createToken(string memory tokenURI) public returns (uint256) {
        return _createToken(tokenURI);
    }
}
