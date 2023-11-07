const { assert, expect } = require("chai");

describe("TeachContractLandRegistryInteractions", function () {

  let contractOwner;
  let landOwner;
  let operator;
  let nonOperator

  let oneOne = 340282366920938463463374607431768211457n;
  let twoTwo = 680564733841876926926749214863536422914n;
  // let threeThree = 1020847100762815390390123822295304634371n;
  // let fourFour = 1361129467683753853853498429727072845828n;
  // let fiveFive = 1701411834604692317316873037158841057285n;
  let sixSix = 2041694201525630780780247644590609268742n;
  // let sevenSeven = 2381976568446569244243622252022377480199n;
  // let eightEight = 2722258935367507707706996859454145691656n;
  // let nineNine = 3062541302288446171170371466885913903113n;

  let teachContract;
  let landRegistryContract;

  this.beforeEach(async function () {
    teachContract = await ethers.deployContract("contracts/TeachContract.sol:TeachContract");
    proxy = await ethers.deployContract("contracts/references/LANDRegistry.sol:ProxyStorage");
    landRegistryContract = await ethers.deployContract("contracts/references/LANDRegistry.sol:LANDRegistry");

    let accounts = await ethers.getSigners();
    contractOwner = accounts[0];
    landOwner = accounts[1]
    operator = accounts[2];
    nonOperator = accounts[3];

    await teachContract.connect(contractOwner).setLANDRegistry(landRegistryContract);

    // set up a land
    await landRegistryContract.connect(contractOwner).assignMultipleParcels([1, 2, 3, 4, 5], [1, 2, 3, 4, 5], landOwner);
    await landRegistryContract.connect(landOwner).setApprovalForAll(operator, true);
    // await landRegistryContract.connect(landOwner).approve(operator, 340282366920938463463374607431768211457n);

  })

  it("Test data looks right", async function () {
    let result = await landRegistryContract.connect(contractOwner).landOf(landOwner);
    assert.equal([[1n, 2n, 3n, 4n, 5n], [1n, 2n, 3n, 4n, 5n]].toString(), result);
    result = await landRegistryContract.connect(landOwner).isApprovedForAll(landOwner, operator);
    assert.equal(true, result);
    // for (let i = 1; i < 10; i++) {
    //   result = await landRegistryContract.connect(landOwner).encodeTokenId(i, i);
    //   console.log(result);
    // }

  });

  it("Land Operator can create classroom admin with assigned land", async function () {
    await teachContract.connect(operator).createClassroomAdmin(nonOperator, [
      oneOne,
      twoTwo
    ]);
    // get the classroom admin and check it looks right
    let classroomAdmin = await teachContract.connect(landOwner).getClassroomAdmin(nonOperator.address);
    assert.equal(nonOperator.address, classroomAdmin.walletAddress);
    assert.equal([oneOne, twoTwo].toString(), classroomAdmin.landIds);

  });
  it("Land Operator cannot create classroom admin with unassigned land", async function () {
    await expect(teachContract.connect(operator).createClassroomAdmin(nonOperator, [
      oneOne,
      sixSix
    ])).to.be.revertedWith("You don't have access to this land");
  });
});

function getGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}