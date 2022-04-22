const NFTMarketplace = artifacts.require('NFTMarketplace');
const NFT = artifacts.require('NFT');

module.exports = function (deployer) {
  deployer.deploy(NFTMarketplace).then(function () {
    return deployer.deploy(NFT, NFTMarketplace.address);
  });
};
