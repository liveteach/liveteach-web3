const { assert, expect } = require("chai");

describe("TeachContractDeleteCascade", function () {
  let owner;
  let CA0;
  let CA1;
  let T0;
  let T1;
  let T2;
  let T3;
  let T4;
  let T6;
  let T7;
  let T8;
  let T10;
  let teachContract;
  this.beforeEach(async function () {
    teachContract = await ethers.deployContract("contracts/TeachContract.sol:TeachContract");
    let accounts = await ethers.getSigners();
    owner = accounts[0];
    CA0 = accounts[1];
    CA1 = accounts[2];
    T0 = accounts[3];
    T1 = accounts[4];
    T2 = accounts[5];
    T3 = accounts[6];
    T4 = accounts[7];
    T6 = accounts[9];
    T7 = accounts[10];
    T8 = accounts[11];
    T10 = accounts[13];
    let landContract = await ethers.deployContract("contracts/references/LANDRegistry.sol:LANDRegistry");
    let landContractAddress = await landContract.target;
    await teachContract.connect(owner).setLANDRegistry(landContractAddress);
    await teachContract.connect(owner).createClassroomAdmin(CA0, [1, 2, 3, 4]);
    await teachContract.connect(owner).createClassroomAdmin(CA1, [5, 6, 7]);
    await teachContract.connect(CA0).createClassroomLandIds("CR0", [1], getGuid());
    await teachContract.connect(CA0).createClassroomLandIds("CR1", [2], getGuid());
    await teachContract.connect(CA0).createClassroomLandIds("CR2", [3], getGuid());
    await teachContract.connect(CA1).createClassroomLandIds("CR3", [5, 6], getGuid());

    await teachContract.connect(CA0).createTeacher(T0, [1]);
    await teachContract.connect(CA0).createTeacher(T1, [1]);
    await teachContract.connect(CA0).createTeacher(T2, [1]);

    await teachContract.connect(CA0).createTeacher(T3, [2]);
    await teachContract.connect(CA0).createTeacher(T4, [2]);
    await teachContract.connect(CA0).createTeacher(T6, [3, 2]);

    await teachContract.connect(CA0).createTeacher(T7, [3]);
    await teachContract.connect(CA0).createTeacher(T8, [3]);

    await teachContract.connect(CA1).createTeacher(T10, [4]);

  })

  /*
  TEST DATA
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │     Classroom Admin       Classroom      Teacher                            │
 │                                                                             │
 │                                                                             │
 │                                                                             │
 │     CA0                   CR0            T0                                 │
 │                                                                             │
 │                                          T1                                 │
 │                                                                             │
 │                                          T2                                 │
 │                                                                             │
 │                                                                             │
 │                                                                             │
 │                           CR1            T3                                 │
 │                                                                             │
 │                                          T4                                 │
 │                                                                             │
 │                                          T6     T6 belongs to 2 classrooms  │
 │                                                                             │
 │                                                                             │
 │                                                                             │
 │                           CR2            T6                                 │
 │                                                                             │
 │                                          T7                                 │
 │                                                                             │
 │                                          T8                                 │
 │                                                                             │
 │                                                                             │
 │                                                                             │
 |     CA1                   CR3            T10                                │
 └─────────────────────────────────────────────────────────────────────────────┘
  */
  it("Test data looks right", async function () {
    let result = await teachContract.connect(owner).getClassroomAdmins();
    assert.equal(2, result.length);

    let resCA0 = result[0];
    let resCA1 = result[1];

    assert.equal(CA0.address, resCA0.walletAddress);
    assert.equal(4, resCA0.landIds.length);
    assert.equal(3, resCA0.classroomIds.length);
    assert.equal(8, resCA0.teacherIds.length);

    assert.equal(CA1.address, resCA1.walletAddress);
    assert.equal(3, resCA1.landIds.length);
    assert.equal(1, resCA1.classroomIds.length);
    assert.equal(1, resCA1.teacherIds.length);

    result = await teachContract.connect(CA0).getClassrooms();
    assert.equal(3, result.length);

    let resCR0 = result[0];
    let resCR1 = result[1];
    let resCR2 = result[2];

    assert.equal("CR0", resCR0.name);
    assert.equal([1n].toString(), resCR0.landIds);
    assert.equal(CA0.address, resCR0.classroomAdminId);
    assert.equal(3, resCR0.teacherIds.length);

    assert.equal("CR1", resCR1.name);
    assert.equal([2n].toString(), resCR1.landIds);
    assert.equal(CA0.address, resCR1.classroomAdminId);
    assert.equal(3, resCR1.teacherIds.length);

    assert.equal("CR2", resCR2.name);
    assert.equal([3n].toString(), resCR2.landIds);
    assert.equal(CA0.address, resCR1.classroomAdminId);
    assert.equal(3, resCR2.teacherIds.length);

    result = await teachContract.connect(CA1).getClassrooms();
    assert.equal(1, result.length);

    let resCR3 = result[0];

    assert.equal("CR3", resCR3.name);
    assert.equal([5n, 6n].toString(), resCR3.landIds);
    assert.equal(CA1.address, resCR3.classroomAdminId);
    assert.equal(1, resCR3.teacherIds.length);

    result = await teachContract.connect(CA0).getTeachers();
    assert.equal(8, result.length);

    let resT0 = result[0];
    let resT1 = result[1];
    let resT2 = result[2];
    let resT3 = result[3];
    let resT4 = result[4];
    let resT6 = result[5];
    let resT7 = result[6];
    let resT8 = result[7];

    assertTeacherLooksRight(resT0, T0, 1, CA0);
    assertTeacherLooksRight(resT1, T1, 1, CA0);
    assertTeacherLooksRight(resT2, T2, 1, CA0);
    assertTeacherLooksRight(resT3, T3, 1, CA0);
    assertTeacherLooksRight(resT4, T4, 1, CA0);
    assertTeacherLooksRight(resT6, T6, 2, CA0);
    assertTeacherLooksRight(resT7, T7, 1, CA0);
    assertTeacherLooksRight(resT8, T8, 1, CA0);

    result = await teachContract.connect(CA1).getTeachers();
    assert.equal(1, result.length);
    let resT10 = result[0];
    assertTeacherLooksRight(resT10, T10, 1, CA1);
  });

  it("Deleting a classroom admin deletes it's classrooms", async function () {
    let allClassrooms = await teachContract.connect(owner).allClassrooms();
    assert.equal(4, allClassrooms.length);
    await teachContract.connect(owner).deleteClassroomAdmin(CA0.address);
    allClassrooms = await teachContract.connect(owner).allClassrooms();
    assert.equal(1, allClassrooms.length);
  });

  it("Deleting a classroom admin deletes it's teachers", async function () {
    let allTeachers = await teachContract.connect(owner).allTeachers();
    assert.equal(9, allTeachers.length);
    await teachContract.connect(owner).deleteClassroomAdmin(CA0.address);
    allTeachers = await teachContract.connect(owner).allTeachers();
    assert.equal(1, allTeachers.length);
  });

  it("Deleting a classroom admin deletes it's lands", async function () {
    let allLands = await teachContract.connect(owner).allLands();
    assert.equal(7, allLands.length);
    await teachContract.connect(owner).deleteClassroomAdmin(CA0.address);
    allLands = await teachContract.connect(owner).allLands();
    assert.equal(3, allLands.length);
  });

  it("Deleting a classroom deletes it's teachers but not teachers assigned to other classrooms", async function () {
    let allTeachers = await teachContract.connect(owner).allTeachers();
    assert.equal(9, allTeachers.length);
    await teachContract.connect(owner).deleteClassroomAdmin(CA0.address);
    allTeachers = await teachContract.connect(owner).allTeachers();
    assert.equal(1, allTeachers.length);

    let result = await teachContract.connect(CA1).getTeachers();
    assert.equal(1, result.length);
    let resT10 = result[0];
    assertTeacherLooksRight(resT10, T10, 1, CA1);
  });
});

function assertTeacherLooksRight(teacher, expectedWallet, expectedClassroomIdsLength, expectedClassroomAdmin) {
  assert.equal(expectedWallet.address, teacher.walletAddress);
  assert.equal(expectedClassroomIdsLength, teacher.classroomIds.length);
  assert.equal(expectedClassroomAdmin.address, teacher.classroomAdminId);
}

function getGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}