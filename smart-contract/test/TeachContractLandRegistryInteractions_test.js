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

function getGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}