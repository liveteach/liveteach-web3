const { ethers } = require("hardhat");

const DEPLOYED_ADDRESS = '0x09182b67EdfdafBc241F7FC993C4fa39aF569cF9'
const LAND_REGISTRY_ADDRESS = '0xA09F9f8079Ae76428dC8F258096776b1dAD9Fd13'

/*  LAND Registry I have deployed, I removed the only Authorized checks
    I don't seem to be able to get round them in test. 
*/
const LAND_OWNER_WALLET = '0xEd485064EB5Ac855Da3014923A87d25BF2D26E26' // shared
const LAND_OPERATOR_WALLET = '0xEd485064EB5Ac855Da3014923A87d25BF2D26E26' // shared
const CLASSROOM_ADMIN_WALLET = '0xF6D7e21Ae74559F6A8A63A8937a0e2EB87F7a255' // qa
const TEACHER_1_WALLET = '0xbEA7Ad6cdb932fD81EB386cc9BD21E426b99cB37' // qa
const TEACHER_2_WALLET = '0x456a04125aEC71F06352EE4eA62A9499ACED6e74' // frankie

// const QA_WALLET = '0xbEA7Ad6cdb932fD81EB386cc9BD21E426b99cB37'


const CLASSROOM_1_GUID = '8cb23bef-b5b0-4461-8ddb-2813b5a802bd'
const CLASSROOM_2_GUID = 'a801d461-f435-48d4-b63c-2b5b51741bc5'

let contract;
let landRegistryContract;

let TEACHER_1_COORDINATES = [[0, 0], [0, 1], [1, 1], [1, 0], [0, 2]];
let TEACHER_2_COORDINATES = [[-55, 1], [-55, 2], [-55, 3], [-55, 4], [-55, 5]];
let QA_COORDINATES = [[100, 1], [100, 2], [100, 3], [100, 4], [100, 5]];

async function main() {
    const contractFactory = await ethers.getContractFactory("TeachContract");
    contract = contractFactory.attach(DEPLOYED_ADDRESS)

    const landRegistryContractFactory = await ethers.getContractFactory("LANDRegistry");
    landRegistryContract = landRegistryContractFactory.attach(LAND_REGISTRY_ADDRESS);
    // await setLandRegistry();
    // await grantLandPermissions();
    // await createClassroomAdmin();
    let teacher1LandIds = await getLandIdsFromCoordinates(TEACHER_1_COORDINATES);
    // let teacher2LandIds = await getLandIdsFromCoordinates(TEACHER_2_COORDINATES);
    await createClassroomLandIds("QA Classroom 1", teacher1LandIds, CLASSROOM_1_GUID);
    // await createClassroomLandIds("Frankie's Classroom 2", teacher2LandIds, CLASSROOM_2_GUID);

    // await createTeacher(TEACHER_1_WALLET, [1]);
    // await createTeacher(TEACHER_2_WALLET, [2]);
}

main();


function coordinatePairsToXYForLandRegistry(coordinatePairs) {
    let xs = [];
    let ys = [];
    for (let i = 0; i < coordinatePairs.length; i++) {
        let x = coordinatePairs[i][0];
        let y = coordinatePairs[i][1];
        xs.push(x);
        ys.push(y);
    }
    return [xs, ys];
}

async function grantLandPermissions() {
    let allLandCoordinates = TEACHER_1_COORDINATES.concat(TEACHER_2_COORDINATES).concat(QA_COORDINATES);
    allLandCoordinates = coordinatePairsToXYForLandRegistry(allLandCoordinates);
    try {
        let tx = await landRegistryContract.assignMultipleParcels(allLandCoordinates[0], allLandCoordinates[1], LAND_OWNER_WALLET)
        console.log(tx)
        let txReceipt = tx.wait()
        console.log(txReceipt)

        tx = await landRegistryContract.setApprovalForAll(LAND_OPERATOR_WALLET, true);
        console.log(tx)
        txReceipt = tx.wait()
        console.log(txReceipt)
    } catch (e) {
        throw (e)
    }
}

async function deleteClassroomAdmin(wallet) {
    try {
        const tx = await contract.deleteClassroomAdmin(wallet)
        console.log(tx)
        const txReceipt = tx.wait()
        console.log(txReceipt)
    } catch (e) {
        throw (e)
    }
}

async function setLandRegistry() {
    try {
        const tx = await contract.setLANDRegistry(LAND_REGISTRY_ADDRESS)
        console.log(tx)
        const txReceipt = tx.wait()
        console.log(txReceipt)
    } catch (e) {
        throw (e)
    }
}

async function getLandIdsFromCoordinates(coordinatePairs) {
    let rtn = await contract.getLandIdsFromCoordinates(coordinatePairs);
    return Array.from(rtn);
}

async function createClassroomAdmin() {
    let teacherLandIds = await getLandIdsFromCoordinates(TEACHER_1_COORDINATES.concat(TEACHER_2_COORDINATES));
    // let qaLandIds = await getLandIdsFromCoordinates(QA_COORDINATES);
    try {
        let tx = await contract.createClassroomAdmin(CLASSROOM_ADMIN_WALLET, teacherLandIds);
        console.log(tx)
        let txReceipt = tx.wait()
        console.log(txReceipt)

        // tx = await contract.createClassroomAdmin(QA_WALLET, qaLandIds);
        // console.log(tx)
        // txReceipt = tx.wait()
        // console.log(txReceipt)

    } catch (e) {
        throw (e)
    }
}


async function createClassroomLandIds(name, landIds, guid) {
    try {
        const tx = await contract.createClassroomLandIds(name, landIds, guid);
        console.log(tx)
        const txReceipt = tx.wait()
        console.log(txReceipt)
    } catch (e) {
        throw (e)
    }
}

async function createTeacher(walletAddress, landIds) {
    try {
        const tx = await contract.createTeacher(walletAddress, landIds);
        console.log(tx)
        const txReceipt = tx.wait()
        console.log(txReceipt)
    } catch (e) {
        throw (e)
    }
}