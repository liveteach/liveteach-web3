const { assert, expect } = require("chai");
const Utils = require("./LiveTeachUtils");

describe("LiveTeachContractTeacher", function () {
  this.beforeEach(async function () {
    await Utils.init();

  })

  // create
  it("Classroom admin can create teacher", async function () {
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom", [1, 2, 3, 4], Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user4, [1]);

    let teacher = await Utils.teachContract.connect(Utils.user1).getTeacher(Utils.user4);
    assert.equal(Utils.user4.address, teacher.walletAddress);
    assert.equal([1n].toString(), teacher.classroomIds.toString());
  });

  it("Non classroom admin cannot create teacher", async function () {

    await expect(Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [1]))
      .to.be.revertedWith(
        "You " + Utils.user1.address.toLowerCase() + " lack the appropriate role to call this function: CLASSROOM_ADMIN"
      );
  });

  it("Classroom admin cannot create a a teacher for a classroom that doesn't belong to them", async function () {

    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user3, [5, 6]);
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom", [1, 2, 3, 4], Utils.getGuid());

    await expect(Utils.teachContract.connect(Utils.user3).createTeacher(Utils.user2, [1]))
      .to.be.revertedWith("Provided id invalid.");
    await expect(Utils.teachContract.connect(Utils.user1).getTeacher(Utils.user2))
      .to.be.revertedWith("Object doesn't exist or you don't have access to it.");
    await expect(Utils.teachContract.connect(Utils.user3).getTeacher(Utils.user2))
      .to.be.revertedWith("Object doesn't exist or you don't have access to it.");
    let teachers = await Utils.teachContract.connect(Utils.user1).getTeachers();
    assert.equal(0, teachers.length);
    teachers = await Utils.teachContract.connect(Utils.user3).getTeachers();
    assert.equal(0, teachers.length);
  });

  // // read
  it("Classroom admin can get data about all their teachers", async function () {

    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom", [1, 2, 3, 4], Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [1]);
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user3.address, [1]);

    let teachers = await Utils.teachContract.connect(Utils.user1).getTeachers();
    assert.equal(2, teachers.length);

    assert.equal(Utils.user2.address, teachers[0].walletAddress);
    assert.equal(Utils.user3.address, teachers[1].walletAddress);

    assert.equal([1n].toString(), teachers[0].classroomIds.toString());
    assert.equal([1n].toString(), teachers[1].classroomIds.toString());
  });

  it("Non classroom admin cannot get data about a classroom admins teachers", async function () {

    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom", [1, 2, 3, 4], Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [1]);
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user3.address, [1]);

    await expect(Utils.teachContract.connect(Utils.user3).getTeachers())
      .to.be.revertedWith(
        "You " + Utils.user3.address.toLowerCase() + " lack the appropriate role to call this function: CLASSROOM_ADMIN"
      );
  });

  it("Classroom admin cannot get data about another classroom admin's teachers", async function () {

    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user3, [5, 6]);

    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom", [1, 2, 3, 4], Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [1]);
    let result = await Utils.teachContract.connect(Utils.user3).getTeachers();
    assert.equal(0, result.length);
  });

  it("Classroom admin can get data about a single one of their teachers", async function () {
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom", [1, 2, 3, 4], Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [1]);
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user3.address, [1]);

    let teacher = await Utils.teachContract.connect(Utils.user1).getTeacher(Utils.user2);
    assert.equal(Utils.user2.address, teacher.walletAddress);
    assert.equal([1n].toString(), teacher.classroomIds.toString());
  });

  it("Non classroom admin cannot get data about a classroom admins single teacher", async function () {

    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom", [1, 2, 3, 4], Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [1]);
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user3.address, [1]);

    await expect(Utils.teachContract.connect(Utils.user3).getTeacher(Utils.user2))
      .to.be.revertedWith(
        "Object doesn't exist or you don't have access to it."
      );
  });


  it("Teacher can get data about themselves", async function () {

    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom", [1, 2, 3, 4], Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user4, [1]);

    let teacher = await Utils.teachContract.connect(Utils.user4).getTeacher(Utils.user4.address);

    assert.equal(Utils.user4.address, teacher.walletAddress);
    assert.equal([1n].toString(), teacher.classroomIds.toString());
    assert.equal([Utils.user1.address].toString(), teacher.classroomAdminIds.toString());

  });

  it("Classroom admin cannot get data about another classroom admin's single teacher", async function () {

    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user3, [5, 6]);

    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom", [1, 2, 3, 4], Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [1]);
    await expect(Utils.teachContract.connect(Utils.user3).getTeacher(Utils.user2))
      .to.be.revertedWith("Object doesn't exist or you don't have access to it.");
  });

  it("Teacher can get data about a single one of their classrooms", async function () {

    let guid = Utils.getGuid();
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);

    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom", [1], guid);
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user4, [1]);
    let classroom = await Utils.teachContract.connect(Utils.user4).getClassroom(1);
    assert.equal("Test Classroom", classroom.name);
    assert.equal([1n].toString(), classroom.landIds);
    assert.equal([[0,1]].toString(), classroom.landCoordinates);
    assert.equal([Utils.user4.address].toString(), classroom.teacherIds);
  });

  // // delete
  it("Classroom admin can delete their own teachers", async function () {

    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom", [1], Utils.getGuid());

    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user3, [1]);
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [1]);

    await Utils.teachContract.connect(Utils.user1).deleteTeacher(Utils.user2);
    let result = await Utils.teachContract.connect(Utils.user1).getTeachers();

    assert.equal(1, result.length);
    let teacher = result[0];
    assert.equal(Utils.user3.address, teacher.walletAddress);
    assert.equal([1n].toString(), teacher.classroomIds.toString());
    assert.equal(Utils.user1.address, teacher.classroomAdminIds[0]);
  });

  it("Non classroom admin cannot delete teachers", async function () {
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom", [1], Utils.getGuid());

    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user3, [1]);

    await expect(Utils.teachContract.connect(Utils.user3).deleteTeacher(Utils.user3))
      .to.be.revertedWith(
        "You " + Utils.user3.address.toLowerCase() + " lack the appropriate role to call this function: CLASSROOM_ADMIN"
        );

  });

  it("Classroom admin cannot delete a teacher that doesn't belong to them", async function () {

    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user3, [5, 6]);

    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom", [1], Utils.getGuid());

    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user3, [1]);
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [1]);

    await expect(Utils.teachContract.connect(Utils.user3).deleteTeacher(Utils.user3))
      .to.be.revertedWith("Object doesn't exist or you don't have access to it.");
  });

  it("Teacher can get their classroom guid", async function () {
    let guid =  Utils.getGuid();
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [340282366920938463463374607431768211457n]); // 1,1
    await Utils.teachContract.connect(Utils.user1).createClassroomCoordinates("Test Classroom", [[1,1]], guid);
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user3, [1]);
    let response = await Utils.teachContract.connect(Utils.user3).getClassroomGuid(1,1);
    assert.equal(guid, response);

  });

  it("Teacher can get their classroom guid 2", async function () {
    let guid = Utils.getGuid();
    let coordinatePairs = [[-55, 1], [-55, 2], [-55, 3]];
    let landIds = await Utils.teachContract.connect(Utils.operator).getLandIdsFromCoordinates(coordinatePairs);
    landIds = Array.from(landIds); // Array.from is important here as the contract returns an object
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, landIds);
    await Utils.teachContract.connect(Utils.user1).createClassroomCoordinates("Test Classroom", coordinatePairs, guid);
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user3, [1]);
    let response = await Utils.teachContract.connect(Utils.user3).getClassroomGuid(-55,1);
    assert.equal(guid, response);

  });
});
