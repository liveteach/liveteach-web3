/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
require('@openzeppelin/hardhat-upgrades');
require("@nomicfoundation/hardhat-verify");

const { GOERLI_API_URL, SEPOLIA_API_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

module.exports = {
  networks: {
    hardhat: {},
    sepolia: {
      url: SEPOLIA_API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    mainnet: {
      url: MAINNET_JSON_RPC_PROVIDER_URL,
      accounts: [`0x${MAINNET_PRIVATE_KEY}`],
      // gasPrice: 60000000000, // 60 gwei
    },
    goerli: {
      url: GOERLI_API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.12",
        settings: {
          optimizer: {
            enabled: true,
          },
        }
      },
      {
        version: "0.4.24",
        settings: {
          optimizer: {
            enabled: true,
            "runs": 10
          },
        }
      }]
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API_KEY,
      sepolia: ETHERSCAN_API_KEY
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};
