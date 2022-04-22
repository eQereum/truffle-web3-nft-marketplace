// SPDX-License-Identifier: MIT

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';

pragma solidity ^0.8.13;

interface INFTMarketplace {
    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
    }

    event CreateMarketItemLog(uint256 indexed itemId, address indexed nftContract, uint256 indexed tokenId, address seller, address owner, uint256 price);
    event ItemSoldLog(uint256 indexed itemId, address indexed nftContract, uint256 indexed tokenId, address oldOwner, address newOwner);

    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external payable;

    function buyItem(address nftContract, uint256 itemId) external payable;

    function fetchUnsoldMarketItems() external view returns (MarketItem[] memory);

    function fetchMyNFTsBoughtFromMarketplace() external view returns (MarketItem[] memory);
}
