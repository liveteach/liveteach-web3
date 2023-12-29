const { assert, expect } = require("chai");
const Utils = require("./LiveTeachUtils");

describe("LiveTeachWorldsContractTeacher", function () {
  this.beforeEach(async function () {
    await Utils.init();

  })

  // create
  it("Classroom admin can create teacher", async function () {
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom", Utils.worldName, Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user4, [100001]);

    let teacher = await Utils.teachContract.connect(Utils.user1).getTeacher(Utils.user4);
    assert.equal(Utils.user4.address, teacher.walletAddress);
    assert.equal([100001].toString(), teacher.classroomIds.toString());
  });

  it("Non classroom admin cannot create teacher", async function () {

    await expect(Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [1]))
      .to.be.revertedWith(
        "You " + Utils.user1.address.toLowerCase() + " lack the appropriate role to call this function: CLASSROOM_ADMIN"
      );
  });

  it("Classroom admin cannot create a a teacher for a classroom that doesn't belong to them", async function () {
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user3, Utils.worldName2);
    await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom", Utils.worldName, Utils.getGuid());

    await expect(Utils.teachContract.connect(Utils.user3).createTeacher(Utils.user2, [100001]))
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
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom", Utils.worldName, Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [100001]);
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user3, [100001]);

    let teachers = await Utils.teachContract.connect(Utils.user1).getTeachers();
    assert.equal(2, teachers.length);

    assert.equal(Utils.user2.address, teachers[0].walletAddress);
    assert.equal(Utils.user3.address, teachers[1].walletAddress);

    assert.equal([100001].toString(), teachers[0].classroomIds.toString());
    assert.equal([100001].toString(), teachers[1].classroomIds.toString());
  });

  it("Non classroom admin cannot get data about a classroom admins teachers", async function () {
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom", Utils.worldName, Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [100001]);
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user3, [100001]);

    await expect(Utils.teachContract.connect(Utils.user3).getTeachers())
      .to.be.revertedWith(
        "You " + Utils.user3.address.toLowerCase() + " lack the appropriate role to call this function: CLASSROOM_ADMIN"
      );
  });

  it("Classroom admin cannot get data about another classroom admin's teachers", async function () {
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user3, Utils.worldName2);
    await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom", Utils.worldName, Utils.getGuid());

    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [100001]);
    let result = await Utils.teachContract.connect(Utils.user3).getTeachers();
    assert.equal(0, result.length);
  });

  it("Classroom admin can get data about a single one of their teachers", async function () {
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom", Utils.worldName, Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [100001]);
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user3, [100001]);

    let teacher = await Utils.teachContract.connect(Utils.user1).getTeacher(Utils.user2);
    assert.equal(Utils.user2.address, teacher.walletAddress);
    assert.equal([100001].toString(), teacher.classroomIds.toString());
  });

  it("Non classroom admin cannot get data about a classroom admins single teacher", async function () {
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom", Utils.worldName, Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [100001]);
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user3, [100001]);

    await expect(Utils.teachContract.connect(Utils.user3).getTeacher(Utils.user2))
      .to.be.revertedWith(
        "Object doesn't exist or you don't have access to it."
      );
  });

  it("Teacher can get data about themselves", async function () {
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom", Utils.worldName, Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user4, [100001]);

    let teacher = await Utils.teachContract.connect(Utils.user4).getTeacher(Utils.user4.address);

    assert.equal(Utils.user4.address, teacher.walletAddress);
    assert.equal([100001].toString(), teacher.classroomIds.toString());
    assert.equal([Utils.user1.address].toString(), teacher.classroomAdminIds.toString());
  });

  it("Classroom admin cannot get data about another classroom admin's single teacher", async function () {
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user3, Utils.worldName2);
    await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom", Utils.worldName, Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [100001]);

    await expect(Utils.teachContract.connect(Utils.user3).getTeacher(Utils.user2))
      .to.be.revertedWith("Object doesn't exist or you don't have access to it.");
  });

  it("Teacher can get data about a single one of their classrooms", async function () {

    let guid = Utils.getGuid();
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom", Utils.worldName, guid);
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user4, [100001]);

    let classroom = await Utils.teachContract.connect(Utils.user4).getClassroom(100001);
    assert.equal("Test Classroom", classroom.name);
    assert.equal([].toString(), classroom.landIds);
    assert.equal([].toString(), classroom.landCoordinates);
    assert.equal([Utils.user4.address].toString(), classroom.teacherIds);
  });

  // // delete
  it("Classroom admin can delete their own teachers", async function () {
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom", Utils.worldName, Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user3, [100001]);
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [100001]);

    await Utils.teachContract.connect(Utils.user1).deleteTeacher(Utils.user2);
    let result = await Utils.teachContract.connect(Utils.user1).getTeachers();

    assert.equal(1, result.length);
    let teacher = result[0];
    assert.equal(Utils.user3.address, teacher.walletAddress);
    assert.equal([100001].toString(), teacher.classroomIds.toString());
    assert.equal(Utils.user1.address, teacher.classroomAdminIds[0]);
  });

  it("Non classroom admin cannot delete teachers", async function () {
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom", Utils.worldName, Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user3, [100001]);

    await expect(Utils.teachContract.connect(Utils.user3).deleteTeacher(Utils.user3))
      .to.be.revertedWith(
        "You " + Utils.user3.address.toLowerCase() + " lack the appropriate role to call this function: CLASSROOM_ADMIN"
      );

  });

  it("Classroom admin cannot delete a teacher that doesn't belong to them", async function () {

    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user3, Utils.worldName2);
    await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom", Utils.worldName, Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user3, [100001]);
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [100001]);

    await expect(Utils.teachContract.connect(Utils.user3).deleteTeacher(Utils.user3))
      .to.be.revertedWith("Object doesn't exist or you don't have access to it.");
  });

  it("Teacher can get their classroom guid", async function () {
    let guid = Utils.getGuid();
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom", Utils.worldName, guid);
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user3, [100001]);

    let response = await Utils.teachContract.connect(Utils.user3).getClassroomGuid(Utils.worldName);
    assert.equal(guid, response);

  });

});
