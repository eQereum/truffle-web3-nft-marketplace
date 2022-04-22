const Web3 = require('web3');
const assert = require('assert');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

contract('NFTMarketplace & NFT Contract -----------------------------------------------------', (accounts) => {
  let owner, seller1, seller2, seller3, attacker, buyer, truffleNFTMarketplace, truffleNFT, NFTAddress;

  before('deploying NFTMarketplace & NFT', async () => {
    [owner, seller1, seller2, seller3, attacker, buyer] = accounts;

    const NFTMarketplace = await artifacts.require('NFTMarketplace');
    const NFT = await artifacts.require('NFT');
    truffleNFTMarketplace = await NFTMarketplace.new();
    truffleNFT = await NFT.new(truffleNFTMarketplace.address, { from: owner });
    NFTAddress = truffleNFT.address;
  });

  describe('NFT', () => {
    describe('createToken()', () => {
      it('should emit CreateTokenLog(1,string)', async () => {
        const tx1 = await truffleNFT.createToken('https://test-script1.io', { from: seller1 });
        assert.equal(tx1.logs[2].args.tokenId, 1);
        assert.equal(tx1.logs[2].args.tokenURI, web3.utils.keccak256('https://test-script1.io'));
      });

      it('should emit CreateTokenLog(1,string)', async () => {
        const tx2 = await truffleNFT.createToken('https://test-script11.io', { from: seller1 });
        assert.equal(tx2.logs[2].args.tokenId, 2);
        assert.equal(tx2.logs[2].args.tokenURI, web3.utils.keccak256('https://test-script11.io'));
      });

      it('should emit CreateTokenLog(2,string)', async () => {
        const tx3 = await truffleNFT.createToken('https://test-script2.io', { from: seller2 });
        assert.equal(tx3.logs[2].args.tokenId, 3);
        assert.equal(tx3.logs[2].args.tokenURI, web3.utils.keccak256('https://test-script2.io'));
      });
    });
  });

  describe('NFTMarketplace', () => {
    describe('createMarketItem()', () => {
      it('should revert when minimum price <=0 ', async () => {
        try {
          const tx = await truffleNFTMarketplace.createMarketItem(NFTAddress, 1, 0, { from: seller1, value: web3.utils.toWei('0.1', 'ether') });
          assert.isNull(tx);
        } catch (error) {
          assert.equal(error.reason, 'item price must be at least 1 wei');
        }
      });

      it('should revert when msg.value < 0.1 ether ', async () => {
        try {
          const tx = await truffleNFTMarketplace.createMarketItem(NFTAddress, 1, web3.utils.toWei('0.2'), { from: seller1, value: web3.utils.toWei('0.01', 'ether') });
          assert.isNull(tx);
        } catch (error) {
          assert.equal(error.reason, 'listing price is 0.1 ether');
        }
      });

      it('should revert when item creator is not owner of tokenId', async () => {
        try {
          const tx = await truffleNFTMarketplace.createMarketItem(NFTAddress, 1, web3.utils.toWei('0.2'), { from: seller3, value: web3.utils.toWei('0.1', 'ether') });
          assert.isNull(tx);
        } catch (error) {
          assert.equal(error.reason, 'only owner of tokenId can create corresponding item');
        }
      });

      it('should emit CreateMarketItemLog', async () => {
        const tx1 = await truffleNFTMarketplace.createMarketItem(NFTAddress, 1, web3.utils.toWei('0.2'), { from: seller1, value: web3.utils.toWei('0.1', 'ether') });
        assert.equal(tx1.logs[0].args.itemId, 1);
        assert.equal(tx1.logs[0].args.nftContract, NFTAddress);
        assert.equal(tx1.logs[0].args.tokenId, 1);
        assert.equal(tx1.logs[0].args.seller, seller1);
        assert.equal(tx1.logs[0].args.owner, '0x0000000000000000000000000000000000000000');
        assert.equal(tx1.logs[0].args.price, web3.utils.toWei('0.2', 'ether'));

        const tx2 = await truffleNFTMarketplace.createMarketItem(NFTAddress, 2, web3.utils.toWei('0.5'), { from: seller1, value: web3.utils.toWei('0.1', 'ether') });
        assert.equal(tx2.logs[0].args.itemId, 2);
        assert.equal(tx2.logs[0].args.nftContract, NFTAddress);
        assert.equal(tx2.logs[0].args.tokenId, 2);
        assert.equal(tx2.logs[0].args.seller, seller1);
        assert.equal(tx2.logs[0].args.owner, '0x0000000000000000000000000000000000000000');
        assert.equal(tx2.logs[0].args.price, web3.utils.toWei('0.5', 'ether'));

        const tx3 = await truffleNFTMarketplace.createMarketItem(NFTAddress, 3, web3.utils.toWei('0.3'), { from: seller2, value: web3.utils.toWei('0.1', 'ether') });
        assert.equal(tx3.logs[0].args.itemId, 3);
        assert.equal(tx3.logs[0].args.nftContract, NFTAddress);
        assert.equal(tx3.logs[0].args.tokenId, 3);
        assert.equal(tx3.logs[0].args.seller, seller2);
        assert.equal(tx3.logs[0].args.owner, '0x0000000000000000000000000000000000000000');
        assert.equal(tx3.logs[0].args.price, web3.utils.toWei('0.3', 'ether'));

        assert.equal((await truffleNFTMarketplace.idToMarketItem(1, { from: owner })).nftContract, NFTAddress);
        assert.equal((await truffleNFTMarketplace.idToMarketItem(2, { from: owner })).nftContract, NFTAddress);
      });
    });

    describe('buyItem()', () => {
      it('should revert when msg.value != price', async () => {
        try {
          const tx1 = await truffleNFTMarketplace.buyItem(NFTAddress, 1, { from: buyer, value: web3.utils.toWei('0.1', 'ether') });
          const tx2 = await truffleNFTMarketplace.buyItem(NFTAddress, 2, { from: buyer, value: web3.utils.toWei('0.2', 'ether') });
          const tx3 = await truffleNFTMarketplace.buyItem(NFTAddress, 3, { from: buyer, value: web3.utils.toWei('0.5', 'ether') });
          assert.isNull(tx1);
          assert.isNull(tx2);
          assert.isNull(tx3);
        } catch (error) {
          assert.equal(error.reason, 'submitted price differs from item price');
        }
      });

      it('should emit ItemSoldLog', async () => {
        const tx1 = await truffleNFTMarketplace.buyItem(NFTAddress, 1, { from: buyer, value: web3.utils.toWei('0.2', 'ether') });
        assert.equal(tx1.logs[0].args.itemId.toString(), '1');
        assert.equal(tx1.logs[0].args.nftContract, NFTAddress);
        assert.equal(tx1.logs[0].args.tokenId.toString(), '1');
        assert.equal(tx1.logs[0].args.oldOwner, seller1);
        assert.equal(tx1.logs[0].args.newOwner, buyer);

        const tx2 = await truffleNFTMarketplace.buyItem(NFTAddress, 3, { from: buyer, value: web3.utils.toWei('0.3', 'ether') });
        assert.equal(tx2.logs[0].args.itemId.toString(), '3');
        assert.equal(tx2.logs[0].args.nftContract, NFTAddress);
        assert.equal(tx2.logs[0].args.tokenId.toString(), '3');
        assert.equal(tx2.logs[0].args.oldOwner, seller2);
        assert.equal(tx2.logs[0].args.newOwner, buyer);
      });
    });

    describe('fetchUnsoldMarketItems()', () => {
      it('should return unsold market items (item2)', async () => {
        assert.equal((await truffleNFTMarketplace.fetchUnsoldMarketItems({ from: owner }))[0].seller, seller1);
      });
    });

    describe('fetchMyNFTsBoughtFromMarketplace()', () => {
      it('should return unsold market items of seller1 => []', async () => {
        const tx = await truffleNFTMarketplace.fetchMyNFTsBoughtFromMarketplace({ from: seller1 });
        assert.equal(tx.length, 0);
      });

      it('should return bought market items of buyer', async () => {
        const tx = await truffleNFTMarketplace.fetchMyNFTsBoughtFromMarketplace({ from: buyer });
        assert.equal(tx[0].seller, seller1);
        assert.equal(tx[0].owner, buyer);

        assert.equal(tx[1].seller, seller2);
        assert.equal(tx[1].owner, buyer);
      });
    });
  });
});
