const { assert, expect } = require("chai");
const Utils = require("./LiveTeachTeachersUtils");

describe("TeachersContractClassroomConfig", function () {
    // NB: Although these tests refer to the user as Teacher
    // ClassConfigs can be created and then administered
    // by any wallet address.  Roles are not enforced.

    this.beforeEach(async function () {
        await Utils.init();
    })

    // create
    it("Teacher can create valid ClassConfig", async function () {
        let classReference = "History Class A";
        let contentUrl = "https://someurl.x.y.z";
        await Utils.teachersContract.connect(Utils.user1).createClassConfig(classReference, contentUrl);
        let result = await Utils.teachersContract.connect(Utils.user1).getClassConfigs();
        assert.equal(result.length, 1);
    });
    // read
    it("Teacher can get their ClassConfig", async function () {
        let classReference = "History Class A";
        let contentUrl = "https://someurl.x.y.z";
        await Utils.teachersContract.connect(Utils.user1).createClassConfig(classReference, contentUrl);
        let classConfig = await Utils.teachersContract.connect(Utils.user1).getClassConfig(0);
        assert.equal(classConfig.id, 0);
        assert.equal(classConfig.teacher, Utils.user1.address);
        assert.equal(classConfig.classReference, classReference);
        assert.equal(classConfig.contentUrl, contentUrl);
    });
    it("Teacher can get their ClassConfigs", async function () {
        let classReference = "History Class A";
        let contentUrl = "https://someurl.x.y.z";
        await Utils.teachersContract.connect(Utils.user1).createClassConfig(classReference, contentUrl);
        let result = await Utils.teachersContract.connect(Utils.user1).getClassConfigs();
        assert.equal(result.length, 1);
        let classConfig = result[0];
        assert.equal(classConfig.id, 0);
        assert.equal(classConfig.teacher, Utils.user1.address);
        assert.equal(classConfig.classReference, classReference);
        assert.equal(classConfig.contentUrl, contentUrl);
    });
    it("Teacher cannot get another teachers ClassConfig", async function () {
        let classReference = "History Class A";
        let contentUrl = "https://someurl.x.y.z";
        await Utils.teachersContract.connect(Utils.user1).createClassConfig(classReference, contentUrl);
        await expect(Utils.teachersContract.connect(Utils.user2).getClassConfig(1))
            .to.be.revertedWith(
                "Object doesn't exist or you don't have access to it."
            );

    });
    it("Teacher can get only their ClassConfigs", async function () {
        let classReference = "History Class A";
        let contentUrl = "https://someurl.x.y.z";

        await Utils.teachersContract.connect(Utils.user1).createClassConfig(classReference, contentUrl);
        await Utils.teachersContract.connect(Utils.user2).createClassConfig("French Class B", "https://welcometofrenchclassb.com/config.json");

        let result = await Utils.teachersContract.connect(Utils.user1).getClassConfigs();
        assert.equal(result.length, 1);
        let classConfig = result[0];
        assert.equal(classConfig.id, 0);
        assert.equal(classConfig.teacher, Utils.user1.address);
        assert.equal(classConfig.classReference, classReference);
        assert.equal(classConfig.contentUrl, contentUrl);
    });
    // update
    it("Teacher can update their ClassConfig", async function () {
        let classReference = "History Class A";
        let contentUrl = "https://someurl.x.y.z";

        let updatedClassReference = "French Class B";
        let updatedContentUrl = "https://welcometofrenchclassb.com/content.json";

        await Utils.teachersContract.connect(Utils.user1).createClassConfig(classReference, contentUrl);
        let classConfig = await Utils.teachersContract.connect(Utils.user1).getClassConfig(0);
        assert.equal(classConfig.id, 0);
        assert.equal(classConfig.teacher, Utils.user1.address);
        assert.equal(classConfig.classReference, classReference);
        assert.equal(classConfig.contentUrl, contentUrl);

        await Utils.teachersContract.connect(Utils.user1).updateClassConfig(0, updatedClassReference, updatedContentUrl);
        classConfig = await Utils.teachersContract.connect(Utils.user1).getClassConfig(0);
        assert.equal(classConfig.id, 0);
        assert.equal(classConfig.teacher, Utils.user1.address);
        assert.equal(classConfig.classReference, updatedClassReference);
        assert.equal(classConfig.contentUrl, updatedContentUrl);
    });

    it("Teacher cannot update anothers ClassConfig", async function () {
        let classReference = "History Class A";
        let contentUrl = "https://someurl.x.y.z";

        let updatedClassReference = "French Class B";
        let updatedContentUrl = "https://welcometofrenchclassb.com/content.json";

        await Utils.teachersContract.connect(Utils.user1).createClassConfig(classReference, contentUrl);
        let classConfig = await Utils.teachersContract.connect(Utils.user1).getClassConfig(0);
        assert.equal(classConfig.id, 0);
        assert.equal(classConfig.teacher, Utils.user1.address);
        assert.equal(classConfig.classReference, classReference);
        assert.equal(classConfig.contentUrl, contentUrl);

        await expect(Utils.teachersContract.connect(Utils.user2).updateClassConfig(0, updatedClassReference, updatedContentUrl))
            .to.be.revertedWith(
                "Object doesn't exist or you don't have access to it."
            );
    });

    // delete
    it("Teacher can delete their ClassConfig", async function () {
        let classReference = "History Class A";
        let contentUrl = "https://someurl.x.y.z";

        let classReference2 = "French Class B";
        let contentUrl2 = "https://welcometofrenchclassb.com/content.json";

        await Utils.teachersContract.connect(Utils.user1).createClassConfig(classReference, contentUrl);
        await Utils.teachersContract.connect(Utils.user1).createClassConfig(classReference2, contentUrl2);

        let result = await Utils.teachersContract.connect(Utils.user1).getClassConfigs();
        assert.equal(result.length, 2);
        await Utils.teachersContract.connect(Utils.user1).deleteClassConfig(0);
        result = await Utils.teachersContract.connect(Utils.user1).getClassConfigs();
        assert.equal(result.length, 1);
        let classConfig = await Utils.teachersContract.connect(Utils.user1).getClassConfig(1);
        assert.equal(classConfig.id, 1);
        assert.equal(classConfig.teacher, Utils.user1.address);
        assert.equal(classConfig.classReference, classReference2);
        assert.equal(classConfig.contentUrl, contentUrl2);
    });

    it("Teacher cannot delete anothers ClassConfig", async function () {
        let classReference = "History Class A";
        let contentUrl = "https://someurl.x.y.z";

        await Utils.teachersContract.connect(Utils.user1).createClassConfig(classReference, contentUrl);
        await expect(Utils.teachersContract.connect(Utils.user2).deleteClassConfig(1))
            .to.be.revertedWith(
                "Object doesn't exist or you don't have access to it."
            );
    });
});
