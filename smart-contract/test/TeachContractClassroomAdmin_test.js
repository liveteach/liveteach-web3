const { assert, expect } = require("chai");

describe("TeachContractClassroomAdmin", function () {
  let owner;
  let user1;
  let user2;
  let teachContract;
  let operator;
  let landContract 
  this.beforeEach(async function () {
    teachContract = await ethers.deployContract("contracts/TeachContract.sol:TeachContract");

    let accounts = await ethers.getSigners();
    owner = accounts[0];
    user1 = accounts[1];
    user2 = accounts[2];
    operator = accounts[4];

    await teachContract.connect(owner).initialize();
    landContract = await ethers.deployContract("contracts/references/LANDRegistry.sol:LANDRegistry");
    let landContractAddress = await landContract.target;
    await teachContract.connect(owner).setLANDRegistry(landContractAddress);
    await landContract.connect(owner).assignMultipleParcels([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 1], owner);
    for (let i = 1; i < 22; i++) {
      await landContract.connect(owner).approve(operator, i);
    }
    await landContract.connect(owner).approve(operator, 340282366920938463463374607431768211457n);
  })

  // classroom admin
  it("Can create classroom admin", async function () {
    await teachContract.connect(operator).createClassroomAdmin(user1, [1, 2, 3, 4]);
    let result = await teachContract.connect(owner).isClassroomAdmin(user1);
    assert.equal("true", result.toString()); // string conversion to assert actual true rather than truthy value
    result = await teachContract.connect(owner).getClassroomAdmin(user1);
    assert.equal(4, result.landCoordinates.length);
  });

  it("Cannot create a classroom admin with already assigned land ids.", async function () {
    await teachContract.connect(operator).createClassroomAdmin(user1, [1, 2, 3, 4]);
    await expect(teachContract.connect(operator).createClassroomAdmin(user2, [4, 5]))
      .to.be.revertedWith("Provided id invalid.");
  });

  it("Cannot create a double classroom admin", async function () {
    await teachContract.connect(operator).createClassroomAdmin(user1, [1, 2, 3, 4]);
    await expect(teachContract.connect(operator).createClassroomAdmin(user1, [4, 5]))
      .to.be.revertedWith("Provided wallet already has role.");
  });

  it("Can get all classroom admins", async function () {
    await teachContract.connect(operator).createClassroomAdmin(user1, [1, 2, 3, 4]);
    await teachContract.connect(operator).createClassroomAdmin(user2, [5, 6]);

    let result = await teachContract.connect(operator).getClassroomAdmins();
    assert.equal(2, result.length);
    let classroomAdmin1 = result[0];
    let classroomAdmin2 = result[1];

    assert.equal(user1.address, classroomAdmin1.walletAddress);
    assert.equal(user2.address, classroomAdmin2.walletAddress);

    assert.equal([1n, 2n, 3n, 4n].toString(), classroomAdmin1.landIds);
    assert.equal([5n, 6n].toString(), classroomAdmin2.landIds);
  });

  it("Can get single classroom admin", async function () {
    await teachContract.connect(operator).createClassroomAdmin(user1, [1, 2, 3, 4]);
    await teachContract.connect(operator).createClassroomAdmin(user2, [5, 6]);

    let classroomAdmin1 = await teachContract.connect(owner).getClassroomAdmin(user1.address);

    assert.equal(user1.address, classroomAdmin1.walletAddress);
    assert.equal([1n, 2n, 3n, 4n].toString(), classroomAdmin1.landIds);
  });

  it("Cannot get single non existing classroom admin", async function () {
    await expect(teachContract.connect(owner).getClassroomAdmin(user1.address))
      .to.be.revertedWith("Classroom admin not found.");
  });


  it("Can update existing classroom admin", async function () {
    await teachContract.connect(operator).createClassroomAdmin(user1, [1, 2, 3, 4]);
    let result = await teachContract.connect(owner).getClassroomAdmin(user1);
    assert.equal(user1.address, result.walletAddress);
    assert.equal([1n, 2n, 3n, 4n].toString(), result.landIds.toString());
    await teachContract.connect(owner).updateClassroomAdmin(user1, [5, 6]);
    result = await teachContract.connect(owner).getClassroomAdmin(user1);
    assert.equal(user1.address, result.walletAddress);
    assert.equal([5n, 6n].toString(), result.landIds.toString());
  });

  it("Cannot update existing classroom admin with already assigned land ids", async function () {
    await teachContract.connect(operator).createClassroomAdmin(user2, [5, 6]);
    await teachContract.connect(operator).createClassroomAdmin(user1, [1, 2, 3, 4]);
    let result = await teachContract.connect(owner).getClassroomAdmin(user1);
    assert.equal(user1.address, result.walletAddress);
    assert.equal([1n, 2n, 3n, 4n].toString(), result.landIds.toString());
    await expect(teachContract.connect(owner).updateClassroomAdmin(user1, [5, 6]))
      .to.be.revertedWith("Provided id invalid.");
  });

  it("Cannot update a non classroom admin", async function () {
    await expect(teachContract.connect(owner).updateClassroomAdmin(user1, [5, 6]))
      .to.be.revertedWith("Provided wallet lacks appropriate role.");
  });

  it("Can delete classroom admin", async function () {
    await teachContract.connect(operator).createClassroomAdmin(user1, [1, 2, 3, 4]);
    let result = await teachContract.connect(owner).getClassroomAdmins();
    assert.equal(1, result.length);
    await teachContract.connect(owner).deleteClassroomAdmin(user1);
    result = await teachContract.connect(owner).getClassroomAdmins();
    assert.equal(result.length, 0);
  });

  it("Cannot delete non existing classroom admin", async function () {
    await expect(teachContract.connect(owner).deleteClassroomAdmin(user1))
      .to.be.revertedWith("Provided wallet lacks appropriate role.");
  });

});

function getGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}