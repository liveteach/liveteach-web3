const { assert, expect } = require("chai");
const Utils = require("./LiveTeachUtils");

describe("LiveTeachContractClassroomAdmin", function () {

  this.beforeEach(async function () {
    await Utils.init();
  })

  // classroom admin
  it("Can create classroom admin", async function () {
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    result = await Utils.teachContract.connect(Utils.owner).getClassroomAdmin(Utils.user1);
    assert.equal(4, result.landCoordinates.length);
  });

  it("Can create a classroom admin with already assigned land ids.", async function () {
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user2, [4, 5]);
    let result = await Utils.teachContract.connect(Utils.owner).getClassroomAdmin(Utils.user2);
    assert.equal(2, result.landCoordinates.length);
  });

  it("Cannot create a double classroom admin", async function () {
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    await expect(Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [4, 5]))
      .to.be.revertedWith("Provided wallet already has role: CLASSROOM_ADMIN");
  });

  it("Can get all classroom admins", async function () {
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user2, [5, 6]);

    let result = await Utils.teachContract.connect(Utils.operator).getClassroomAdmins();
    assert.equal(2, result.length);
    let classroomAdmin1 = result[0];
    let classroomAdmin2 = result[1];

    assert.equal(Utils.user1.address, classroomAdmin1.walletAddress);
    assert.equal(Utils.user2.address, classroomAdmin2.walletAddress);

    assert.equal([1n, 2n, 3n, 4n].toString(), classroomAdmin1.landIds);
    assert.equal([5n, 6n].toString(), classroomAdmin2.landIds);
  });

  it("Can get single classroom admin", async function () {
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user2, [5, 6]);

    let classroomAdmin1 = await Utils.teachContract.connect(Utils.owner).getClassroomAdmin(Utils.user1.address);

    assert.equal(Utils.user1.address, classroomAdmin1.walletAddress);
    assert.equal([1n, 2n, 3n, 4n].toString(), classroomAdmin1.landIds);
  });

  it("Can delete classroom admin", async function () {
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    let result = await Utils.teachContract.connect(Utils.owner).getClassroomAdmins();
    assert.equal(1, result.length);
    await Utils.teachContract.connect(Utils.operator).deleteClassroomAdmin(Utils.user1);
    result = await Utils.teachContract.connect(Utils.owner).getClassroomAdmins();
    assert.equal(result.length, 0);
  });

  it("Cannot delete non existing classroom admin", async function () {
    await expect(Utils.teachContract.connect(Utils.operator).deleteClassroomAdmin(Utils.user1))
      .to.be.revertedWith("Provided wallet lacks appropriate role.");
  });

  it("Cannot delete classroom admin if you're not the landoperator", async function () {
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    let result = await Utils.teachContract.connect(Utils.owner).getClassroomAdmins();
    assert.equal(1, result.length);
    await expect(Utils.teachContract.connect(Utils.owner).deleteClassroomAdmin(Utils.user1))
      .to.be.revertedWith("Parcel 1 expected operator: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 but was: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8\n" +
      "Parcel 2 expected operator: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 but was: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8\n" +
      "Parcel 3 expected operator: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 but was: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8\n" +
      "Parcel 4 expected operator: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 but was: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8\n");
    result = await Utils.teachContract.connect(Utils.owner).getClassroomAdmins();
    assert.equal(result.length, 1);
  });
});
