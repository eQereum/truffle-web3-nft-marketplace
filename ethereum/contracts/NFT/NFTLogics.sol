// SPDX-License-Identifier: MIT
import './NFTContext.sol';
pragma solidity ^0.8.13;

abstract contract NFTLogics is NFTContext {
    function _createToken(string memory tokenURI) internal returns (uint256) {
        _tokenIds++;
        uint256 newItemId = _tokenIds;

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(marketplaceAddress, true);
        emit CreateTokenLog(newItemId, tokenURI);
        return newItemId;
    }
}
