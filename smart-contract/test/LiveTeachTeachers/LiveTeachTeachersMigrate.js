const { assert, expect } = require("chai");
const Utils = require("./LiveTeachTeachersUtils");

Object.freeze = function (obj) { return obj; }; // immuatable object returned from ethers workaround
 
describe("TeachersContractMigrate", function () {
    this.beforeEach(async function () {
        await Utils.init();
        for (let i = 0; i < 10; i++) {
            await Utils.teachersContract.connect(Utils.user1).createClassConfig("reference_" + i, "http://url_" + i);
        }
    })

    it("Owner can export", async function () {
        let dump = await Utils.teachersContract.connect(Utils.owner).export();
        let expectedWallet = await Utils.user1.address;
        // check dump looks as expected
        assert.equal(10, dump.length);
        for (let i = 0; i < 10; i++) {
            assert.equal(dump[i].id, i);
            assert.equal(dump[i].teacher, expectedWallet);
            assert.equal(dump[i].classReference, "reference_" + i);
            assert.equal(dump[i].contentUrl, "http://url_" + i);

        }
    });

    it("Non owner cannot dump", async function () {
        await expect(Utils.teachersContract.connect(Utils.user1).export())
            .to.be.revertedWith("Only the contract owner can call this function");
    });

    it("Owner can import", async function () {
        let data = await Utils.teachersContract.connect(Utils.owner).export();

        // make a new contract
        await Utils.init();
        // prove it's empty
        let newContractdump = await Utils.teachersContract.connect(Utils.owner).export();
        assert.equal(newContractdump.length, 0);

        await Utils.teachersContract.connect(Utils.owner)._import(data);
        // prove new contract has the data
        newContractdump = await Utils.teachersContract.connect(Utils.owner).export();
        let expectedWallet = await Utils.user1.address;
        // check dump looks as expected
        assert.equal(10, newContractdump.length);
        for (let i = 0; i < 10; i++) {
            assert.equal(newContractdump[i].id, i);
            assert.equal(newContractdump[i].teacher, expectedWallet);
            assert.equal(newContractdump[i].classReference, "reference_" + i);
            assert.equal(newContractdump[i].contentUrl, "http://url_" + i);

        }
    });

    it("Non owner cannot import data", async function () {
        let data = await Utils.teachersContract.connect(Utils.owner).export();

        await expect(Utils.teachersContract.connect(Utils.user1)._import(data))
            .to.be.revertedWith("Only the contract owner can call this function");
    });

    it("Cannot import into a non empty contract", async function () {
        let data = [[
            9n,
            '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
            'reference_9',
            'http://url_9'
        ]
        ]

        await expect(Utils.teachersContract.connect(Utils.owner)._import(data))
            .to.be.revertedWith("Can only call _import on an empty contract");
    });

});
