import React from 'react';
import DAO_logo from "../../../images/DAO_logo.png";

const FooterNav = ({
                     className,
                     ...props
                   }) => {


  return (
      <div className="main-footer">
          <div className="social-links">
              <img height="20px" alt="Decentraland.DAO" src={DAO_logo}/>
          </div>

      </div>
  );
}

export default FooterNav;