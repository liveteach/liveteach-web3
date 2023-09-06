import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
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
  const classes = classNames(
      "site-footer center-content-mobile",
      topOuterDivider && "has-top-divider",
      className
  );

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