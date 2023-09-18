// Wallet status
export const walletStatus_Connected = "CONNECTED";
export const walletStatus_ConnectWallet = "CONNECT WALLET";
export const walletStatus_InstallWallet = "INSTALL WALLET";
export const walletStatus_Error = "ERROR";
export const walletStatus_ReloadPage = "YOU DENIED CONNECTION";

// Wallet status Message
export const walletStatus_Message_ReloadPage =
  "Click top right button to connect metamask.";
export const walletStatus_Message_Connected =
  "You connected metamask.";
export const walletStatus_Message_ConnectWallet =
  "🦊 Connect to Metamask using the top right button.";
export const walletStatus_Message_InstallWallet = (
  <span>
    {" "}
    🦊{" "}
    <a
      target="_blank"
      href={`https://metamask.io/download.html`}
      rel="noreferrer"
    >
      You must install Metamask, a virtual Ethereum wallet, in your browser.
    </a>
  </span>
);
