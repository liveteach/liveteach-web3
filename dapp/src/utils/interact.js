import {
  walletStatus_Connected,
  walletStatus_ReloadPage,
  walletStatus_ConnectWallet,
  walletStatus_InstallWallet,
  walletStatus_Error,
  walletStatus_Message_Connected,
  walletStatus_Message_ConnectWallet,
  walletStatus_Message_InstallWallet,
  walletStatus_Message_ReloadPage,
} from "./constants";


require("dotenv").config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY_SOCKET;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const liveTeachContractAbi = require("../contracts/LiveTeach.json");
const teachersContractAbi = require("../contracts/LiveTeachTeachers.json");

const liveTeachContractAddress = process.env.REACT_APP_SMART_CONTRACT_ADDRESS;
const teachersContractAddress = process.env.REACT_APP_SMART_TEACHERS_CONTRACT_ADDRESS;

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        address: addressArray[0],
        status: walletStatus_Connected,
        message: walletStatus_Message_Connected,
      };
      return obj;
    } catch (err) {
      if (err.code === -32002) {
        return {
          address: "",
          status: walletStatus_ReloadPage,
          message: "😥 " + walletStatus_Message_ReloadPage,
        };
      }
      return {
        address: "",
        status: walletStatus_Error,
        message: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: walletStatus_InstallWallet,
      message: walletStatus_Message_InstallWallet,
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: walletStatus_Connected,
          message: walletStatus_Message_Connected,
        };
      } else {
        return {
          address: "",
          status: walletStatus_ConnectWallet,
          message: walletStatus_Message_ConnectWallet,
        };
      }
    } catch (err) {
      return {
        address: "",
        status: walletStatus_Error,
        message: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: walletStatus_InstallWallet,
      message: walletStatus_Message_InstallWallet,
    };
  }
};

export const getContractInstance = async () => {
  return new web3.eth.Contract(liveTeachContractAbi, liveTeachContractAddress);
};

export const getBalanceOfUser = async () => {
  window.contract = await new web3.eth.Contract(liveTeachContractAbi, liveTeachContractAddress);
  const balanceOfUser = await window.contract.methods
    .balanceOf("0x88ad51a54cc7bee75dfa052ad6be78d772dd9d81")
    .call({ from: window.ethereum.selectedAddress });
  return balanceOfUser;
};

export const getTokenOfOwnerByIndex = async (index) => {
  const token = await window.contract.methods
    .tokenOfOwnerByIndex(
      "0x88ad51a54cc7bee75dfa052ad6be78d772dd9d81",
      index + ""
    )
    .call({ from: window.ethereum.selectedAddress });
  const coordinate = await window.contract.methods
    .decodeTokenId(token + "")
    .call({ from: window.ethereum.selectedAddress });
  const visit = `https://play.decentraland.org?position=${coordinate[0]},${coordinate[1]}`;
  const opensea = `https://opensea.io/assets/${liveTeachContractAddress}/${token}`;
  return { token, coordinate, visit, opensea };
};

export const calculateMetamaskValueFromEthereum = (ethereumAmount) => {
  const weiValue = web3.utils.toWei(ethereumAmount.toString(), "ether");
  const bnValue = web3.utils.toBN(weiValue);
  return bnValue.toString(16);
};

export const getLandIdsFromCoordinates = async (coordinatePairs) => {
  window.contract = await new web3.eth.Contract(liveTeachContractAbi, liveTeachContractAddress);
  const result = await window.contract.methods
    .getLandIdsFromCoordinates(coordinatePairs)
    .call({ from: window.ethereum.selectedAddress });
  return result;
};

// classroom admin 
// create

export const createClassroomAdminCoordinates = async (walletAddress, coordinatePairs) => {
  // should only be callable by LAND_OPERATOR, currently callable by anyone
  const landIds = await getLandIdsFromCoordinates(coordinatePairs);
  return createClassroomAdmin(walletAddress, landIds);
};

export const createClassroomAdmin = async (walletAddress, landIds) => {
  // should only be callable by LAND_OPERATOR, currently callable by anyone

  window.contract = await new web3.eth.Contract(liveTeachContractAbi, liveTeachContractAddress);
  return callGasTransaction(window.contract.methods.createClassroomAdmin, [walletAddress, landIds]);
};
// read
export const getClassroomAdmins = async () => {
  // should only be callable by LAND_OPERATOR, currently callable by anyone

  window.contract = await new web3.eth.Contract(liveTeachContractAbi, liveTeachContractAddress);
  const result = await window.contract.methods
    .getClassroomAdmins()
    .call({ from: window.ethereum.selectedAddress });
  return result;
};

