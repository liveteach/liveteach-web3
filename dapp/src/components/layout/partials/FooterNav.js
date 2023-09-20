import React from 'react';

const FooterNav = ({
                     className,
                     ...props
                   }) => {


  return (
      <div className="main-footer">
        <div
            className="links"
        >
          <a href="https://www.decentraland.university/" target="_blank" rel="noreferrer">Website</a>
        </div>
      </div>
  );
}

export default FooterNav;