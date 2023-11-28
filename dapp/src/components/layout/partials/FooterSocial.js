import React from "react";
const FooterSocial = ({ className, ...props }) => {

  return (
      <div {...props} className="secondary-footer">
        <div className="social-links">
          <a href="https://www.facebook.com/dcluni/" target="_blank" rel="noreferrer">
            <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
            >
              <title>Facebook</title>
              <path fill="grey" d="M6.023 16L6 9H3V6h3V4c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V6H13l-1 3H9.28v7H6.023z" />
            </svg>
          </a>
        </div>
        <div className="social-links">
          <a href="https://twitter.com/dcluniversity" target="_blank" rel="noreferrer">
            <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
            >
              <title>Twitter</title>
              <path fill="grey" d="M16 3c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4C.7 7.7 1.8 9 3.3 9.3c-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H0c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4C15 4.3 15.6 3.7 16 3z" />
            </svg>
          </a>
        </div>
          <div
              className="links"
          >
              <a href="https://www.decentraland.university/" target="_blank" rel="noreferrer">
                  <svg
                      width="18"
                      height="18"
                      viewBox="0 0 64 64"
                      xmlns="http://www.w3.org/2000/svg"
                      strokeWidth="5"
                      stroke="grey"
                      fill="none">
                      <title>DCLU Website</title>
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                      <g id="SVGRepo_iconCarrier">
                          <path d="M39.93,55.72A24.86,24.86,0,1,1,56.86,32.15a37.24,37.24,0,0,1-.73,6"/>
                          <path d="M37.86,51.1A47,47,0,0,1,32,56.7"/>
                          <path d="M32,7A34.14,34.14,0,0,1,43.57,30a34.07,34.07,0,0,1,.09,4.85"/>
                          <path d="M32,7A34.09,34.09,0,0,0,20.31,32.46c0,16.2,7.28,21,11.66,24.24"/>
                          <line x1="10.37" y1="19.9" x2="53.75" y2="19.9"/>
                          <line x1="32" y1="6.99" x2="32" y2="56.7"/>
                          <line x1="11.05" y1="45.48" x2="37.04" y2="45.48"/>
                          <line x1="7.14" y1="32.46" x2="56.86" y2="31.85"/>
                          <path d="M53.57,57,58,52.56l-8-8,4.55-2.91a.38.38,0,0,0-.12-.7L39.14,37.37a.39.39,0,0,0-.46.46L42,53.41a.39.39,0,0,0,.71.13L45.57,49Z">

                          </path></g></svg>
              </a>
          </div>
      </div>
  );
};

export default FooterSocial;
