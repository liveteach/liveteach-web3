const { ethers } = require("hardhat");

const DEPLOYER_WALLET = '0xEd485064EB5Ac855Da3014923A87d25BF2D26E26'.toLowerCase() // shared
const WORLDS_CONTRACT_ADDRESS = '0x4d999180FBDF91419E41fA5ADa1b13bf864C0605'.toLowerCase()
const REGISTRAR_ADDRESS = '0x5E25bBb1A2de789F2a1F87f5D44eD844A630813c'.toLowerCase()
let worldsContract;
let registrarContract;

async function main() {
    const contractFactory = await ethers.getContractFactory("LiveTeachWorlds");
    worldsContract = contractFactory.attach(WORLDS_CONTRACT_ADDRESS)

    const registrarContractFactory = await ethers.getContractFactory("DCLRegistrar");
    registrarContract = registrarContractFactory.attach(REGISTRAR_ADDRESS);


    await setDCLRegistrar();
}

main();

async function setDCLRegistrar() {
    try {
        const tx = await worldsContract.setDCLRegistrar(REGISTRAR_ADDRESS)
        console.log(tx)
        const txReceipt = tx.wait()
        console.log(txReceipt)
    } catch (e) {
        throw (e)
    }
}
