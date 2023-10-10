// scripts/upgrade-box.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  const teachContractFactory = await ethers.getContractFactory("TeachContract");
  const teachContract = await upgrades.upgradeProxy("0x62657bdB46C8508db48aB8d36E636F9B83e723E3",
    teachContractFactory);
  console.log("teachContract deployed to:", await teachContract.getAddress());
  console.log(teachContract);
}

main();