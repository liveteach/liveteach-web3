import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import DCLULogo  from './DCLULogo.png';

const Logo = ({ className, ...props }) => {
  const classes = classNames("brand", className);

  return (
    <div {...props} className={classes}>
        <Link to={"/login"}>
          <img className={"logo"} src={DCLULogo} alt="Open" width="40px" />
        </Link>
    </div>
  );
};

export default Logo;
