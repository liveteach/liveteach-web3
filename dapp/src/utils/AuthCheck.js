import {getContributorAdmin} from './interact';

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
  // try {
  //   const result = await getContributorAdmin();
  //   console.log(result);
  //   console.log(window.ethereum.selectedAddress);
  //
  //   return{
  //     admin:window.ethereum.selectedAddress.toLowerCase() === result.toLowerCase()
  //   }
  // } catch (error) {
  //   console.error(error);
  //   return {
  //     admin: false
  //   };
  // }
};
