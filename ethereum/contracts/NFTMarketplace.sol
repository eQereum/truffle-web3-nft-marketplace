// SPDX-License-Identifier: MIT
import './NFTMarketplace/NFTMarketplaceLogics.sol';
import './NFTMarketplace/NFTMarketplaceModifiers.sol';

pragma solidity ^0.8.13;

contract NFTMarketplace is NFTMarketplaceModifiers, NFTMarketPlaceLogics {
    constructor() {
        owner = payable(msg.sender);
    }

    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        _createMarketItem(nftContract, tokenId, price);
    }

    function buyItem(address nftContract, uint256 itemId) public payable nonReentrant {
        _buyItem(nftContract, itemId);
    }

    function fetchUnsoldMarketItems() public view returns (MarketItem[] memory) {
        return _fetchUnsoldMarketItems();
    }

    function fetchMyNFTsBoughtFromMarketplace() public view returns (MarketItem[] memory) {
        return _fetchMyNFTsBoughtFromMarketplace();
    }
}
