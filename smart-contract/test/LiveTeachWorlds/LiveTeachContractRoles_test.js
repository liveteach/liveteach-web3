const { assert, expect } = require("chai");
const Utils = require("./LiveTeachUtils");

describe("LiveTeachWorldsContractRoles", function () {
  this.beforeEach(async function () {
    await Utils.init();
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, [Utils.worldName]);
    await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom", Utils.worldName, Utils.getGuid());

    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [100001]);
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
