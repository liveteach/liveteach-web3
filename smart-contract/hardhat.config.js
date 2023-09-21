require("@nomicfoundation/hardhat-toolbox");

const { API_URL, PRIVATE_KEY, CONTRACT_ADDRESS, API_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.7",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};
