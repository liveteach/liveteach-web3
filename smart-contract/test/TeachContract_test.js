const { assert, expect } = require("chai");

describe("TeachContract", function () {
  let owner;
  let otherUser;
  let teachContract;

  this.beforeEach(async function () {
    teachContract = await ethers.deployContract("contracts/TeachContract.sol:TeachContract");
    let accounts = await ethers.getSigners();
    owner = accounts[0];
    otherUser = accounts[1];
  })

  // admin

  it("Only admin can call", async function () {
    let result = await teachContract.connect(owner).onlyAdminCanCall();
    assert.equal(5, result);
  });

  it("Non admin can't call", async function () {
    await teachContract.connect(owner).addStudent(otherUser);
    try {
      await teachContract.connect(otherUser).onlyAdminCanCall();
    }
    catch {
      return;
    }
    assert.fail("Calling onlyAdminCanCall as a non admin doesn't fail!");
  });

  // student

  it("Only student can call", async function () {
    await teachContract.connect(owner).addStudent(otherUser);
    let result = await teachContract.connect(otherUser).onlyStudentCanCall();
    assert.equal(1, result);
  });

  it("Non student can't call", async function () {
    await teachContract.connect(owner).addStudent(otherUser);
    try {
      await teachContract.connect(owner).onlyStudentCanCall();
    }
    catch {
      return;
    }
    assert.fail("Calling onlyStudentCanCall as a non student doesn't fail!");
  });

  // teacher
  
  it("Only teacher can call", async function () {
    await teachContract.connect(owner).addTeacher(otherUser);
    let result = await teachContract.connect(otherUser).onlyTeacherCanCall();
    assert.equal(2, result);
  });

  it("Non teacher can't call", async function () {
    await teachContract.connect(owner).addClassroomAdmin(otherUser);
    try {
      await teachContract.connect(otherUser).onlyTeacherCanCall();
    }
    catch {
      return;
    }
    assert.fail("Calling onlyTeacherCanCall as a non teacher doesn't fail!");
  });

  // classroom admin

  it("Only classroom admin can call", async function () {
    await teachContract.connect(owner).addClassroomAdmin(otherUser);
    let result = await teachContract.connect(otherUser).onlyClassroomAdminCanCall();
    assert.equal(3, result);
  });

  it("Non classroom admin can't call", async function () {
    await teachContract.connect(owner).addLandOperator(otherUser);
    try {
      await teachContract.connect(otherUser).onlyClassroomAdminCanCall();
    }
    catch {
      return;
    }
    assert.fail("Calling onlyClassroomAdminCanCall as a non classroom admin doesn't fail!");
  });

  // land operator

  it("Only land operator can call", async function () {
    await teachContract.connect(owner).addLandOperator(otherUser);
    let result = await teachContract.connect(otherUser).onlyLandOperatorCanCall();
    assert.equal(4, result);
  });

  it("Non land operator can't call", async function () {
    try {
      await teachContract.connect(owner).onlyLandOperatorCanCall();
    }
    catch {
      return;
    }
    assert.fail("Calling onlyLandOperatorCanCall as a non land operator doesn't fail!");
  });
});
