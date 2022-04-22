// SPDX-License-Identifier: MIT

import './INFT.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';

pragma solidity ^0.8.13;

abstract contract NFTContext is ERC721URIStorage, INFT {
    address internal owner;
    uint256 internal _tokenIds;
    address public marketplaceAddress;
}
