const { assert, expect } = require("chai");

describe("TeachContractRoles", function () {
  let owner;
  let classroomAdmin;
  let teacher;
  let nonRegisteredUser;
  let teachContract;

  this.beforeEach(async function () {
    teachContract = await ethers.deployContract("contracts/TeachContract.sol:TeachContract");
    let accounts = await ethers.getSigners();
    owner = accounts[0];
    await teachContract.connect(owner).initialize();
    classroomAdmin = accounts[1];
    teacher = accounts[2];
    nonRegisteredUser = accounts[3];
    let landContract = await ethers.deployContract("contracts/references/LANDRegistry.sol:LANDRegistry");
    let landContractAddress = await landContract.target;
    teachContract.connect(owner).setLANDRegistry(landContractAddress);
    await teachContract.connect(owner).createClassroomAdmin(classroomAdmin, [1, 2, 3, 4]);
    await teachContract.connect(classroomAdmin).createClassroomLandIds("Test Classroom 1", [1], getGuid());
    await teachContract.connect(classroomAdmin).createTeacher(teacher, [1]);
  })

  // it("Registered land operator should be able to get correct roles", async function () {
  // let roles = await teachContract.connect(landOperator).getRoles();
  // assert.equal(false, roles.classroomAdmin);
  // assert.equal(false, roles.student);
  // assert.equal(false, roles.teacher);
  // assert.equal(true, roles.landOperator);
  // });

  it("Registered classroom admin should be able to get correct roles", async function () {
    let roles = await teachContract.connect(classroomAdmin).getRoles();
    assert.equal(true, roles.classroomAdmin);
    assert.equal(false, roles.student);
    assert.equal(false, roles.teacher);
    assert.equal(false, roles.landOperator);
  });

  it("Registered teacher should be able to get correct roles", async function () {
    let roles = await teachContract.connect(teacher).getRoles();
    assert.equal(false, roles.classroomAdmin);
    assert.equal(false, roles.student);
    assert.equal(true, roles.teacher);
    assert.equal(false, roles.landOperator);

  });

  it("Non registered user should be able to get correct roles", async function () {
    let roles = await teachContract.connect(nonRegisteredUser).getRoles();
    assert.equal(false, roles.classroomAdmin);
    assert.equal(false, roles.student);
    assert.equal(false, roles.teacher);
    assert.equal(false, roles.landOperator);
  });

});

function getGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}