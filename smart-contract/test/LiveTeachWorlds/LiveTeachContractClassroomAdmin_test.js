const { assert, expect } = require("chai");
const Utils = require("./LiveTeachUtils");

describe("LiveTeachWorldsContractClassroomAdmin", function () {

  this.beforeEach(async function () {
    await Utils.init();
  })

  // classroom admin
  it("Can create world classroom admin", async function () {
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    let result = await Utils.teachContract.connect(Utils.owner).getClassroomAdmin(Utils.user1);
    assert.equal(true, result.worlds.indexOf(Utils.worldName) != -1);
    assert.equal(0, result.landIds);
  });

  it("Can create a classroom admin with already assigned world.", async function () {
    let admins = [Utils.user1, Utils.user2];
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user2, Utils.worldName);

    let result = await Utils.teachContract.connect(Utils.operator).getClassroomAdmins();
    assert.equal(2, result.length);
    for (let i = 0; i < result.length; i++) {
      assert.equal(true, result[i].worlds.indexOf(Utils.worldName) != -1);
      assert.equal(0, result[i].landIds);
      assert.equal(admins[i].address, result[i].walletAddress);
    }
  });

  it("Can get all classroom admins", async function () {
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user3, Utils.worldName);
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user4, Utils.worldName);

    let result = await Utils.teachContract.connect(Utils.operator).getClassroomAdmins();
    assert.equal(2, result.length);
    let classroomAdmin1 = result[0];
    let classroomAdmin2 = result[1];

    assert.equal(Utils.user3.address, classroomAdmin1.walletAddress);
    assert.equal(Utils.user4.address, classroomAdmin2.walletAddress);

    assert.equal(true, classroomAdmin1.worlds.indexOf(Utils.worldName) != -1);
    assert.equal([].toString(), classroomAdmin1.landIds.toString());

    assert.equal(true, classroomAdmin2.worlds.indexOf(Utils.worldName) != -1);
    assert.equal([].toString(), classroomAdmin2.landIds.toString());
  });

  it("Can get single world classroom admin", async function () {
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user2, Utils.worldName);

    let classroomAdmin1 = await Utils.teachContract.connect(Utils.worldOwner).getClassroomAdmin(Utils.user1.address);
    assert.equal(true, classroomAdmin1.worlds.indexOf(Utils.worldName) != -1);
    assert.equal(0, classroomAdmin1.landIds);
  });


  it("Can delete world classroom admin", async function () {
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    let result = await Utils.teachContract.connect(Utils.worldOwner).getClassroomAdmins();
    assert.equal(1, result.length);
    await Utils.teachContract.connect(Utils.worldOwner).deleteClassroomAdmin(Utils.user1);
    result = await Utils.teachContract.connect(Utils.worldOwner).getClassroomAdmins();
    assert.equal(result.length, 0);
  });

  it("Cannot delete non existing classroom admin", async function () {
    await expect(Utils.teachContract.connect(Utils.operator).deleteClassroomAdmin(Utils.user1))
      .to.be.revertedWith("Provided wallet lacks appropriate role.");
  });

  it("Cannot delete world classroom admin if you're not the world owner", async function () {

    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    let result = await Utils.teachContract.connect(Utils.worldOwner).getClassroomAdmins();
    assert.equal(1, result.length);
    await expect(Utils.teachContract.connect(Utils.owner).deleteClassroomAdmin(Utils.user1))
      .to.be.revertedWith("Caller does not have rights to remove this classroom admin.");
    result = await Utils.teachContract.connect(Utils.owner).getClassroomAdmins();
    assert.equal(result.length, 1);
  });
});
