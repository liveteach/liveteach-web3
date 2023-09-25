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

const contractABI = require("../contract-abi.json");
const contractAddress = process.env.REACT_APP_SMART_CONTRACT_ADDRESS;

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
  return new web3.eth.Contract(contractABI, contractAddress);
};

export const getBalanceOfUser = async () => {
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
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
  const opensea = `https://opensea.io/assets/${contractAddress}/${token}`;
  return { token, coordinate, visit, opensea };
};

export const calculateMetamaskValueFromEthereum = (ethereumAmount) => {
  const weiValue = web3.utils.toWei(ethereumAmount.toString(), "ether");
  const bnValue = web3.utils.toBN(weiValue);
  return bnValue.toString(16);
};

// classroom admin 
// create

export const createClassroomAdmin = async (walletAddress, landIds) => {
  // should only be callable by LAND_OPERATOR, currently callable by anyone

  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  return callGasTransaction(window.contract.methods.createClassroomAdmin, [walletAddress, landIds]);
};
// read
export const getClassroomAdmins = async () => {
  // should only be callable by LAND_OPERATOR, currently callable by anyone

  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const result = await window.contract.methods
    .getClassroomAdmins()
    .call({ from: window.ethereum.selectedAddress });
  return result;
};

export const getClassroomAdmin = async (walletAddress) => {
  // should only be callable by LAND_OPERATOR, currently callable by anyone

  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const result = await window.contract.methods
    .getClassroomAdmin(walletAddress)
    .call({ from: window.ethereum.selectedAddress });
  return result;
};

export const isLandIdAssigned = async (landId) => {
  // should only be callable by LAND_OPERATOR, currently callable by anyone

  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const result = await window.contract.methods
    .isClassroomAdminAssignedLandId(landId)
    .call({ from: window.ethereum.selectedAddress });
  return result;
};

export const isLandIdsAssigned = async (landIds) => {
  // should only be callable by LAND_OPERATOR, currently callable by anyone

  // checks all included land Ids to see if they're registered
  // returns false if any are not.
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const result = await window.contract.methods
    .isClassroomAdminAssignedLandIds(landIds)
    .call({ from: window.ethereum.selectedAddress });
  return result;
};

export const isClassroomAdmin = async (walletAddress) => {
  // should only be callable by LAND_OPERATOR, currently callable by anyone

  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const result = await window.contract.methods
    .isClassroomAdmin(walletAddress)
    .call({ from: window.ethereum.selectedAddress });
  return result;
};

export const getClassroomAdminLandIds = async (walletAddress) => {
  // should only be callable by LAND_OPERATOR, currently callable by anyone
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const result = await window.contract.methods
    .getClassroomAdminLandIds(walletAddress)
    .call({ from: window.ethereum.selectedAddress });
  return result;
};
// update
export const addClassroomAdminLandIds = async (walletAddress, landIds) => {
  // should only be callable by LAND_OPERATOR, currently callable by anyone
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  return callGasTransaction(window.contract.methods.addClassroomAdminLandIds,
    [walletAddress, landIds]);
};
// delete
export const removeAllClassroomAdminLandIds = async (walletAddress) => {
  // should only be callable by LAND_OPERATOR, currently callable by anyone
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  return callGasTransaction(window.contract.methods.removeAllClassroomAdminLandIds,
    [walletAddress]);
};

export const removeClassroomAdminLandIds = async (walletAddress, landIds) => {
  // should only be callable by LAND_OPERATOR, currently callable by anyone
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  return callGasTransaction(window.contract.methods.removeClassroomAdminLandIds,
    [walletAddress, landIds]);
};

export const removeClassroomAdmin = async (walletAddress) => {
  // should only be callable by LAND_OPERATOR, currently callable by anyone
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  return callGasTransaction(window.contract.methods.removeClassroomAdmin,
    [walletAddress]);
};

// classroom

// create
export const createClassroomLandIds = async (name, landIds) => {
  // onlyRole(CLASSROOM_ADMIN)
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  return callGasTransaction(window.contract.methods.createClassroom,
    [name, landIds]);
};
export const createClassroom = async (name, coordinatePairs) => {
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
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  return callGasTransaction(window.contract.methods.createClassroomCoordinates,
    [name, coordinatePairs]);
};
// read
export const getClassrooms = async () => {
  // onlyRole(CLASSROOM_ADMIN)
  // gets All a classroom admin's assigned classrooms
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const result = await window.contract.methods
    .getClassrooms()
    .call({ from: window.ethereum.selectedAddress });
  return result;
};

export const getClassroom = async (id) => {
  // onlyRole(CLASSROOM_ADMIN)
  // gets a classroom admin's classroom by id
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const result = await window.contract.methods
    .getClassroom(id)
    .call({ from: window.ethereum.selectedAddress });
  return result;
};
// update
export const updateClassroom = async (id, name, landIds) => {
  // onlyRole(CLASSROOM_ADMIN)
  // updates fields for a given classroom id
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  return callGasTransaction(window.contract.methods.updateClassroom,
    [id, name, landIds]);
};
// delete
export const deleteClassroom = async (id) => {
  // onlyRole(CLASSROOM_ADMIN)
  // deletes a classroom by id
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  return callGasTransaction(window.contract.methods.deleteClassroom,
    [id]);
};

async function callGasTransaction(func, params) {
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
    return {
      success: true,
      status: "✅ Check out your transaction on Etherscan: https://goerli.etherscan.io/tx/" + txHash
    }
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message
    }
  }
}

