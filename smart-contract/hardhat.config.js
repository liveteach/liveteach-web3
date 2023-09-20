require("@nomicfoundation/hardhat-toolbox");

const { API_URL, PRIVATE_KEY, CONTRACT_ADDRESS, API_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "goerli",
  networks: {
    hardhat: {},
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/gKjWBjZ3AyWfksKu5hvxNGN_yVTsj1Pt",
      accounts: ["0x46af6a1c6c0fd25488d628f3be504d47c39ae8a79c886ca4b33e7b9389919690"],
    }
  },
  solidity: "0.8.7",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};
