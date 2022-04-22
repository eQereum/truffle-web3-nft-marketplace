require('dotenv').config();
const path = require('path');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const MNEMONIC = process.env.MNEMONIC;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const ALCHEMY_API_ID = process.env.ALCHEMY_API_ID;

// ALCHEMY ENDPOINTS
const MAINNET_ENDPOINT_ALCHEMY = `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_ID}`;
const KOVAN_ENDPOINT_ALCHEMY = `https://eth-kovan.alchemyapi.io/v2/${ALCHEMY_API_ID}`;
const RINKEBY_ENDPOINT_ALCHEMY = `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_ID}`;
const ROPSTEN_ENDPOINT_ALCHEMY = `https://eth-ropsten.alchemyapi.io/v2//${ALCHEMY_API_ID}`;
const GOERLI_ENDPOINT_ALCHEMY = `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_ID}`;

// INFURA ENDPOINTS
const MAINNET_ENDPOINT_INFURA = `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`;
const KOVAN_ENDPOINT_INFURA = `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`;
const RINKEBY_ENDPOINT_INFURA = `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`;
const ROPSTEN_ENDPOINT_INFURA = `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`;
const GOERLI_ENDPOINT_INFURA = `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`;

module.exports = {
  // OPTIONAL
  contracts_directory: './contracts',
  migrations_directory: './migrations',
  // contracts_build_directory: path.join(__dirname, "../client/src/contracts"),
  contracts_build_directory: path.join(__dirname, 'build'),
  compilers: {
    solc: {
      version: '^0.8.13',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },

  networks: {
    localhost: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
    },

    mainNet: {
      provider: new HDWalletProvider(MNEMONIC, MAINNET_ENDPOINT_ALCHEMY),
      network_id: 1,
      gas: 4500000,
      gasPrice: 10000000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    kovan: {
      provider: new HDWalletProvider(MNEMONIC, KOVAN_ENDPOINT_ALCHEMY),
      network_id: 42,
      gas: 4500000,
      gasPrice: 10000000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    rinkeby: {
      provider: () => new HDWalletProvider(MNEMONIC, RINKEBY_ENDPOINT_ALCHEMY),
      network_id: 4,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    ropsten: {
      provider: () => new HDWalletProvider(MNEMONIC, ROPSTEN_ENDPOINT_ALCHEMY),
      network_id: 3,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    bscTestnet: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://data-seed-prebsc-1-s1.binance.org:8545/`),
      network_id: 97,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    bscMainnet: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://bsc-dataseed1.binance.org`),
      network_id: 56,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    maticMumbai: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://rpc-mumbai.maticvigil.com`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  mocha: {},
};
