require("@nomicfoundation/hardhat-toolbox");

const { API_URL, PRIVATE_KEY, CONTRACT_ADDRESS, API_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {

  solidity: {
    compilers: [
      {
        version: "0.8.7",
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
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};
