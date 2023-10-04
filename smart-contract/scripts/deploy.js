const { ethers } = require("hardhat");

async function main() {
  const contractFactory = await ethers.getContractFactory("TeachContract");

  const contract = await contractFactory.deploy();
  let contractAddress = await contract.getAddress();
  console.log("Contract deployed to address:", contractAddress);
  console.log("To verify run:");
  console.log("npx hardhat verify --network goerli " + contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
