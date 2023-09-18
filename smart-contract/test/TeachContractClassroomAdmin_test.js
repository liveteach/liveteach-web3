const { assert, expect } = require("chai");

describe("TeachContractClassroomAdmin", function () {
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

  // classroom admin
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

    assert.isTrue(await teachContract.connect(owner).isClassroomAdminAssignedLandIds([1, 2, 3, 4, 5, 6]));
  });

  it("Can remove specific land from existing classroom admin", async function () {
    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    let result = await teachContract.connect(owner).getClassroomAdminLandIds(otherUser);
    assert.equal(4, result.length);
    assert.isTrue(await teachContract.connect(owner).isClassroomAdminAssignedLandIds([1, 2, 3, 4]));
    await teachContract.connect(owner).removeClassroomAdminLandIds(otherUser, [2, 4]);
    result = await teachContract.connect(owner).getClassroomAdminLandIds(otherUser);
    assert.equal(2, result.length);
    assert.equal(1, result[0]);
    assert.equal(3, result[1]);
    assert.isTrue(await teachContract.connect(owner).isClassroomAdminAssignedLandIds([1, 3]));
    assert.isFalse(await teachContract.connect(owner).isClassroomAdminAssignedLandId(2));
    assert.isFalse(await teachContract.connect(owner).isClassroomAdminAssignedLandId(4));
  });

  it("Can remove all land from existing classroom admin", async function () {
    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    let result = await teachContract.connect(owner).getClassroomAdminLandIds(otherUser);
    assert.equal(4, result.length);
    assert.isTrue(await teachContract.connect(owner).isClassroomAdminAssignedLandIds([1, 2, 3, 4]));
    await teachContract.connect(owner).removeAllClassroomAdminLandIds(otherUser);
    result = await teachContract.connect(owner).getClassroomAdminLandIds(otherUser);
    assert.equal(0, result.length);
    assert.isFalse(await teachContract.connect(owner).isClassroomAdminAssignedLandId(1));
    assert.isFalse(await teachContract.connect(owner).isClassroomAdminAssignedLandId(2));
    assert.isFalse(await teachContract.connect(owner).isClassroomAdminAssignedLandId(3));
    assert.isFalse(await teachContract.connect(owner).isClassroomAdminAssignedLandId(4));
  });

  it("Can remove existing classroom admin", async function () {
    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    assert.isTrue(await teachContract.connect(owner).isClassroomAdminAssignedLandIds([1, 2, 3, 4]));
    let result = await teachContract.connect(owner).isClassroomAdmin(otherUser);
    assert.equal("true", result.toString());
    await teachContract.connect(owner).removeClassroomAdmin(otherUser);
    result = await teachContract.connect(owner).isClassroomAdmin(otherUser);
    assert.equal("false", result.toString());
    assert.isFalse(await teachContract.connect(owner).isClassroomAdminAssignedLandId(1));
    assert.isFalse(await teachContract.connect(owner).isClassroomAdminAssignedLandId(2));
    assert.isFalse(await teachContract.connect(owner).isClassroomAdminAssignedLandId(3));
    assert.isFalse(await teachContract.connect(owner).isClassroomAdminAssignedLandId(4));
  });

  it("Can't create classroom admin if already classroom admin", async function () {
    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await expect(teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]))
      .to.be.revertedWith("Provided wallet address is already CLASSROOM_ADMIN");
  });

  it("Can't add land to non classroom admin", async function () {
    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await expect(teachContract.connect(owner).addClassroomAdminLandIds(randomWallet, [5, 6]))
      .to.be.revertedWith("Provided wallet address is not CLASSROOM_ADMIN");

    assert.isFalse(await teachContract.connect(owner).isClassroomAdminAssignedLandId(5));
    assert.isFalse(await teachContract.connect(owner).isClassroomAdminAssignedLandId(6));
  });

  it("Can't remove specific land from non classroom admin", async function () {
    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await expect(teachContract.connect(owner).removeClassroomAdminLandIds(randomWallet, [2, 4]))
      .to.be.revertedWith("Provided wallet address is not CLASSROOM_ADMIN");

    assert.isTrue(await teachContract.connect(owner).isClassroomAdminAssignedLandId(2));
    assert.isTrue(await teachContract.connect(owner).isClassroomAdminAssignedLandId(4));
  });

  it("Can't remove all land from non classroom admin", async function () {
    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await expect(teachContract.connect(owner).removeAllClassroomAdminLandIds(randomWallet))
      .to.be.revertedWith("Provided wallet address is not CLASSROOM_ADMIN");

    assert.isTrue(await teachContract.connect(owner).isClassroomAdminAssignedLandIds([1, 2, 3, 4]));
  });

  it("Can't remove non classroom admin", async function () {
    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await expect(teachContract.connect(owner).removeClassroomAdmin(randomWallet))
      .to.be.revertedWith("Provided wallet address is not CLASSROOM_ADMIN");
    assert.isTrue(await teachContract.connect(owner).isClassroomAdminAssignedLandIds([1, 2, 3, 4]));
  });

  it("Can't add same landId to classroom admin twice", async function () {
    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await expect(teachContract.connect(owner).addClassroomAdminLandIds(otherUser, [4]))
      .to.be.revertedWith("Land ID already assigned");
  });

  it("Can't add already assigned landId to different classroom admin on create", async function () {
    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await expect(teachContract.connect(owner).createClassroomAdmin(randomWallet, [4, 5, 6]))
      .to.be.revertedWith("Land ID already assigned");
    let result = await teachContract.connect(owner).isClassroomAdmin(randomWallet);
    assert.isFalse(result);
    assert.isTrue(await teachContract.connect(owner).isClassroomAdminAssignedLandIds([1, 2, 3, 4]));
    assert.isFalse(await teachContract.connect(owner).isClassroomAdminAssignedLandId(5));
    assert.isFalse(await teachContract.connect(owner).isClassroomAdminAssignedLandId(6));
  });

  it("Can't add already assigned landId to different classroom admin on add", async function () {
    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(owner).createClassroomAdmin(randomWallet, [5, 6]);
    await expect(teachContract.connect(owner).addClassroomAdminLandIds(randomWallet, [1, 2]))
      .to.be.revertedWith("Land ID already assigned");

    assert.isTrue(await teachContract.connect(owner).isClassroomAdminAssignedLandIds([1, 2, 3, 4, 5, 6]));
  });
});
