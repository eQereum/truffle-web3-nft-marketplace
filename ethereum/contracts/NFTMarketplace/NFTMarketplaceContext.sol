// SPDX-License-Identifier: MIT

import './INFTMarketplace.sol';

pragma solidity ^0.8.13;

abstract contract NFTMarketplaceContext is INFTMarketplace {
    uint256 internal _itemIds;
    uint256 internal _itemsSold;

    address payable owner;
    uint256 listingPrice = 0.1 ether;
    mapping(uint256 => MarketItem) public idToMarketItem;
}
