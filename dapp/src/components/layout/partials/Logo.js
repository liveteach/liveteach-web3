import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";

const Logo = ({ className, ...props }) => {
  const classes = classNames("brand", className);

  return (
    <div {...props} className={classes}>
        <Link to="#">
          <img className={"logo"} src="vegas-city-logo-no-text.png" alt="Open" width="40px" />
        </Link>
    </div>
  );
};

export default Logo;
