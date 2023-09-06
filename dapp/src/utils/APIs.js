import axios from "axios";
import { walletStatus_Message_ConnectWallet } from "./constants";

export const getContributionCount = async () => {
  try {
    const addressArray = await window.ethereum.request({
      method: "eth_accounts",
    });
    if (addressArray.length > 0) {
      const { data } = await axios.get(
        `${process.env.REACT_APP_VEGACITY_API}/contributor/${addressArray[0]}`
      );
      return {
        success: true,
        data,
      };
    } else {
      return {
        success: false,
        message: walletStatus_Message_ConnectWallet,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
