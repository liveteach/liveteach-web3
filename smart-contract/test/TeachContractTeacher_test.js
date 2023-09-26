const { assert, expect } = require("chai");

describe("TeachContractTeacher", function () {
  let owner;
  let otherUser;
  let teachContract;
  let randomWallet = "0xAA14f5F645273Aa6411995Bf8F02557B7C74a154";
  this.beforeEach(async function () {
    teachContract = await ethers.deployContract("contracts/TeachContract.sol:TeachContract");
    let accounts = await ethers.getSigners();
    owner = accounts[0];
    otherUser = accounts[1];
    otherUser2 = accounts[2];
  })

  // create
  it("Classroom admin can create teacher", async function () {
    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createTeacher(randomWallet, [1]);

    let teacher = await teachContract.connect(otherUser).getTeacher(1);
    assert.equal(randomWallet, teacher.walletAddress);
    assert.equal([1n].toString(), teacher.classroomIds.toString());
  });

  it("Non classroom admin cannot create teacher", async function () {

    await expect(teachContract.connect(otherUser).createTeacher(randomWallet, [1]))
      .to.be.revertedWith(
        "AccessControl: account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 is missing role 0x8fae52bd529c983ddf22c97f6ce088aa2f77daae61682d55801fab9144bd3e4b"
      );
  });

  it("Classroom admin cannot create a a teacher for a classroom that doesn't belong to them", async function () {

    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(owner).createClassroomAdmin(otherUser2, [5, 6]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1, 2, 3, 4]);

    await expect(teachContract.connect(otherUser2).createTeacher(randomWallet, [1]))
      .to.be.revertedWith("Provided classroom id not valid.");
    await expect(teachContract.connect(otherUser).getTeacher(1))
      .to.be.revertedWith("This teacher does not exist or you do not have access to it.");
    await expect(teachContract.connect(otherUser2).getTeacher(1))
      .to.be.revertedWith("This teacher does not exist or you do not have access to it.");
    let teachers = await teachContract.connect(otherUser).getTeachers();
    assert.equal(0, teachers.length);
    teachers = await teachContract.connect(otherUser2).getTeachers();
    assert.equal(0, teachers.length);
  });

  // // read
  it("Classroom admin can get data about all their teachers", async function () {

    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createTeacher(randomWallet, [1]);
    await teachContract.connect(otherUser).createTeacher(otherUser2.address, [1]);

    let teachers = await teachContract.connect(otherUser).getTeachers();
    assert.equal(2, teachers.length);

    assert.equal(randomWallet, teachers[0].walletAddress);
    assert.equal(otherUser2.address, teachers[1].walletAddress);
    assert.equal(1, teachers[0].id);
    assert.equal(2, teachers[1].id);
    assert.equal([1n].toString(), teachers[0].classroomIds.toString());
    assert.equal([1n].toString(), teachers[1].classroomIds.toString());
  });

  it("Non classroom admin cannot get data about a classroom admins teachers", async function () {

    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createTeacher(randomWallet, [1]);
    await teachContract.connect(otherUser).createTeacher(otherUser2.address, [1]);

    await expect(teachContract.connect(otherUser2).getTeachers())
      .to.be.revertedWith(
        "AccessControl: account 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc is missing role 0x8fae52bd529c983ddf22c97f6ce088aa2f77daae61682d55801fab9144bd3e4b"
      );
  });

  it("Classroom admin cannot get data about another classroom admin's teachers", async function () {

    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(owner).createClassroomAdmin(otherUser2, [5, 6]);

    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createTeacher(randomWallet, [1]);
    let result = await teachContract.connect(otherUser2).getTeachers();
    assert.equal(0, result.length);
  });

  it("Classroom admin can get data about a single one of their teachers", async function () {
    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createTeacher(randomWallet, [1]);
    await teachContract.connect(otherUser).createTeacher(otherUser2.address, [1]);

    let teacher = await teachContract.connect(otherUser).getTeacher(1);
    assert.equal(randomWallet, teacher.walletAddress);
    assert.equal(1, teacher.id);
    assert.equal([1n].toString(), teacher.classroomIds.toString());
  });

  it("Non classroom admin cannot get data about a classroom admins single teacher", async function () {

    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createTeacher(randomWallet, [1]);
    await teachContract.connect(otherUser).createTeacher(otherUser2.address, [1]);

    await expect(teachContract.connect(otherUser2).getTeacher(1))
      .to.be.revertedWith(
        "AccessControl: account 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc is missing role 0x8fae52bd529c983ddf22c97f6ce088aa2f77daae61682d55801fab9144bd3e4b"
      );
  });

  it("Classroom admin cannot get data about another classroom admin's single teacher", async function () {

    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(owner).createClassroomAdmin(otherUser2, [5, 6]);

    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createTeacher(randomWallet, [1]);
    await expect(teachContract.connect(otherUser2).getTeacher(1))
      .to.be.revertedWith("This teacher does not exist or you do not have access to it.");
  });

  // // update
  it("Classroom admin can update a teacher's classrooms", async function () {

    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 2", [2, 3]);

    await teachContract.connect(otherUser).createTeacher(randomWallet, [1]);

    let teacher = await teachContract.connect(otherUser).getTeacher(1);
    assert.equal(randomWallet, teacher.walletAddress);
    assert.equal([1n].toString(), teacher.classroomIds.toString());
    await teachContract.connect(otherUser).updateTeacher(1, [1, 2]);
    teacher = await teachContract.connect(otherUser).getTeacher(1);
    assert.equal([1n, 2n].toString(), teacher.classroomIds.toString());

    await teachContract.connect(otherUser).updateTeacher(1, [1, 2]);
    teacher = await teachContract.connect(otherUser).getTeacher(1);
    assert.equal([1n, 2n].toString(), teacher.classroomIds.toString());
  });

  it("Non classroom admin cannot update a teacher's classrooms", async function () {

    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 2", [2, 3]);

    await teachContract.connect(otherUser).createTeacher(randomWallet, [1]);

    let teacher = await teachContract.connect(otherUser).getTeacher(1);
    assert.equal(randomWallet, teacher.walletAddress);
    assert.equal([1n].toString(), teacher.classroomIds.toString());
    await expect(teachContract.connect(otherUser2).updateTeacher(1, [1, 2]))
      .to.be.revertedWith("AccessControl: account 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc is missing role 0x8fae52bd529c983ddf22c97f6ce088aa2f77daae61682d55801fab9144bd3e4b");
  });

  it("Classroom admin cannot update another classroom admin's teachers", async function () {

    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(owner).createClassroomAdmin(otherUser2, [5, 6]);

    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom 2", [2, 3]);

    await teachContract.connect(otherUser).createTeacher(randomWallet, [1]);

    let teacher = await teachContract.connect(otherUser).getTeacher(1);
    assert.equal(randomWallet, teacher.walletAddress);
    assert.equal([1n].toString(), teacher.classroomIds.toString());
    await expect(teachContract.connect(otherUser2).updateTeacher(1, [1, 2]))
      .to.be.revertedWith("This teacher does not exist or you do not have access to it.");
  });

  it("Classroom admin cannot update a teacher's classrooms to classrooms that doesn't belong to them", async function () {

    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(owner).createClassroomAdmin(otherUser2, [5, 6]);

    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1]);
    await teachContract.connect(otherUser2).createClassroomLandIds("Test Classroom 2", [5, 6]);

    await teachContract.connect(otherUser).createTeacher(randomWallet, [1]);

    let teacher = await teachContract.connect(otherUser).getTeacher(1);
    assert.equal(randomWallet, teacher.walletAddress);
    assert.equal([1n].toString(), teacher.classroomIds.toString());
    await expect(teachContract.connect(otherUser).updateTeacher(1, [5]))
      .to.be.revertedWith("Provided classroom id not valid.");
  });

  it("Classroom admin cannot update a teacher's classrooms to classrooms that don't exist", async function () {

    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(owner).createClassroomAdmin(otherUser2, [5, 6]);

    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1]);
    await teachContract.connect(otherUser2).createClassroomLandIds("Test Classroom 2", [5, 6]);

    await teachContract.connect(otherUser).createTeacher(randomWallet, [1]);

    let teacher = await teachContract.connect(otherUser).getTeacher(1);
    assert.equal(randomWallet, teacher.walletAddress);
    assert.equal([1n].toString(), teacher.classroomIds.toString());

    await expect(teachContract.connect(otherUser).updateTeacher(1, [99]))
      .to.be.revertedWith("Provided classroom id not valid.");

  });
  // // delete
  it("Classroom admin can delete their own teachers", async function () {

    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1]);

    await teachContract.connect(otherUser).createTeacher(otherUser2, [1]);
    await teachContract.connect(otherUser).createTeacher(randomWallet, [1]);

    await teachContract.connect(otherUser).deleteTeacher(1);
    let result = await teachContract.connect(otherUser).getTeachers();

    assert.equal(1, result.length);
    let teacher = result[0];
    assert.equal(2, teacher.id);
    assert.equal(randomWallet, teacher.walletAddress);
    assert.equal([1n].toString(), teacher.classroomIds.toString());
    assert.equal(otherUser.address, teacher.classroomAdminId);
  });

  it("Non classroom admin cannot delete teachers", async function () {
    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1]);

    await teachContract.connect(otherUser).createTeacher(otherUser2, [1]);

    await expect(teachContract.connect(otherUser2).deleteTeacher(1))
      .to.be.revertedWith("AccessControl: account 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc is missing role 0x8fae52bd529c983ddf22c97f6ce088aa2f77daae61682d55801fab9144bd3e4b");

  });

  it("Classroom admin cannot delete a teacher that doesn't belong to them", async function () {

    await teachContract.connect(owner).createClassroomAdmin(otherUser, [1, 2, 3, 4]);
    await teachContract.connect(owner).createClassroomAdmin(otherUser2, [5, 6]);

    await teachContract.connect(otherUser).createClassroomLandIds("Test Classroom", [1]);

    await teachContract.connect(otherUser).createTeacher(otherUser2, [1]);
    await teachContract.connect(otherUser).createTeacher(randomWallet, [1]);

    await expect(teachContract.connect(otherUser2).deleteTeacher(1))
      .to.be.revertedWith("This teacher does not exist or you do not have access to it.");
  });

  // ENSURE - the same wallet could be used in teachers belonging to another classroom admin!
  // ALSO should getClassroom/s return information about the teachers?
  // also to consider - now if I delete a classroom admin - do their teachers get deleted?
  // i think it should cascade downwards
});