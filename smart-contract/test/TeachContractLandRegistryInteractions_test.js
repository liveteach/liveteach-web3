const { assert, expect } = require("chai");

describe("TeachContractLandRegistryInteractions", function () {

  let owner;

  let teachContract;
  let landRegistryContract;

  this.beforeEach(async function () {
    teachContract = await ethers.deployContract("contracts/TeachContract.sol:TeachContract");
    landRegistryContract = await ethers.deployContract("contracts/references/LANDRegistry.sol:LANDRegistry");

    let accounts = await ethers.getSigners();
    owner = accounts[0];


  })

  it("Test data looks right", async function () {
  });
});