export const getClassroomAdmin = async (walletAddress) => {
  // should only be callable by LAND_OPERATOR, currently callable by anyone

  window.contract = await new web3.eth.Contract(liveTeachContractAbi, liveTeachContractAddress);
  const result = await window.contract.methods
    .getClassroomAdmin(walletAddress)
    .call({ from: window.ethereum.selectedAddress });
  return result;
};

export const isClassroomAdmin = async (walletAddress) => {
  // should only be callable by LAND_OPERATOR, currently callable by anyone
  window.contract = await new web3.eth.Contract(liveTeachContractAbi, liveTeachContractAddress);
  const result = await window.contract.methods
    .isClassroomAdmin(walletAddress)
    .call({ from: window.ethereum.selectedAddress });
  return result;
};

// update
export const updateClassroomAdmin = async (walletAddress, landIds) => {
  // should only be callable by LAND_OPERATOR, currently callable by anyone
  // updates landIds for a classroom admin
  window.contract = await new web3.eth.Contract(liveTeachContractAbi, liveTeachContractAddress);
  return callGasTransaction(window.contract.methods.updateClassroom,
    [walletAddress, landIds]);
};

// delete
export const removeClassroomAdmin = async (walletAddress) => {
  // should only be callable by LAND_OPERATOR, currently callable by anyone
  window.contract = await new web3.eth.Contract(liveTeachContractAbi, liveTeachContractAddress);
  return callGasTransaction(window.contract.methods.deleteClassroomAdmin,
    [walletAddress]);
};

// classroom

// create
export const createClassroomLandIds = async (name, landIds) => {
  // onlyRole(CLASSROOM_ADMIN)
  window.contract = await new web3.eth.Contract(liveTeachContractAbi, liveTeachContractAddress);
  return callGasTransaction(window.contract.methods.createClassroom,
    [name, landIds]);
};
export const createClassroom = async (name, coordinatePairs, guid, url, history) => {
  /*
  coordinatePairs - a 2d signed integer array of x,y values 
  representing land coordinates
  i.e.
  coordinatePairs = [
    [1, 2],
    [50, 99],
    [-128, 256]
  ] 
  */
  // onlyRole(CLASSROOM_ADMIN)
  window.contract = await new web3.eth.Contract(liveTeachContractAbi, liveTeachContractAddress);
  return callGasTransaction(window.contract.methods.createClassroomCoordinates,
    [name, coordinatePairs, guid], url, history);
};
// read
export const getClassrooms = async () => {
  // onlyRole(CLASSROOM_ADMIN)
  // gets All a classroom admin's assigned classrooms
  window.contract = await new web3.eth.Contract(liveTeachContractAbi, liveTeachContractAddress);
  const result = await window.contract.methods
    .getClassrooms()
    .call({ from: window.ethereum.selectedAddress });
  return result;
};

export const getClassroom = async (id) => {
  // onlyRole(CLASSROOM_ADMIN)
  // gets a classroom admin's classroom by id
  window.contract = await new web3.eth.Contract(liveTeachContractAbi, liveTeachContractAddress);
  const result = await window.contract.methods
    .getClassroom(id)
    .call({ from: window.ethereum.selectedAddress });
  return result;
};

export const updateClassroom = async (id, name, landIds) => {
  // onlyRole(CLASSROOM_ADMIN)
  // updates fields for a given classroom id
  window.contract = await new web3.eth.Contract(liveTeachContractAbi, liveTeachContractAddress);
  return callGasTransaction(window.contract.methods.updateClassroom,
    [id, name, landIds]);
};

// delete
export const deleteClassroom = async (id) => {
  // onlyRole(CLASSROOM_ADMIN)
  // deletes a classroom by id
  window.contract = await new web3.eth.Contract(liveTeachContractAbi, liveTeachContractAddress);
  return callGasTransaction(window.contract.methods.deleteClassroom,
    [id]);
};

