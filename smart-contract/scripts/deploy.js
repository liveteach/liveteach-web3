const { ethers, upgrades } = require("hardhat");

async function main() {
  const teachContractFactory = await ethers.getContractFactory("TeachContract");
  const teachContract = await upgrades.deployProxy(teachContractFactory);
  await teachContract.waitForDeployment();
  let contractAddress = await teachContract.getAddress();
  console.log("Teach Contract deployed to: ", contractAddress);
  console.log("To verify run:");
  console.log("npx hardhat verify --network goerli " + contractAddress);
}

main();