const { assert, expect } = require("chai");
const Utils = require("./LiveTeachUtils");

describe("LiveTeachContractClassroom", function () {

  this.beforeEach(async function () {
    await Utils.init();
  })

  // create
  it("Classroom admin can create classroom", async function () {
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1n, 2n, 3n, 4n]);
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom", [1, 2, 3, 4], Utils.getGuid());

    let classrooms = await Utils.teachContract.connect(Utils.user1).getClassrooms();
    assert.equal(1, classrooms.length);
    let classroom = classrooms[0];
    assert.equal("Test Classroom", classroom.name);
    assert.equal([1n, 2n, 3n, 4n].toString(), classroom.landIds.toString());
    assert.equal(4, classroom.landCoordinates.length);
  });

  it("Non classroom admin cannot create classroom", async function () {
    await expect(Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom", [1, 2, 3, 4], Utils.getGuid()))
      .to.be.revertedWith("You " + Utils.user1.address.toLowerCase() + " lack the appropriate role to call this function: CLASSROOM_ADMIN");
  });

  it("Classroom admin cannot create classroom with unregistered landIds", async function () {
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    await expect(Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom", [4, 5, 6, 7], Utils.getGuid()))
      .to.be.revertedWith("Provided id invalid.");
    let classrooms = await Utils.teachContract.connect(Utils.user1).getClassrooms();
    assert.equal(0, classrooms.length);
  });

  it("Classroom admin cannot create classroom with landIds not registered to them.", async function () {
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user4, [5, 6]);

    await expect(Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom", [4, 5], Utils.getGuid()))
      .to.be.revertedWith("Provided id invalid.");
    let classrooms = await Utils.teachContract.connect(Utils.user1).getClassrooms();
    assert.equal(0, classrooms.length);
  });

  it("Classrooms have unique ids", async function () {
    let landIds = [];
    for (let i = 0; i < 20; i++) {
      landIds.push(i + 1);
    }

    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, landIds);
    for (let i = 0; i < 20; i++) {
      await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom " + i, [i + 1], Utils.getGuid());
    }

    let classrooms = await Utils.teachContract.connect(Utils.user1).getClassrooms();
    assert.equal(20, classrooms.length);
    let counts = {};
    for (let i = 0; i < classrooms.length; i++) {
      let classroom = classrooms[i];
      counts[classroom.id] = 0;
    }
    for (let i = 0; i < classrooms.length; i++) {
      let classroom = classrooms[i];
      counts[classroom.id]++;
    }
    for (let i = 0; i < classrooms.length; i++) {
      let classroom = classrooms[i];
      assert.equal(1, counts[classroom.id]);
    }
  });

  it("Land can exist in multiple classrooms create", async function () {
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom 1", [1], Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom 2", [1], Utils.getGuid());
    let result = await Utils.teachContract.connect(Utils.user1).getClassrooms();
    assert.equal(2, result.length);
    assert.equal(1, result[0].landIds[0]);
    assert.equal(1, result[1].landIds[0]);
  });

  // // read
  it("Classroom admin can get data about all their classrooms", async function () {
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom 1", [1], Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom 2", [2, 3], Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom 3", [4], Utils.getGuid());
    let result = await Utils.teachContract.connect(Utils.user1).getClassrooms();
    assert.equal(3, result.length);

    let testClassroom1 = result[0];
    let testClassroom2 = result[1];
    let testClassroom3 = result[2];

    assert.equal("Test Classroom 1", testClassroom1.name);
    assert.equal("Test Classroom 2", testClassroom2.name);
    assert.equal("Test Classroom 3", testClassroom3.name);

    assert.equal(1, testClassroom1.landIds.length);
    assert.equal(2, testClassroom2.landIds.length);
    assert.equal(1, testClassroom3.landIds.length);

    assert.equal(1, testClassroom1.landIds[0]);
    assert.equal(2, testClassroom2.landIds[0]);
    assert.equal(3, testClassroom2.landIds[1]);
    assert.equal(4, testClassroom3.landIds[0]);
  });

  it("Non classroom admin cannot get data about a classroom admins classrooms", async function () {
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom 1", [1], Utils.getGuid());
    await expect(Utils.teachContract.connect(Utils.user2).getClassrooms())
      .to.be.revertedWith("You " + Utils.user2.address.toLowerCase() + " lack the appropriate role to call this function: CLASSROOM_ADMIN");
  });

  it("Classroom admin cannot get data about another classroom admin's classrooms", async function () {
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1]);
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom 1", [1], Utils.getGuid());

    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user2, [2, 3]);
    await Utils.teachContract.connect(Utils.user2).createClassroomLandIds("Test Classroom 2", [2, 3], Utils.getGuid());

    let result = await Utils.teachContract.connect(Utils.user1).getClassrooms();
    assert.equal(1, result.length);
    assert.equal(1, result[0].landIds.length);
    assert.equal("Test Classroom 1", result[0].name);
    assert.equal([1n].toString(), result[0].landIds.toString());

    result = await Utils.teachContract.connect(Utils.user2).getClassrooms();
    assert.equal(1, result.length);
    assert.equal(2, result[0].landIds.length);
    assert.equal("Test Classroom 2", result[0].name);
    assert.equal([2n, 3n].toString(), result[0].landIds.toString());
  });

  it("Classroom admin can get data about a single one of their classrooms", async function () {
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [2, 4, 6]);
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom 1", [2, 4], Utils.getGuid());
    let result = await Utils.teachContract.connect(Utils.user1).getClassroom(1);
    assert.equal(2, result.landIds.length);
    assert.equal("Test Classroom 1", result.name);
    assert.equal([2n, 4n].toString(), result.landIds.toString());
  });

  it("Non classroom admin cannot get data about a classroom admins single classroom", async function () {
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 3, 4]);
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom 1", [1], Utils.getGuid());
    await expect(Utils.teachContract.connect(Utils.user2).getClassroom(0))
      .to.be.revertedWith("Object doesn't exist or you don't have access to it.");
  });

  it("Classroom admin cannot get data about another classroom admin's single classroom", async function () {
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1]);
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom 1", [1], Utils.getGuid());

    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user2, [2, 3]);
    await Utils.teachContract.connect(Utils.user2).createClassroomLandIds("Test Classroom 2", [2, 3], Utils.getGuid());

    await expect(Utils.teachContract.connect(Utils.user1).getClassroom(2))
      .to.be.revertedWith("Object doesn't exist or you don't have access to it.");
  });

  // delete
  it("Classroom admin can delete their own classroom", async function () {
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2]);
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom 1", [1, 2], Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).deleteClassroom(1);
    let allClassrooms = await Utils.teachContract.connect(Utils.user1).getClassrooms();
    assert.equal(0, allClassrooms.length);
    await expect(Utils.teachContract.connect(Utils.user1).getClassroom(1)).to.be.revertedWith("Object doesn't exist or you don't have access to it.");

  });

  it("Non classroom admin cannot delete classroom", async function () {
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2]);
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom 1", [1, 2], Utils.getGuid());
    await expect(Utils.teachContract.connect(Utils.user2).deleteClassroom(1))
      .to.be.revertedWith("You " + Utils.user2.address.toLowerCase() + " lack the appropriate role to call this function: CLASSROOM_ADMIN");
    let allClassrooms = await Utils.teachContract.connect(Utils.user1).getClassrooms();
    assert.equal(1, allClassrooms.length);
    let result = await Utils.teachContract.connect(Utils.user1).getClassroom(1);
    assert.equal("Test Classroom 1", result.name);
    assert.equal([1n, 2n].toString(), result.landIds);
  });

  it("Classroom admin cannot delete a classroom that doesn't belong to them", async function () {
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2]);
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user2, [3, 4]);
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom 1", [1, 2], Utils.getGuid());
    await expect(Utils.teachContract.connect(Utils.user2).deleteClassroom(1))
      .to.be.revertedWith("Object doesn't exist or you don't have access to it.");
    let allClassrooms = await Utils.teachContract.connect(Utils.user1).getClassrooms();
    assert.equal(1, allClassrooms.length);
    let result = await Utils.teachContract.connect(Utils.user1).getClassroom(1);
    assert.equal("Test Classroom 1", result.name);
    assert.equal([1n, 2n].toString(), result.landIds);
  });


  it("Teacher can get GUID from their own classroom", async function () {
    let guid = Utils.getGuid();
    let result;
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2]);
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom 1", [1, 2], guid);
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [1]);
    result = await Utils.teachContract.connect(Utils.user2).getClassroomGuid(0, 1);
    assert.equal(guid, result);
  });


  it("Non teacher cannot get GUID from classroom", async function () {
    let guid = Utils.getGuid();
    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2]);
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom 1", [1, 2], guid);
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [1]);
    await expect(Utils.teachContract.connect(Utils.user3).getClassroomGuid(0, 1))
      .to.be.revertedWith("You " + Utils.user3.address.toLowerCase() + " are not authorised to use this classroom.");
  });


  it("Teacher cannot get GUID from classroom that doesn't belong to them", async function () {
    let landId1 = 1n;
    let landId2 = 340282366920938463463374607431768211457n;

    // 0,1 = 1n
    // 1,1 = 340282366920938463463374607431768211457n

    await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [landId1, landId2]);
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom 1", [landId1], Utils.getGuid());
    await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom 2", [landId2], Utils.getGuid());

    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [1]);
    await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user3, [2]);

    await expect(Utils.teachContract.connect(Utils.user2).getClassroomGuid(1, 1))
      .to.be.revertedWith("You " + Utils.user2.address.toLowerCase() + " are not authorised to use this classroom.");
  });

  // ----------------------------------------------------------------------------------------------- //
  // TODO: Move these tests to seperate contract
  // it("Teacher can get / set the classroom config url", async function () {
  //   let guid = Utils.getGuid();
  //   let result;
  //   await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2]);
  //   await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom 1", [1, 2], guid);

  //   await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [1]);

  //   result = await Utils.teachContract.connect(Utils.user2).getClassroomConfigUrl(guid);
  //   assert.equal("Config url not yet set for this classroom", result);

  //   let expectedJsonUrl = "https://frankieclassroomjson.com/c1.json";
  //   await Utils.teachContract.connect(Utils.user2).setClassroomConfigUrl(guid, expectedJsonUrl);

  //   result = await Utils.teachContract.connect(Utils.user2).getClassroomConfigUrl(guid);
  //   assert.equal(result, expectedJsonUrl);
  // });


  // it("Teacher cannot get / set a classroom config url that doesn't belong to them", async function () {
  //   let guid = Utils.getGuid();
  //   let guid2 = Utils.getGuid();

  //   await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2, 5, 6]);
  //   await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom 1", [1, 2], guid);
  //   await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom 2", [5, 6], guid2);

  //   await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [1]);
  //   await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user3, [2]);

  //   await expect(Utils.teachContract.connect(Utils.user3).getClassroomConfigUrl(guid))
  //     .to.be.revertedWith(
  //       "Object doesn't exist or you don't have access to it."
  //     );

  //   let expectedJsonUrl = "https://frankieclassroomjson.com/c1.json";
  //   await expect(Utils.teachContract.connect(Utils.user3).setClassroomConfigUrl(guid, expectedJsonUrl))
  //     .to.be.revertedWith(
  //       "Object doesn't exist or you don't have access to it."
  //     );
  // });


  // it("Non teacher cannot get / set the classroom config url", async function () {
  //   let guid = Utils.getGuid();

  //   await Utils.teachContract.connect(Utils.operator).createClassroomAdmin(Utils.user1, [1, 2]);
  //   await Utils.teachContract.connect(Utils.user1).createClassroomLandIds("Test Classroom 1", [1, 2], guid);
  //   await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user2, [1]);
  //   await expect(Utils.teachContract.connect(Utils.user3).getClassroomConfigUrl(guid))
  //     .to.be.revertedWith(
  //       "You " + Utils.user3.address.toLowerCase() + " lack the appropriate role to call this function: TEACHER"
  //     );

  //   let expectedJsonUrl = "https://frankieclassroomjson.com/c1.json";
  //   await expect(Utils.teachContract.connect(Utils.user3).setClassroomConfigUrl(guid, expectedJsonUrl))
  //     .to.be.revertedWith(
  //       "You " + Utils.user3.address.toLowerCase() + " lack the appropriate role to call this function: TEACHER"
  //     );
  // });
});
