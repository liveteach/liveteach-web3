// const ethers = require("ethers");

module.exports = class Utils {

  static teachContract;
  static landContract;
  static dclRegistrarContract;

  static accounts;

  static owner;
  static operator;
  static worldOwner;

  static worldName = "decentraland";
  static worldName2 = "jumboland";
  static worldName3 = "bedfordfalls";
  static worldName4 = "oz";
  static worldName5 = "piccolino";

  static user1;
  static user2;

  static async init() {
    this.teachContract = await ethers.deployContract("contracts/LiveTeachWorlds.sol:LiveTeachWorlds");
    this.dclRegistrarContract = await ethers.deployContract("contracts/references/DCLRegistrar.sol:DCLRegistrar");

    this.accounts = await ethers.getSigners();

    this.owner = this.accounts[0];
    this.operator = this.accounts[1];
    this.user1 = this.accounts[2];
    this.user2 = this.accounts[3];
    this.user3 = this.accounts[4];
    this.user4 = this.accounts[5];
    this.user5 = this.accounts[6];
    this.worldOwner = this.accounts[7];

    let teachContractAddress = await this.teachContract.target;
    let dclRegistrarAddress = await this.dclRegistrarContract.target;

    await this.teachContract.connect(this.owner).setDCLRegistrar(dclRegistrarAddress);

    await this.dclRegistrarContract.connect(this.owner).setOwnerOf(this.worldName, this.worldOwner);
    await this.dclRegistrarContract.connect(this.owner).setOwnerOf(this.worldName2, this.worldOwner);
    await this.dclRegistrarContract.connect(this.owner).setOwnerOf(this.worldName3, this.worldOwner);
    await this.dclRegistrarContract.connect(this.owner).setOwnerOf(this.worldName4, this.worldOwner);
    await this.dclRegistrarContract.connect(this.owner).setOwnerOf(this.worldName5, this.worldOwner);
  }

  static getGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
}