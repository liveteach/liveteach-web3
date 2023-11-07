const { assert, expect } = require("chai");

describe("TeachContractClassroom", function () {
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
  it("Classroom admin can create classroom", async function () {
    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1n, 2n, 3n, 4n]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1, 2, 3, 4], getGuid());

    let classrooms = await teachContract.connect(otherUser).getClassrooms();
    assert.equal(1, classrooms.length);
    let classroom = classrooms[0];
    assert.equal("Test Classroom", classroom.name);
    assert.equal([1n, 2n, 3n, 4n].toString(), classroom.landIds.toString());
    assert.equal(4, classroom.landCoordinates.length);
  });

  it("Non classroom admin cannot create classroom", async function () {
    await expect(teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1, 2, 3, 4], getGuid()))
      .to.be.revertedWith("AccessControl: account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 is missing role 0x8fae52bd529c983ddf22c97f6ce088aa2f77daae61682d55801fab9144bd3e4b");
  });

  it("Classroom admin cannot create classroom with unregistered landIds", async function () {
    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await expect(teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [4, 5, 6, 7], getGuid()))
      .to.be.revertedWith("Provided id invalid.");
    let classrooms = await teachContract.connect(otherUser).getClassrooms();
    assert.equal(0, classrooms.length);
  });

  it("Classroom admin cannot create classroom with landIds not registered to them.", async function () {
    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(operator).createClassroomAdmin(randomWallet, [5, 6]);

    await expect(teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [4, 5], getGuid()))
      .to.be.revertedWith("Provided id invalid.");
    let classrooms = await teachContract.connect(otherUser).getClassrooms();
    assert.equal(0, classrooms.length);
  });

  it("Classrooms have unique ids", async function () {
    let landIds = [];
    for (let i = 0; i < 20; i++) {
      landIds.push(i + 1);
    }

    await teachContract.connect(operator).createClassroomAdmin(otherUser, landIds);
    for (let i = 0; i < 20; i++) {
      await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom " + i, [i + 1], getGuid());
    }

    let classrooms = await teachContract.connect(otherUser).getClassrooms();
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

  it("Land id can only exist in a single classroom create", async function () {
    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 1", [1], getGuid());
    await expect(teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 2", [1], getGuid()))
      .to.be.revertedWith("Provided id invalid.");
  });

  // // read
  it("Classroom admin can get data about all their classrooms", async function () {
    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 1", [1], getGuid());
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 2", [2, 3], getGuid());
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 3", [4], getGuid());
    let result = await teachContract.connect(otherUser).getClassrooms();
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
    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 1", [1], getGuid());
    await expect(teachContract.connect(otherUser2).getClassrooms())
      .to.be.revertedWith("AccessControl: account 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc is missing role 0x8fae52bd529c983ddf22c97f6ce088aa2f77daae61682d55801fab9144bd3e4b");
  });

  it("Classroom admin cannot get data about another classroom admin's classrooms", async function () {
    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 1", [1], getGuid());

    await teachContract.connect(operator).createClassroomAdmin(otherUser2, [2, 3]);
    await teachContract.connect(otherUser2).createClassroomLandIds("Test Classroom 2", [2, 3], getGuid());

    let result = await teachContract.connect(otherUser).getClassrooms();
    assert.equal(1, result.length);
    assert.equal(1, result[0].landIds.length);
    assert.equal("Test Classroom 1", result[0].name);
    assert.equal([1n].toString(), result[0].landIds.toString());

    result = await teachContract.connect(otherUser2).getClassrooms();
    assert.equal(1, result.length);
    assert.equal(2, result[0].landIds.length);
    assert.equal("Test Classroom 2", result[0].name);
    assert.equal([2n, 3n].toString(), result[0].landIds.toString());
  });

  it("Classroom admin can get data about a single one of their classrooms", async function () {
    await teachContract.connect(operator).createClassroomAdmin(otherUser, [2, 4, 6]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 1", [2, 4], getGuid());
    let result = await teachContract.connect(otherUser).getClassroom(1);
    assert.equal(2, result.landIds.length);
    assert.equal("Test Classroom 1", result.name);
    assert.equal([2n, 4n].toString(), result.landIds.toString());
  });

  it("Non classroom admin cannot get data about a classroom admins single classroom", async function () {
    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 1", [1], getGuid());
    await expect(teachContract.connect(otherUser2).getClassroom(0))
      .to.be.revertedWith("Object doesn't exist or you don't have access to it.");
  });

  it("Classroom admin cannot get data about another classroom admin's single classroom", async function () {
    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 1", [1], getGuid());

    await teachContract.connect(operator).createClassroomAdmin(otherUser2, [2, 3]);
    await teachContract.connect(otherUser2).createClassroomLandIds("Test Classroom 2", [2, 3], getGuid());

    await expect(teachContract.connect(otherUser).getClassroom(2))
      .to.be.revertedWith("Object doesn't exist or you don't have access to it.");
  });

  // update
  it("Classroom admin can update a classroom", async function () {
    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2, 3, 4, 5]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 1", [1, 2], getGuid());
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 2", [3], getGuid());

    await teachContract.connect(otherUser).updateClassroom(1, "Updated Classroom", [4, 5]);
    // check updated in getClassroom
    let updatedClassroom = await teachContract.connect(otherUser).getClassroom(1);
    assert.equal("Updated Classroom", updatedClassroom.name);
    assert.equal([4n, 5n].toString(), updatedClassroom.landIds.toString());

    // check updated in getClassrooms (classroomAdminToClassrooms)
    let allClassrooms = await teachContract.connect(otherUser).getClassrooms();
    assert.equal(2, allClassrooms.length);
    for (let i = 0; i < allClassrooms.length; i++) {
      if (allClassrooms[i].id == 0) {
        updatedClassroom = allClassrooms[i];
        break;
      }
    }
    assert.equal("Updated Classroom", updatedClassroom.name);
    assert.equal([4n, 5n].toString(), updatedClassroom.landIds.toString());
  });

  it("Classroom admin cannot update classroom with unassigned landIds", async function () {
    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 1", [1, 2], getGuid());

    await expect(teachContract.connect(otherUser).updateClassroom(1, "Updated Classroom", [4, 5]))
      .to.be.revertedWith("Provided id invalid.");

    let classroom = await teachContract.connect(otherUser).getClassroom(1);
    assert.equal("Test Classroom 1", classroom.name);
    assert.equal([1n, 2n].toString(), classroom.landIds.toString());
  });

  it("Classroom admin cannot update classroom with another admins landIds", async function () {
    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2]);
    await teachContract.connect(operator).createClassroomAdmin(otherUser2, [3, 4]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 1", [1, 2], getGuid());
    await expect(teachContract.connect(otherUser).updateClassroom(1, "Updated Classroom", [3, 4]))
      .to.be.revertedWith("Provided id invalid.");

    let classroom = await teachContract.connect(otherUser).getClassroom(1);

    assert.equal("Test Classroom 1", classroom.name);
    assert.equal([1n, 2n].toString(), classroom.landIds.toString());

    let allClassrooms = await teachContract.connect(otherUser).getClassrooms();
    assert.equal(1, allClassrooms.length);
    classroom = allClassrooms[0];

    assert.equal("Test Classroom 1", classroom.name);
    assert.equal([1n, 2n].toString(), classroom.landIds.toString());
  });

  it("Non classroom admin cannot change the name and landIds of a classroom", async function () {
    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 1", [1, 2], getGuid());
    await expect(teachContract.connect(otherUser2).updateClassroom(1, "Updated Classroom", [3, 4]))
      .to.be.revertedWith("AccessControl: account 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc is missing role 0x8fae52bd529c983ddf22c97f6ce088aa2f77daae61682d55801fab9144bd3e4b");

    let classroom = await teachContract.connect(otherUser).getClassroom(1);

    assert.equal("Test Classroom 1", classroom.name);
    assert.equal([1n, 2n].toString(), classroom.landIds.toString());

    let allClassrooms = await teachContract.connect(otherUser).getClassrooms();
    assert.equal(1, allClassrooms.length);
    classroom = allClassrooms[0];

    assert.equal("Test Classroom 1", classroom.name);
    assert.equal([1n, 2n].toString(), classroom.landIds.toString());
  });

  // delete
  it("Classroom admin can delete their own classroom", async function () {
    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 1", [1, 2], getGuid());
    await teachContract.connect(otherUser).deleteClassroom(1);
    let allClassrooms = await teachContract.connect(otherUser).getClassrooms();
    assert.equal(0, allClassrooms.length);
    await expect(teachContract.connect(otherUser).getClassroom(1)).to.be.revertedWith("Object doesn't exist or you don't have access to it.");

  });

  it("Non classroom admin cannot delete classroom", async function () {
    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 1", [1, 2], getGuid());
    await expect(teachContract.connect(otherUser2).deleteClassroom(1))
      .to.be.revertedWith("AccessControl: account 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc is missing role 0x8fae52bd529c983ddf22c97f6ce088aa2f77daae61682d55801fab9144bd3e4b");
    let allClassrooms = await teachContract.connect(otherUser).getClassrooms();
    assert.equal(1, allClassrooms.length);
    let result = await teachContract.connect(otherUser).getClassroom(1);
    assert.equal("Test Classroom 1", result.name);
    assert.equal([1n, 2n].toString(), result.landIds);
  });

  it("Classroom admin cannot delete a classroom that doesn't belong to them", async function () {
    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2]);
    await teachContract.connect(operator).createClassroomAdmin(otherUser2, [3, 4]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 1", [1, 2], getGuid());
    await expect(teachContract.connect(otherUser2).deleteClassroom(1))
      .to.be.revertedWith("Object doesn't exist or you don't have access to it.");
    let allClassrooms = await teachContract.connect(otherUser).getClassrooms();
    assert.equal(1, allClassrooms.length);
    let result = await teachContract.connect(otherUser).getClassroom(1);
    assert.equal("Test Classroom 1", result.name);
    assert.equal([1n, 2n].toString(), result.landIds);
  });


  it("Teacher can get GUID from their own classroom", async function () {
    let guid = getGuid();
    let result;
    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 1", [1, 2], guid);
    await teachContract.connect(otherUser).createTeacher(otherUser2, [1]);
    result = await teachContract.connect(otherUser2).getClassroomGuid(0, 1);
    assert.equal(guid, result);
  });


  it("Non teacher cannot get GUID from classroom", async function () {
    let guid = getGuid();
    await teachContract.connect(operator).createClassroomAdmin(otherUser, [1, 2]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 1", [1, 2], guid);
    await teachContract.connect(otherUser).createTeacher(otherUser2, [1]);
    await expect(teachContract.connect(otherUser3).getClassroomGuid(0, 1))
      .to.be.revertedWith("AccessControl: account 0x90f79bf6eb2c4f870365e785982e1f101e93b906 is missing role 0x534b5b9fe29299d99ea2855da6940643d68ed225db268dc8d86c1f38df5de794");
  });


  it("Teacher cannot get GUID from classroom that doesn't belong to them", async function () {
    let landId1 = 1n;
    let landId2 = 340282366920938463463374607431768211457n;

    // 0,1 = 1n
    // 1,1 = 340282366920938463463374607431768211457n

    await teachContract.connect(operator).createClassroomAdmin(otherUser, [landId1, landId2]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 1", [landId1], getGuid());
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 2", [landId2], getGuid());

    await teachContract.connect(otherUser).createTeacher(otherUser2, [1]);
    await teachContract.connect(otherUser).createTeacher(otherUser3, [2]);

    await expect(teachContract.connect(otherUser2).getClassroomGuid(1, 1))
      .to.be.revertedWith("You are not authorised to use this classroom.");
  });

});

function getGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}