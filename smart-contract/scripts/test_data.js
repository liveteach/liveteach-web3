const { ethers } = require("hardhat");

const DEPLOYED_ADDRESS = '0x62657bdB46C8508db48aB8d36E636F9B83e723E3'

const LAND_REGISTRY_ADDRESS = '0xe3488406B7ec0242aeF527C5D91751d024b007fB'
const CLASSROOM_ADMIN_WALLET = '0xEd485064EB5Ac855Da3014923A87d25BF2D26E26' // shared
const TEACHER_1_WALLET = '0xA34CEbc5957c6a9A0240537FFeA51C94361179B8' // shaun
const TEACHER_2_WALLET = '0x456a04125aEC71F06352EE4eA62A9499ACED6e74' // frankie


const TEACHER_1_LAND_IDS = [0, // 0,0
    1, // 0,1
    340282366920938463463374607431768211457n, // 1,1
    340282366920938463463374607431768211456n, // 1,0
    2, // 0,2
]
const TEACHER_2_LAND_IDS = [
    115792089237316195423570985008687907834554454484988948548971980599165878009857n, // -55, 1
    115792089237316195423570985008687907834554454484988948548971980599165878009858n, // -55, 2
    115792089237316195423570985008687907834554454484988948548971980599165878009859n, // -55, 3
    115792089237316195423570985008687907834554454484988948548971980599165878009860n, // -55, 4
    115792089237316195423570985008687907834554454484988948548971980599165878009861n  // -55, 5
]

const CLASSROOM_1_GUID = '8cb23bef-b5b0-4461-8ddb-2813b5a802bd'
const CLASSROOM_2_GUID = 'a801d461-f435-48d4-b63c-2b5b51741bc5'

let contract;

async function main() {
    const contractFactory = await ethers.getContractFactory("TeachContract");
    contract = contractFactory.attach(DEPLOYED_ADDRESS)

    await deleteClassroomAdmin(CLASSROOM_ADMIN_WALLET);
    await setLandRegistry();
    await createClassroomAdmin();
    await createClassroomLandIds("Shaun's Classroom 1", TEACHER_1_LAND_IDS, CLASSROOM_1_GUID)
    await createClassroomLandIds("Frankie's Classroom 2", TEACHER_2_LAND_IDS, CLASSROOM_2_GUID)

    await createTeacher(TEACHER_1_WALLET, [1]);
    await createTeacher(TEACHER_2_WALLET, [2]);

    // try {
    //     const tx = await contract.getClassroomGuid(-55,1)
    //     console.log(tx)
    //     const txReceipt = tx.wait()
    //     console.log(txReceipt)
    // } catch (e) {
    //     throw (e)
    // }


}

main();

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

async function createClassroomAdmin() {
    let allLandIds = TEACHER_1_LAND_IDS.concat(TEACHER_2_LAND_IDS)
    try {
        const tx = await contract.createClassroomAdmin(CLASSROOM_ADMIN_WALLET, allLandIds);
        console.log(tx)
        const txReceipt = tx.wait()
        console.log(txReceipt)
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