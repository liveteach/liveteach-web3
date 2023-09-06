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
          <a href="https://www.vegascity.org/" target="_blank">Website</a>
        </div>
      </div>
  );
}

export default FooterNav;