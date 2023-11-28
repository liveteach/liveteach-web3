const { assert, expect } = require("chai");
const Utils = require("./LiveTeachUtils");

describe("LiveTeachContractRoles", function () {
  this.beforeEach(async function () {
    await Utils.init();

    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom 1", [1], Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [1]);
  })

  it("Registered classroom admin should be able to get correct roles", async function () {
    let roles = await Utils.teachContract.connect(Utils.user1).getRoles();
    assert.equal(true, roles.classroomAdmin);
    assert.equal(false, roles.teacher);
  });

  it("Registered Utils.user2 should be able to get correct roles", async function () {
    let roles = await Utils.teachContract.connect(Utils.user2).getRoles();
    assert.equal(false, roles.classroomAdmin);
    assert.equal(true, roles.teacher);
  });

  it("Non registered user should be able to get correct roles", async function () {
    let roles = await Utils.teachContract.connect(Utils.user3).getRoles();
    assert.equal(false, roles.classroomAdmin);
    assert.equal(false, roles.teacher);
  });
});
