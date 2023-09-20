import React from "react";
import PropTypes from "prop-types";
import FooterSocial from "./partials/FooterSocial";
import FooterNav from "./partials/FooterNav";

const propTypes = {
  topOuterDivider: PropTypes.bool,
  topDivider: PropTypes.bool,
};

const defaultProps = {
  topOuterDivider: false,
  topDivider: false,
};

const Footer = ({ className, topOuterDivider, topDivider, ...props }) => {


  return (
      <div {...props} className="ui container dcl footer">
        <FooterNav />
        <FooterSocial />
      </div>
  );
};
/* <FooterNav />*/
Footer.propTypes = propTypes;
Footer.defaultProps = defaultProps;

export default Footer;