const { assert, expect } = require("chai");
const Utils = require("./LiveTeachUtils");

describe("LiveTeachWorldsContractClassroom", function () {

  this.beforeEach(async function () {
    await Utils.init();
  })

  // create

  it("World classroom admin can create classroom", async function () {
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom", Utils.worldName, Utils.getGuid());

    let classrooms = await Utils.teachContract.connect(Utils.user1).getClassrooms();
    assert.equal(1, classrooms.length);
    let classroom = classrooms[0];
    assert.equal("Test Classroom", classroom.name);
    assert.equal([].toString(), classroom.landIds.toString());
    assert.equal(Utils.worldName, classroom.world);
  });

  it("World classroom admin cannot create classroom with unregistered world", async function () {
    let fakeWorld = "nopeland";
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    await expect(Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom", fakeWorld, Utils.getGuid()))
      .to.be.revertedWith("You are not authorised to use world: " + fakeWorld + " only " + Utils.worldName);
  });


  it("Classrooms have unique ids", async function () {
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    for (let i = 0; i < 20; i++) {
      await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom", Utils.worldName, Utils.getGuid());
    }

    let classrooms = await Utils.teachContract.connect(Utils.user1).getClassrooms();
    assert.equal(20, classrooms.length);

    for (let i = 0; i < classrooms.length; i++) {
      let classroom = classrooms[i];
      assert.equal(100001 + i, classroom.id);
    }

  });


  // // read
  it("Classroom admin can get data about all their classrooms", async function () {
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);

    await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom 1", Utils.worldName, Utils.getGuid());

    let result = await Utils.teachContract.connect(Utils.user1).getClassrooms();
    assert.equal(1, result.length);

    let testClassroom1 = result[0];
    assert.equal("Test Classroom 1", testClassroom1.name);
    assert.equal(0, testClassroom1.landIds.length);
    assert.equal(Utils.worldName, testClassroom1.world);
  });


  it("World classroom admin can get data about a single one of their classrooms", async function () {
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom 1", Utils.worldName, Utils.getGuid());
    let result = await Utils.teachContract.connect(Utils.user1).getClassroom(100001);
    assert.equal(Utils.worldName, result.world);
    assert.equal("Test Classroom 1", result.name);
    assert.equal(0, result.landIds);
  });

  // delete
  it("World classroom admin can delete their own classroom", async function () {
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom 1", Utils.worldName, Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).deleteClassroom(100001);
    let allClassrooms = await Utils.teachContract.connect(Utils.user1).getClassrooms();
    assert.equal(0, allClassrooms.length);
    await expect(Utils.teachContract.connect(Utils.user1).getClassroom(1)).to.be.revertedWith("Object doesn't exist or you don't have access to it.");
  });

  it("World classroom admin cannot delete a classroom that doesn't belong to them", async function () {
    let world2 = "dollywood";
    await Utils.dclRegistrarContract.connect(Utils.owner).setOwnerOf(world2, Utils.user2);

    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    await Utils.teachContract.connect(Utils.user2).createClassroomAdmin(Utils.user3, world2);

    await Utils.teachContract.connect(Utils.user3).createClassroom("Test Classroom 1", world2, Utils.getGuid());

    await expect(Utils.teachContract.connect(Utils.user1).deleteClassroom(100001))
      .to.be.revertedWith("Object doesn't exist or you don't have access to it.");
    let allClassrooms = await Utils.teachContract.connect(Utils.user3).getClassrooms();
    assert.equal(1, allClassrooms.length);
  });

  it("World teacher can get GUID from their own classroom", async function () {
    let guid = Utils.getGuid();
    let result;
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom 1", Utils.worldName, guid);
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [100001]);
    result = await Utils.teachContract.connect(Utils.user2).getClassroomGuid(Utils.worldName);
    assert.equal(guid, result);
  });

  it("World teacher cannot get GUID from anothers classroom", async function () {
    let guid = Utils.getGuid();
    let result;
    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, Utils.worldName);
    await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom 1", Utils.worldName, guid);
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [100001]);

    await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user3, Utils.worldName2);
    await Utils.teachContract.connect(Utils.user3).createTeacher(Utils.user4, []);

    result = await expect(Utils.teachContract.connect(Utils.user4).getClassroomGuid(Utils.worldName))
      .to.be.revertedWith("You are not authorised to use this world.");
  });
});
