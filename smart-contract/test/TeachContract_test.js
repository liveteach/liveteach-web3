const { assert, expect } = require("chai");

describe("TeachContract", function () {
  let owner;
  let otherUser;
  let teachContract;
  let randomWallet = "0xAA14f5F645273Aa6411995Bf8F02557B7C74a154";

  this.beforeEach(async function () {
    teachContract = await ethers.deployContract("contracts/TeachContract.sol:TeachContract");
    let accounts = await ethers.getSigners();
    owner = accounts[0];
    otherUser = accounts[1];
  })

  it("Can create classroom admin", async function () {
    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    let result = await teachContract.connect(owner).isClassroomAdmin(otherUser);
    assert.equal("true", result.toString()); // string conversion to assert actual true rather than truthy value
  });

  it("Can add land to existing classroom admin", async function () {
    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    let result = await teachContract.connect(owner).getClassroomAdminLandIds(otherUser);
    assert.equal(4, result.length);
    assert.equal(1, result[0]);
    assert.equal(2, result[1]);
    assert.equal(3, result[2]);
    assert.equal(4, result[3]);
    await teachContract.connect(owner).addClassroomAdminLandIds(otherUser, [5, 6]);
    result = await teachContract.connect(owner).getClassroomAdminLandIds(otherUser);
    assert.equal(6, result.length);
    assert.equal(1, result[0]);
    assert.equal(2, result[1]);
    assert.equal(3, result[2]);
    assert.equal(4, result[3]);
    assert.equal(5, result[4]);
    assert.equal(6, result[5]);
  });

  it("Can remove specific land from existing classroom admin", async function () {
    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    let result = await teachContract.connect(owner).getClassroomAdminLandIds(otherUser);
    assert.equal(4, result.length);
    await teachContract.connect(owner).removeClassroomAdminLandIds(otherUser, [2, 4]);
    result = await teachContract.connect(owner).getClassroomAdminLandIds(otherUser);
    assert.equal(2, result.length);
    assert.equal(1, result[0]);
    assert.equal(3, result[1]);
  });

  it("Can remove all land from existing classroom admin", async function () {
    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    let result = await teachContract.connect(owner).getClassroomAdminLandIds(otherUser);
    assert.equal(4, result.length);
    await teachContract.connect(owner).removeAllClassroomAdminLandIds(otherUser);
    result = await teachContract.connect(owner).getClassroomAdminLandIds(otherUser);
    assert.equal(0, result.length);
  });

  it("Can remove existing classroom admin", async function () {
    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    let result = await teachContract.connect(owner).isClassroomAdmin(otherUser);
    assert.equal("true", result.toString());
    await teachContract.connect(owner).removeClassroomAdmin(otherUser);
    result = await teachContract.connect(owner).isClassroomAdmin(otherUser);
    assert.equal("false", result.toString());
  });

  it("Can't create classroom admin if already classroom admin", async function () {
    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    try {
      await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    }
    catch {
      return;
    }
    assert.fail("Create classroom admin can be called twice for the same wallet");
  });

  it("Can't add land to non classroom admin", async function () {
    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    try {
      await teachContract.connect(owner).addClassroomAdminLandIds(randomWallet, [5, 6]);
    }
    catch {
      return;
    }
    assert.fail("Can't add land to non classroom admin");
  });

  it("Can't remove specific land from non classroom admin", async function () {
    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    try {
      await teachContract.connect(owner).removeClassroomAdminLandIds(randomWallet, [2, 4]);
    }
    catch {
      return;
    }
    assert.fail("Can't remove specific land from non classroom admin");
  });

  it("Can't remove all land from non classroom admin", async function () {
    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    try {
      await teachContract.connect(owner).removeAllClassroomAdminLandIds(randomWallet);
    }
    catch {
      return;
    }
    assert.fail("Can't remove all land from non classroom admin");
  });

  it("Can't remove non classroom admin", async function () {
    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    try {
      await teachContract.connect(owner).removeClassroomAdmin(randomWallet);
    }
    catch {
      return;
    }
    assert.fail("Can't remove non classroom admin");
  });



  // can't add same land twice



  // it("Can create classroom admin with zero land ids", async function () {
  // });
});
