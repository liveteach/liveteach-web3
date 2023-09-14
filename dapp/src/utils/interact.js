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
    .call();
  return balanceOfUser;
};

export const getTokenOfOwnerByIndex = async (index) => {
  const token = await window.contract.methods
    .tokenOfOwnerByIndex(
      "0x88ad51a54cc7bee75dfa052ad6be78d772dd9d81",
      index + ""
    )
    .call();
  const coordinate = await window.contract.methods
    .decodeTokenId(token + "")
    .call();
  const visit = `https://play.decentraland.org?position=${coordinate[0]},${coordinate[1]}`;
  const opensea = `https://opensea.io/assets/${contractAddress}/${token}`;
  return { token, coordinate, visit, opensea };
};

export const calculateMetamaskValueFromEthereum = (ethereumAmount) => {
  const weiValue = web3.utils.toWei(ethereumAmount.toString(), "ether");
  const bnValue = web3.utils.toBN(weiValue);
  return bnValue.toString(16);
};

export const getContributorAdmin = async () => {
  /* public
   * returns a single wallet address
   */
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const contributorAdmin = await window.contract.methods
    .contributorAdmin()
    .call();
  return contributorAdmin;
};

export const setContributorAdmin = async (walletAddress) => {
  // only owner
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const transactionParameters = {
    to: contractAddress,
    from: window.ethereum.selectedAddress,
    'data': window.contract.methods.setContributorAdmin(walletAddress).encodeABI()
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
};

export const addContributors = async (walletAddresses) => {
  // only contributor admin
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const transactionParameters = {
    to: contractAddress,
    from: window.ethereum.selectedAddress,
    'data': window.contract.methods.addContributors(walletAddresses).encodeABI()
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
};

export const getContributors = async () => {
  /* public 
   * returns an array of wallet addresses or an empty array.
   */
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const contributors = await window.contract.methods
    .getContributors()
    .call();
  return contributors;
};

export const removeContributors = async (walletAddresses) => {
  // only contributor admin
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const transactionParameters = {
    to: contractAddress,
    from: window.ethereum.selectedAddress,
    'data': window.contract.methods.removeContributors(walletAddresses).encodeABI()
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
};

export const getEntitlements = async () => {
  /* public 
   * returns an array of wallet addresses or an empty array.
   */
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const entitlements = await window.contract.methods
    .getEntitlements()
    .call({ from: window.ethereum.selectedAddress });
  return entitlements;
};

export const addEntitlements = async (walletAddress, landIds) => {
  // only contributor admin
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const transactionParameters = {
    to: contractAddress,
    from: window.ethereum.selectedAddress,
    'data': window.contract.methods.addEntitlements(walletAddress, landIds).encodeABI()
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
};

export const removeEntitlements = async (walletAddress, landIds) => {
  // only contributor admin
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const transactionParameters = {
    to: contractAddress,
    from: window.ethereum.selectedAddress,
    'data': window.contract.methods.removeEntitlements(walletAddress, landIds).encodeABI()
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
};

export const removeAllEntitlements = async (walletAddress) => {
  // only contributor admin
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const transactionParameters = {
    to: contractAddress,
    from: window.ethereum.selectedAddress,
    'data': window.contract.methods.removeAllEntitlements(walletAddress).encodeABI()
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
};

export const getContributorEntitlementCounts = async () => {
  /* public 
   * returns an array of two elements.
   * rtn[0] is a list of wallet addresses
   * rtn[1] is a list of entitlement counts
   * so, walletAddress = rtn[0][0], count = rtn[1][0] etc...
   */
  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const contributorEntitlementCounts = await window.contract.methods
    .getContributorEntitlementCounts()
    .call();
  return contributorEntitlementCounts;
};

export const getEntitlementsByWalletAddress = async (walletAddress) => {
  /**
   * Returns a pair of arrays.
   * First contains the encoded landIds of the entitlement
   * Second contains an array twice the length of the first, representing a pair of coordinates
   * for each id in the first array i.e. [x,y,x,y,x,y...]
   */

  window.contract = await new web3.eth.Contract(contractABI, contractAddress);
  const result = await window.contract.methods
    .getEntitlementsByWalletAddress(walletAddress).call();
  return result;
};