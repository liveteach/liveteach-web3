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

