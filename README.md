# NFT Marketplace with Truffle/Web3js

This project represents deploying of NFT (ERC721) contract & NFT Marketplace for trading NFT tokens. You can also compare this project with **Hardhat/Ethers** version of it that published earlier in [**here**](https://github.com/0xhamedETH/hardhat-ethers-nextjs-nft-marketplace). This would be useful for learning both pack of tools.

### Clone the repository

```shell
git clone --recursive https://github.com/0xhamedETH/truffle-web3-nft-marketplace.git your-directory
```

### Install Packages

```shell
cd your-directory/ethereum
npm install
```

### Compile

compile first to create json artifacts in `build` folder

```shell
truffle compile
```

### Test

- Run `ganache-cli` in separate terminal

```shell
ganache-cli
```

- Run `truffle test` in main terminal

```shell
truffle test test/nft.test.js
```

### Deploy

For this step you first need to fill `.env` file with your api keys (`Alchemy`, ...)

You can deploy both contracts in any network you want (make sure `truffle-config.js` contains that network)

for example: `maticMumbai`

```shell
truffle migrate --reset --network maticMumbai
```

After a while, you would see deployment transaction details of both NFT and NFTMarketplace contracts in console.
