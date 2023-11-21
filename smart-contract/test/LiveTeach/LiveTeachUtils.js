// const ethers = require("ethers");

module.exports = class Utils {

    static teachContract;
    static landContract;

    static accounts;

    static owner;
    static operator;

    static user1;
    static user2;

    static async init() {
        this.teachContract = await ethers.deployContract("contracts/LiveTeach.sol:LiveTeach");
        this.landContract = await ethers.deployContract("contracts/references/LANDRegistry.sol:LANDRegistry");
        this.accounts = await ethers.getSigners();

        this.owner = this.accounts[0];
        this.operator = this.accounts[1];
        this.user1 = this.accounts[2];
        this.user2 = this.accounts[3];
        this.user3 = this.accounts[4];
        this.user4 = this.accounts[5];
        this.user5 = this.accounts[6];

        let landContractAddress = await this.landContract.target;
        await this.teachContract.connect(this.owner).setLANDRegistry(landContractAddress);

        let parcels = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [0, 10], [0, 11], [0, 12], [0, 13], [0, 14], [0, 15], [0, 16], [0, 17], [0, 18], [0, 19], [0, 20], [0, 21], [1, 1], [-55, 1], [-55, 2], [-55, 3], [-55, 4]];
        let xParcels = [];
        let yParcels = [];
        for (let i = 0; i < parcels.length; i++) {
          let currentParcel = parcels[i];
          xParcels.push(currentParcel[0]);
          yParcels.push(currentParcel[1]);
        }
        let assetIds =  await this.teachContract.connect(this.owner).getLandIdsFromCoordinates(parcels);
        await this.landContract.connect(this.owner).assignMultipleParcels(xParcels, yParcels, this.owner);
        for (let i = 0; i < assetIds.length; i++) {
          await this.landContract.connect(this.owner).approve(this.operator, assetIds[i]);
        }
    }

    static getGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    }
}