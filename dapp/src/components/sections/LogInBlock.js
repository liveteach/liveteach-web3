import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import { SectionTilesProps } from "../../utils/SectionProps";
import SectionHeader from "./partials/SectionHeader";
import { connectWallet, getCurrentWalletConnected } from "../../utils/interact";
import { Box, Button, Typography } from "@mui/material";
import {
  walletStatus_Error,
  walletStatus_Connected,
} from "../../utils/constants";
import {Modal} from "@material-ui/core";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const propTypes = {
  ...SectionTilesProps.types,
};

const defaultProps = {
  ...SectionTilesProps.defaults,
};

const LogInBlock = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  pushLeft,
  ...props
}) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletStatus, setWalletStatus] = useState({ status: "", message: "" });
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const history = useHistory();

  useEffect(async () => {
    const { address, status, message } = await getCurrentWalletConnected();
    setWalletAddress(address);
    setWalletStatus({ status, message });
    if (status === walletStatus_Connected) {
      history.push("/home");
    }
  }, []);

  const connectWalletPressed = async () => {
    const { status, address, message } = await connectWallet();
    setWalletAddress(address);
    setWalletStatus({ status, message });
    if (status === walletStatus_Connected) {
      history.push("/home");
    } else {
      console.log("Opening modal")
      handleOpen()
    }
  };

  const outerClasses = classNames(
    "testimonial section",
    topOuterDivider && "has-top-divider",
    bottomOuterDivider && "has-bottom-divider",
    hasBgColor && "has-bg-color",
    invertColor && "invert-color",
    className
  );

  const sectionHeader = {
    title: "Vegas City",
    paragraph: "Please connect your metamask.",
  };

  return (
    <section {...props} className={outerClasses}>
      <div className="ui container">
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
          <div className="ui page modals dimmer transition visible active" >
            <div className="ui modal transition visible active " style={style}>
                <img className="ui header" src="./metamask.svg" alt="metamask" width="100" style={{margin: 'auto'}} />
                <div className="dcl modal-navigation-button modal-navigation-close" onClick={handleClose}>
                </div>
                  <Typography
                      id="transition-modal-title"
                      variant="h6"
                      component="h2"
                      className="dcl modal-navigation"
                  >
                    {walletStatus.status}
                  </Typography>
                  <Typography id="content" sx={{ mt: 2 }}>
                    {walletStatus.message}
                  </Typography>
              </div>
          </div>
        </Modal>
        <div className="SignIn ">
          <SectionHeader data={sectionHeader} className="ui header">
            <Button
              id="walletButton"
              className="ui small primary button"
              onClick={connectWalletPressed}
            >
              {walletAddress.length > 0 ? (
                "Connected: " +
                String(walletAddress).substring(0, 6) +
                "..." +
                String(walletAddress).substring(38)
              ) : (
                <span>login with metamask</span>
              )}
            </Button>
          </SectionHeader>
        </div>

      </div>

      {/* wallet status modal */}
    </section>
  );
};

LogInBlock.propTypes = propTypes;
LogInBlock.defaultProps = defaultProps;

export default LogInBlock;
