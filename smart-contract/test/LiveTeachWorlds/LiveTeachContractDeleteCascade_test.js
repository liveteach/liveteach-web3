const { assert, expect } = require("chai");
const Utils = require("./LiveTeachUtils");

describe("LiveTeachWorldContractDeleteCascade", function () {
    this.beforeEach(async function () {
        await Utils.init();
    });

    it("Deleting a classroom admin deletes it's classrooms", async function () {
        await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, [Utils.worldName, Utils.worldName2, Utils.worldName3]);
        await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user2, [Utils.worldName4]);

        await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom 1", Utils.worldName, Utils.getGuid());
        await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom 2", Utils.worldName2, Utils.getGuid());
        await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom 3", Utils.worldName3, Utils.getGuid());
        await Utils.teachContract.connect(Utils.user2).createClassroom("Test Classroom 4", Utils.worldName4, Utils.getGuid());

        let allClassrooms = await Utils.teachContract.connect(Utils.owner).allClassrooms();
        assert.equal(4, allClassrooms.length);
        await Utils.teachContract.connect(Utils.worldOwner).deleteClassroomAdmin(Utils.user1);
        allClassrooms = await Utils.teachContract.connect(Utils.owner).allClassrooms();
        assert.equal(1, allClassrooms.length);
    });

    it("Deleting a classroom admin deletes it's teachers", async function () {
        await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, [Utils.worldName, Utils.worldName2, Utils.worldName3]);
        await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user2, [Utils.worldName4]);

        await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom 1", Utils.worldName, Utils.getGuid());
        await Utils.teachContract.connect(Utils.user2).createClassroom("Test Classroom 4", Utils.worldName4, Utils.getGuid());

        await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user3, [100001]);
        await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user4, [100001]);
        await Utils.teachContract.connect(Utils.user2).createTeacher(Utils.user5, [100002]);

        let allTeachers = await Utils.teachContract.connect(Utils.owner).allTeachers();
        assert.equal(3, allTeachers.length);
        await Utils.teachContract.connect(Utils.worldOwner).deleteClassroomAdmin(Utils.user1);
        allTeachers = await Utils.teachContract.connect(Utils.owner).allTeachers();
        assert.equal(1, allTeachers.length);

    });

    it("Deleting a classroom deletes it's teachers but not teachers assigned to other classrooms", async function () {
        await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user1, [Utils.worldName, Utils.worldName2, Utils.worldName3]);
        await Utils.teachContract.connect(Utils.worldOwner).createClassroomAdmin(Utils.user2, [Utils.worldName4]);

        await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom 1", Utils.worldName, Utils.getGuid());
        await Utils.teachContract.connect(Utils.user1).createClassroom("Test Classroom 2", Utils.worldName, Utils.getGuid());
        await Utils.teachContract.connect(Utils.user2).createClassroom("Test Classroom 4", Utils.worldName4, Utils.getGuid());

        await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user3, [100001]);
        await Utils.teachContract.connect(Utils.user1).createTeacher(Utils.user4, [100001, 100002]);
        await Utils.teachContract.connect(Utils.user2).createTeacher(Utils.user5, [100003]);

        let allTeachers = await Utils.teachContract.connect(Utils.owner).allTeachers();
        assert.equal(3, allTeachers.length);
        await Utils.teachContract.connect(Utils.user1).deleteClassroom(100001);
        allTeachers = await Utils.teachContract.connect(Utils.owner).allTeachers();
        assert.equal(2, allTeachers.length);
        await expect(Utils.teachContract.connect(Utils.user1).getTeacher(Utils.user3))
            .to.be.revertedWith("Object doesn't exist or you don't have access to it.");
        let teacher1 = await Utils.teachContract.connect(Utils.user1).getTeacher(Utils.user4);
        assert.equal(teacher1.classroomIds.length, 1);
        assert.equal(teacher1.classroomIds[0], 100002);

        let teacher2 = await Utils.teachContract.connect(Utils.user2).getTeacher(Utils.user5);
        assert.equal(teacher2.classroomIds.length, 1);
        assert.equal(teacher2.classroomIds[0], 100003);

    });

});