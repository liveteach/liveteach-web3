const { assert, expect } = require("chai");

describe("TeachContractClassConfig", function () {
  let owner;
  let classroomAdmin;
  let teacher1;
  let teacher2;
  let nonRegisteredUser;
  let teachContract;

  let randomWallet = "0xAA14f5F645273Aa6411995Bf8F02557B7C74a154";
  this.beforeEach(async function () {
    teachContract = await ethers.deployContract("contracts/TeachContract.sol:TeachContract");
    let accounts = await ethers.getSigners();
    owner = accounts[0];
    classroomAdmin = accounts[1];
    teacher1 = accounts[2];
    teacher2 = accounts[3];
    nonRegisteredUser = accounts[4];
    await teachContract.connect(owner).createClassroomAdmin(classroomAdmin, [1, 2, 3, 4]);
    await teachContract.connect(classroomAdmin).createClassroomLandIds("Test Classroom", [1, 2, 3, 4]);
    await teachContract.connect(classroomAdmin).createTeacher(teacher1, [1]);
    await teachContract.connect(classroomAdmin).createTeacher(teacher2, [1]);
  })

  // create

  it("Teacher should be able to create ClassConfig", async function () {
    await teachContract.connect(teacher1).createClassConfig("LESSON_1", "https://website.json");
  });

  it("Non teacher should not be able to create ClassConfig", async function () {
    await expect(teachContract.connect(nonRegisteredUser).createClassConfig("LESSON_1", "https://website.json"))
      .to.be.revertedWith("AccessControl: account 0x15d34aaf54267db7d7c367839aaf71a00a2c6a65 is missing role 0x534b5b9fe29299d99ea2855da6940643d68ed225db268dc8d86c1f38df5de794");
  });

  // read
  it("Teacher should be able to get data about all of their ClassConfigs", async function () {
    // should not include data from other teachers ClassConfigs
    await teachContract.connect(teacher1).createClassConfig("T1_L1", "https://websitet1l1.json");
    await teachContract.connect(teacher1).createClassConfig("T1_L2", "https://websitet1l2.json");
    await teachContract.connect(teacher1).createClassConfig("T1_L3", "https://websitet1l3.json");

    await teachContract.connect(teacher2).createClassConfig("T2_L1", "https://websitet2l1.json");
    await teachContract.connect(teacher2).createClassConfig("T2_L2", "https://websitet2l2.json");
    let classConfigs = await teachContract.connect(teacher1).getClassConfigs();
    assert.equal(3, classConfigs.length);

    assert.equal("T1_L1", classConfigs[0].classReference);
    assert.equal("https://websitet1l1.json", classConfigs[0].contentUrl);

    assert.equal("T1_L2", classConfigs[1].classReference);
    assert.equal("https://websitet1l2.json", classConfigs[1].contentUrl);

    assert.equal("T1_L3", classConfigs[2].classReference);
    assert.equal("https://websitet1l3.json", classConfigs[2].contentUrl);
  });

  it("Teacher should be able to get data about a single one of their ClassConfigs", async function () {
    await teachContract.connect(teacher1).createClassConfig("T1_L1", "https://websitet1l1.json");
    await teachContract.connect(teacher1).createClassConfig("T1_L2", "https://websitet1l2.json");
    await teachContract.connect(teacher1).createClassConfig("T1_L3", "https://websitet1l3.json");

    let classConfig = await teachContract.connect(teacher1).getClassConfig(1);
    assert.equal("T1_L1", classConfig.classReference);
    assert.equal("https://websitet1l1.json", classConfig.contentUrl);
  });

  it("Teacher should not be able to get data about a single one of another teachers ClassConfigs", async function () {
    await teachContract.connect(teacher1).createClassConfig("T1_L1", "https://websitet1l1.json");
    await expect(teachContract.connect(teacher2).getClassConfig(1))
      .to.be.revertedWith("This class config does not exist or you do not have access to it.");
  });
  // update
  it("Teacher should be able to update their ClassConfig", async function () {
    await teachContract.connect(teacher1).createClassConfig("T1_L1", "https://websitet1l1.json");
    await teachContract.connect(teacher1).createClassConfig("T1_L2", "https://websitet1l2.json");

    await teachContract.connect(teacher1).updateClassConfig(1, "UPDATED_REF", "https://updatedurl.json");

    let classConfig = await teachContract.connect(teacher1).getClassConfig(1);

    assert.equal("UPDATED_REF", classConfig.classReference);
    assert.equal("https://updatedurl.json", classConfig.contentUrl);
  });
  it("Teacher should not be able to update a non existing ClassConfig", async function () {
    await teachContract.connect(teacher1).createClassConfig("T1_L1", "https://websitet1l1.json");
    await teachContract.connect(teacher1).createClassConfig("T1_L2", "https://websitet1l2.json");

    await expect(teachContract.connect(teacher1).updateClassConfig(5, "UPDATED_REF", "https://updatedurl.json"))
      .to.be.revertedWith("This class config does not exist or you do not have access to it.");

  });
  it("Teacher should not be able to update another teachers ClassConfig", async function () {
    await teachContract.connect(teacher1).createClassConfig("T1_L1", "https://websitet1l1.json");
    await teachContract.connect(teacher1).createClassConfig("T1_L2", "https://websitet1l2.json");

    await expect(teachContract.connect(teacher2).updateClassConfig(1, "UPDATED_REF", "https://updatedurl.json"))
      .to.be.revertedWith("This class config does not exist or you do not have access to it.");
  });
  //delete
  it("Teacher should be able to delete their ClassConfig", async function () {
    await teachContract.connect(teacher1).createClassConfig("T1_L1", "https://websitet1l1.json");
    await teachContract.connect(teacher1).createClassConfig("T1_L2", "https://websitet1l2.json");

    await teachContract.connect(teacher1).deleteClassConfig(1);
    let classConfigs = await teachContract.connect(teacher1).getClassConfigs();

    assert.equal(1, classConfigs.length);

    assert.equal("T1_L2", classConfigs[0].classReference);
    assert.equal("https://websitet1l2.json", classConfigs[0].contentUrl);
  });
  it("Teacher should not be able to delete a non existing ClassConfig", async function () {
    await teachContract.connect(teacher1).createClassConfig("T1_L1", "https://websitet1l1.json");
    await teachContract.connect(teacher1).createClassConfig("T1_L2", "https://websitet1l2.json");

    await expect(teachContract.connect(teacher1).deleteClassConfig(5))
      .to.be.revertedWith("This class config does not exist or you do not have access to it.");
  });
  it("Teacher should not be able to delete another teachers ClassConfig", async function () {
    await teachContract.connect(teacher1).createClassConfig("T1_L1", "https://websitet1l1.json");
    await teachContract.connect(teacher1).createClassConfig("T1_L2", "https://websitet1l2.json");

    await expect(teachContract.connect(teacher2).deleteClassConfig(1))
      .to.be.revertedWith("This class config does not exist or you do not have access to it.");
  });
});
