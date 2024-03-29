module.exports = class Utils {

    static teachersContract;
    static accounts;

    static owner;

    static user1;
    static user2;
    static user3;
    static user4;
    static user5;

    static async init() {
        this.teachersContract = await ethers.deployContract("contracts/LiveTeachTeachers.sol:LiveTeachTeachers");
        this.accounts = await ethers.getSigners();

        this.owner = this.accounts[0];
        this.user1 = this.accounts[2];
        this.user2 = this.accounts[3];
        this.user3 = this.accounts[4];
        this.user4 = this.accounts[5];
        this.user5 = this.accounts[6];
    }

    
  static getGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
}