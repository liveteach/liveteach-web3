import {getCurrentWalletConnected, isClassroomAdmin} from "./interact";

export const checkConnectedWalletAddress = () => {
  if (window?.ethereum?.selectedAddress) {
    return {
      auth: true,
      address: window.ethereum.selectedAddress,
    };
  } else {
    return {
      auth: false,
    };
  }
};

export const userCheck = async () => {
  try {
    const walletAddress = getCurrentWalletConnected();
    const result = await isClassroomAdmin((await walletAddress).address);
    console.log(result);
    return {admin: result}
  } catch (error) {
    console.error(error);
    return {
      admin: false
    };
  }
};
