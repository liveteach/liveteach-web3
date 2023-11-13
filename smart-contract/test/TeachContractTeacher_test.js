const { assert, expect } = require("chai");

describe("TeachContractTeacher", function () {
  let owner;
  let otherUser;
  let teachContract;
  let randomWallet = "0xAA14f5F645273Aa6411995Bf8F02557B7C74a154";
  let operator;
  let landContract;
  this.beforeEach(async function () {
    teachContract = await ethers.deployContract("contracts/TeachContract.sol:TeachContract");
    let accounts = await ethers.getSigners();
    owner = accounts[0];
    otherUser = accounts[1];
    otherUser2 = accounts[2];
    otherUser3 = accounts[3];
    operator = accounts[4];

    landContract = await ethers.deployContract("contracts/references/LANDRegistry.sol:LANDRegistry");
    let landContractAddress = await landContract.target;
    await teachContract.connect(owner).setLANDRegistry(landContractAddress);

    await landContract.connect(owner).assignMultipleParcels([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 1], owner);
    for (let i = 1; i < 22; i++) {
      await landContract.connect(owner).approve(operator, i);
    }
    await landContract.connect(owner).approve(operator, 340282366920938463463374607431768211457n);

  })

  // create
  it("Classroom admin can create teacher", async function () {
    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1, 2, 3, 4], getGuid());
    await teachContract.connect(otherUser).createTeacher(otherUser3, [1]);

    let teacher = await teachContract.connect(otherUser).getTeacher(otherUser3);
    assert.equal(otherUser3.address, teacher.walletAddress);
    assert.equal([1n].toString(), teacher.classroomIds.toString());
  });

  it("Non classroom admin cannot create teacher", async function () {

    await expect(teachContract.connect(otherUser).createTeacher(randomWallet, [1]))
      .to.be.revertedWith(
        "You lack the appropriate role to call this function: CLASSROOM_ADMIN"
      );
  });

  it("Classroom admin cannot create a a teacher for a classroom that doesn't belong to them", async function () {

    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(operator).createClassroomAdmin(otherUser2, [5, 6]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1, 2, 3, 4], getGuid());

    await expect(teachContract.connect(otherUser2).createTeacher(randomWallet, [1]))
      .to.be.revertedWith("Provided id invalid.");
    await expect(teachContract.connect(otherUser).getTeacher(randomWallet))
      .to.be.revertedWith("Object doesn't exist or you don't have access to it.");
    await expect(teachContract.connect(otherUser2).getTeacher(randomWallet))
      .to.be.revertedWith("Object doesn't exist or you don't have access to it.");
    let teachers = await teachContract.connect(otherUser).getTeachers();
    assert.equal(0, teachers.length);
    teachers = await teachContract.connect(otherUser2).getTeachers();
    assert.equal(0, teachers.length);
  });

  // // read
  it("Classroom admin can get data about all their teachers", async function () {

    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1, 2, 3, 4], getGuid());
    await teachContract.connect(otherUser).createTeacher(randomWallet, [1]);
    await teachContract.connect(otherUser).createTeacher(otherUser2.address, [1]);

    let teachers = await teachContract.connect(otherUser).getTeachers();
    assert.equal(2, teachers.length);

    assert.equal(randomWallet, teachers[0].walletAddress);
    assert.equal(otherUser2.address, teachers[1].walletAddress);

    assert.equal([1n].toString(), teachers[0].classroomIds.toString());
    assert.equal([1n].toString(), teachers[1].classroomIds.toString());
  });

  it("Non classroom admin cannot get data about a classroom admins teachers", async function () {

    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1, 2, 3, 4], getGuid());
    await teachContract.connect(otherUser).createTeacher(randomWallet, [1]);
    await teachContract.connect(otherUser).createTeacher(otherUser2.address, [1]);

    await expect(teachContract.connect(otherUser2).getTeachers())
      .to.be.revertedWith(
        "You lack the appropriate role to call this function: CLASSROOM_ADMIN"
      );
  });

  it("Classroom admin cannot get data about another classroom admin's teachers", async function () {

    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(operator).createClassroomAdmin(otherUser2, [5, 6]);

    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1, 2, 3, 4], getGuid());
    await teachContract.connect(otherUser).createTeacher(randomWallet, [1]);
    let result = await teachContract.connect(otherUser2).getTeachers();
    assert.equal(0, result.length);
  });

  it("Classroom admin can get data about a single one of their teachers", async function () {
    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1, 2, 3, 4], getGuid());
    await teachContract.connect(otherUser).createTeacher(randomWallet, [1]);
    await teachContract.connect(otherUser).createTeacher(otherUser2.address, [1]);

    let teacher = await teachContract.connect(otherUser).getTeacher(randomWallet);
    assert.equal(randomWallet, teacher.walletAddress);
    assert.equal([1n].toString(), teacher.classroomIds.toString());
  });

  it("Non classroom admin cannot get data about a classroom admins single teacher", async function () {

    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1, 2, 3, 4], getGuid());
    await teachContract.connect(otherUser).createTeacher(randomWallet, [1]);
    await teachContract.connect(otherUser).createTeacher(otherUser2.address, [1]);

    await expect(teachContract.connect(otherUser2).getTeacher(randomWallet))
      .to.be.revertedWith(
        "Object doesn't exist or you don't have access to it."
      );
  });

  
  it("Teacher can get data themselves", async function () {

    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1, 2, 3, 4], getGuid());
    await teachContract.connect(otherUser).createTeacher(otherUser3, [1]);

    let teacher = await teachContract.connect(otherUser3).getTeacher(otherUser3.address);

    assert.equal(otherUser3.address, teacher.walletAddress);
    assert.equal([1n].toString(), teacher.classroomIds.toString());
    assert.equal([otherUser.address].toString(), teacher.classroomAdminIds.toString());

  });

  it("Classroom admin cannot get data about another classroom admin's single teacher", async function () {

    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(operator).createClassroomAdmin(otherUser2, [5, 6]);

    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1, 2, 3, 4], getGuid());
    await teachContract.connect(otherUser).createTeacher(randomWallet, [1]);
    await expect(teachContract.connect(otherUser2).getTeacher(randomWallet))
      .to.be.revertedWith("Object doesn't exist or you don't have access to it.");
  });

  it("Teacher can get data about a single one of their classrooms", async function () {

    let guid = getGuid();
    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2, 3, 4]);

    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1], guid);
    await teachContract.connect(otherUser).createTeacher(otherUser3, [1]);
    let classroom = await teachContract.connect(otherUser3).getClassroom(1);
    assert.equal("Test Classroom", classroom.name);
    assert.equal([1n].toString(), classroom.landIds);
    assert.equal([[0,1]].toString(), classroom.landCoordinates);
    assert.equal([otherUser3.address].toString(), classroom.teacherIds);
  });

  // // delete
  it("Classroom admin can delete their own teachers", async function () {

    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1], getGuid());

    await teachContract.connect(otherUser).createTeacher(otherUser2, [1]);
    await teachContract.connect(otherUser).createTeacher(randomWallet, [1]);

    await teachContract.connect(otherUser).deleteTeacher(randomWallet);
    let result = await teachContract.connect(otherUser).getTeachers();

    assert.equal(1, result.length);
    let teacher = result[0];
    assert.equal(otherUser2.address, teacher.walletAddress);
    assert.equal([1n].toString(), teacher.classroomIds.toString());
    assert.equal(otherUser.address, teacher.classroomAdminIds[0]);
  });

  it("Non classroom admin cannot delete teachers", async function () {
    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1], getGuid());

    await teachContract.connect(otherUser).createTeacher(otherUser2, [1]);

    await expect(teachContract.connect(otherUser2).deleteTeacher(otherUser2))
      .to.be.revertedWith("You lack the appropriate role to call this function: CLASSROOM_ADMIN");

  });

  it("Classroom admin cannot delete a teacher that doesn't belong to them", async function () {

    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(operator).createClassroomAdmin(otherUser2, [5, 6]);

    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1], getGuid());

    await teachContract.connect(otherUser).createTeacher(otherUser2, [1]);
    await teachContract.connect(otherUser).createTeacher(randomWallet, [1]);

    await expect(teachContract.connect(otherUser2).deleteTeacher(otherUser2))
      .to.be.revertedWith("Object doesn't exist or you don't have access to it.");
  });

  it("Teacher can get their classroom guid", async function () {
    let guid =  getGuid();
    await teachContract.connect(operator).createClassroomAdmin(otherUser, [340282366920938463463374607431768211457n]); // 1,1
    await teachContract.connect(otherUser).createClassroomCoordinates("Test Classroom", [[1,1]], guid);
    await teachContract.connect(otherUser).createTeacher(otherUser2, [1]);
    let response = await teachContract.connect(otherUser2).getClassroomGuid(1,1);
    assert.equal(guid, response);

  });

});

function getGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}