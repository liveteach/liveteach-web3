import React, {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import {Link} from "react-router-dom";
import Logo from "./partials/Logo";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {setAuth, setAvatar, setName, setWalletAddress, setAvatarLoaded} from "../../store/adminUser";
import { getCurrentWalletConnected} from "../../utils/interact";
import {checkConnectedWalletAddress} from "../../utils/AuthCheck";

const propTypes = {
  authenticated: PropTypes.bool,
};

const defaultProps = {
  authenticated: false,
};

const Header = ({
                  authenticated,
                  ...props
                }) => {

  const { avatar,name,auth, avatarLoaded } = useSelector((state) => state.adminUser);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null)

  useEffect( () => {

    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };


  }, [isMenuOpen]);

  useEffect(() => {
    dispatch(setAuth(checkConnectedWalletAddress().auth));
    getCurrentWalletConnected().then( result => {
      console.log(result)
      getProfile(result.address).then(() => dispatch(setAvatarLoaded(true)));
      dispatch(setWalletAddress(result.address))
    })
  },[avatarLoaded])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getProfile = async (address) => {
    if(address){
      try {
        const result = await axios.get(
            `https://peer.decentraland.org/lambdas/profiles/${address}`
        );
        console.log(result);
        dispatch(setAvatar(result.data.avatars[0].avatar.snapshots.face256));
        dispatch(setName(result.data.avatars[0].name));
      } catch (error) {
        console.error("Error:", error);
      }
    }}

  return (
      <header className="dcl navbar fullscreen">
         <>
              <nav
                  className="ui container"
              >
                <div className="dcl navbar-menu">
                  <div className="ui secondary stackable menu">
                    <div className="dcl navbar-logo">
                      <Logo />
                    </div>
                    <div className="item tabColor">
                      <Link to={"/FAQ"} ><span className="tabColor">FAQ</span></Link>
                    </div>
                    <div className="item tabColor">
                      <Link to={"/docs"} ><span className="tabColor">DOCS</span></Link>
                    </div>
                  </div>

                </div>

                {(auth && avatarLoaded) ? (
                    <div className="dcl navbar-account">
                      <Button
                          className="ui small basic button"
                          size="small"
                          variant="contained"
                          disabled
                      >
                        connected
                      </Button>
                      <div className="dcl user-menu">
                        <div className="toggle" onClick={toggleMenu}>
                          <div className="dcl avatar-face medium">
                            <img src={avatar} alt=""/>
                          </div>
                        </div>
                        <div className={`menu ${isMenuOpen ? "open clickable" : ""}`} ref={menuRef}>
                          <div className="info">
                            <div className="image">
                              <div className="dcl avatar-face small">
                                <img src={avatar} alt="" />
                              </div>
                            </div>
                            <div >
                              <div className="name">
                                {name}
                              </div>
                            </div>
                          </div>
                          <ul className="actions">
                            <a href="https://account.decentraland.org" target="_blank" rel="noreferrer" >
                              <li>
                                <i aria-hidden={true} className="user icon" ></i>
                                Profile
                              </li>
                            </a>
                            <a href="https://profile.decentraland.org"  target="_blank" rel="noreferrer" >
                              <li>
                                <div className="WalletIcon">
                                  <svg width={13} height={13} viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.95 1C0.87295 1 0 1.92338 0 3.0625V9.9375C0 11.3125 0.65 12 1.95 12H11.05C12.35 12 13 11.3125 13 9.9375V4.4375C13 4.05779 12.7088 3.75 12.35 3.75H11.7V1.6875C11.7 1.30779 11.4088 1 11.05 1H1.95ZM1.95 2.375H10.4V3.75H1.95C1.5912 3.75 1.3 3.44221 1.3 3.0625C1.3 2.68279 1.5912 2.375 1.95 2.375ZM9.75 6.5C10.1088 6.5 10.4 6.80779 10.4 7.1875C10.4 7.56721 10.1088 7.875 9.75 7.875C9.3912 7.875 9.1 7.56721 9.1 7.1875C9.1 6.80779 9.3912 6.5 9.75 6.5Z" fill="none"></path>
                                  </svg>
                                </div>
                                Wallet
                              </li>
                            </a>
                          </ul>
                        </div>
                      </div>
                    </div>

                ) : (
                    <div className="dcl navbar-account">
                      <Button
                          className="ui small basic button"
                          size="small"
                          variant="contained"
                      >
                        <Link to={'/login'}>LOGIN</Link>
                      </Button>
                    </div>
                )}
              </nav>
            </>
      </header>
  );
};

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