// Teachers
// create
export const createTeacher = async (walletAddress, classroomIds, url, history) => {
  // onlyRole(CLASSROOM_ADMIN)

  window.contract = await new web3.eth.Contract(liveTeachContractAbi, liveTeachContractAddress);
  return callGasTransaction(window.contract.methods.createTeacher,
    [walletAddress, classroomIds], url, history);
}
// read
export const getTeachers = async () => {
  // onlyRole(CLASSROOM_ADMIN)

  window.contract = await new web3.eth.Contract(liveTeachContractAbi, liveTeachContractAddress);
  const result = await window.contract.methods
    .getTeachers()
    .call({ from: window.ethereum.selectedAddress });
  return result;
}
export const getTeacher = async (walletAddress) => {
  // onlyRole(CLASSROOM_ADMIN)

  window.contract = await new web3.eth.Contract(liveTeachContractAbi, liveTeachContractAddress);
  const result = await window.contract.methods
    .getTeacher(walletAddress)
    .call({ from: window.ethereum.selectedAddress });
  return result;
}
// update
export const updateTeacher = async (walletAddress, classroomIds) => {
  // onlyRole(CLASSROOM_ADMIN)

  window.contract = await new web3.eth.Contract(liveTeachContractAbi, liveTeachContractAddress);
  return callGasTransaction(window.contract.methods.updateTeacher,
    [walletAddress, classroomIds]);
}
// delete
export const deleteTeacher = async (walletAddress) => {
  // onlyRole(CLASSROOM_ADMIN)

  window.contract = await new web3.eth.Contract(liveTeachContractAbi, liveTeachContractAddress);
  return callGasTransaction(window.contract.methods.deleteTeacher,
    [walletAddress]);
}


////
export const getUserRoles = async () => {
  //PUBLIC
  window.contract = await new web3.eth.Contract(liveTeachContractAbi, liveTeachContractAddress);
  const result = await window.contract.methods
    .getRoles()
    .call({ from: window.ethereum.selectedAddress });
  let rtn = [];
  for (const [role, held] of Object.entries(result)) {
    if (held && isNaN(role))
      rtn.push(role);
  }
  // everyone is a landOperator
  // they can only create / view / delete
  // if they have land permissions.
  rtn.push("landOperator");

  return rtn;
}
////

// LiveTeachTeachers contract calls
// create

/* Create a new ClassConfig.
 * Callable by anyone.
 */
export const createClassConfig = async (classReference, contentUrl) => {
  window.contract = await new web3.eth.Contract(teachersContractAbi, teachersContractAddress);
  return callGasTransaction(window.contract.methods.createClassConfig,
    [classReference, contentUrl], null, null, teachersContractAddress);
}
// read
/* Get all the ClassConfigs associated with the calling teacher.
 */
export const getClassConfigs = async () => {
  const result = window.contract = await new web3.eth.Contract(teachersContractAbi, teachersContractAddress)
    .getClassConfigs()
    .call({ from: window.ethereum.selectedAddress });
  return result;
}
/* Get a single ClassConfig by id.
 * The caller must own (have created) the ClassConfig.
 */
export const getClassConfig = async (id) => {
  const result = window.contract = await new web3.eth.Contract(teachersContractAbi, teachersContractAddress)
    .getClassConfig(id)
    .call({ from: window.ethereum.selectedAddress });
  return result;
}
// update
/* Update the classReference and contentUrl fields 
 * on a ClassConfig identified by id.
 * The caller must own (have created) the ClassConfig.
 */
export const updateClassConfig = async (id, classReference, contentUrl) => {
  window.contract = await new web3.eth.Contract(teachersContractAbi, teachersContractAddress);
  return callGasTransaction(window.contract.methods.updateClassConfig,
    [id, classReference, contentUrl], null, null, teachersContractAddress);
}
// delete
/* Delete a ClassConfig by id.
 * The caller must own (have created) the ClassConfig.
 */
export const deleteClassConfig = async (id) => {
  window.contract = await new web3.eth.Contract(teachersContractAbi, teachersContractAddress);
  return callGasTransaction(window.contract.methods.deleteClassConfig,
    [id], null, null, teachersContractAddress);
}


function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getReceipt(txHash) {
  try {
    const receipt = await window.ethereum.request({
      "method": "eth_getTransactionReceipt",
      "params": [
        txHash
      ]
    });
    if (receipt !== null) {
      return {
        "success": true,
        "receipt": receipt
      };
    }
  }
  catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message
    };
  }
}

async function callGasTransaction(func, params, redirectUrl = null, history = null, contractAddress = null) {
  if (!contractAddress)
    contractAddress = liveTeachContractAddress;
  const transactionParameters = {
    to: contractAddress,
    from: window.ethereum.selectedAddress,
    'data': func.apply(this, params).encodeABI()
  };
  try {
    const txHash = await window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
    if (redirectUrl) {
      console.log("Redirect to:", redirectUrl);
      history.push(redirectUrl);
    }
    let receipt;
    while (!receipt) {
      receipt = await getReceipt(txHash);
      console.log("pending", receipt)
      await timeout(1000);
    }
    console.log(receipt);
    return receipt;

  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message
    }
  }
}
