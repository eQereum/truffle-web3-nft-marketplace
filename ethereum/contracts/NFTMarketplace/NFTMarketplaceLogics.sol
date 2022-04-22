// SPDX-License-Identifier: MIT

import './NFTMarketplaceContext.sol';

pragma solidity ^0.8.13;

abstract contract NFTMarketPlaceLogics is NFTMarketplaceContext {
    function _createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) internal {
        require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, 'only owner of tokenId can create corresponding item');
        require(price > 0, 'item price must be at least 1 wei');
        require(msg.value == listingPrice, 'listing price is 0.1 ether');

        _itemIds++;
        uint256 itemId = _itemIds;
        idToMarketItem[itemId] = MarketItem(itemId, nftContract, tokenId, payable(msg.sender), payable(address(0)), price);
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        emit CreateMarketItemLog(itemId, nftContract, tokenId, msg.sender, address(0), price);
    }

    function _buyItem(address nftContract, uint256 itemId) internal {
        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        require(msg.value == price, 'submitted price differs from item price');

        idToMarketItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender);
        _itemsSold++;
        payable(owner).transfer(listingPrice);
        emit ItemSoldLog(itemId, nftContract, tokenId, idToMarketItem[itemId].seller, idToMarketItem[itemId].owner);
    }

    function _fetchUnsoldMarketItems() internal view returns (MarketItem[] memory) {
        uint256 itemCount = _itemIds;
        uint256 unsoldItemCount = _itemIds - _itemsSold;
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(0)) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    function _fetchMyNFTsBoughtFromMarketplace() internal view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds;
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }
}
