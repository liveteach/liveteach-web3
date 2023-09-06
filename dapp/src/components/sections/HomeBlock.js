import React, { useEffect } from "react";
import {getContributorAdmin} from "../../utils/interact";
import {useDispatch, useSelector} from "react-redux";
import {setWalletAddress } from "../../store/adminUser";

const HomeBlock = ({
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

  const { walletAddress, name } = useSelector((state) => state.adminUser);
  const dispatch = useDispatch();

  useEffect(async () => {
    // await getContributorAdmin().then((result)=>{
    //   dispatch(setWalletAddress(result))
    // })
  }, [walletAddress]);


  return (
      <section {...props} className="ui container">
      </section>
  );
};


export default HomeBlock;
