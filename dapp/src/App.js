import React, {useEffect, useState} from "react";
import { useLocation, Switch, useHistory} from "react-router-dom";
import AppRoute from "./utils/AppRoute";
import {FAQ} from "./components/sections/FAQ";

// Layouts
import LayoutDefault from "./layouts/LayoutDefault";
import LayoutLogIn from "./layouts/LayoutLogIn";

// Views
import LogIn from "./views/LogIn";

// AuthCheck Utils
import {checkConnectedWalletAddress, userCheck} from "./utils/AuthCheck";
import {setIsPrivate} from "./store/adminUser";
import {useDispatch, useSelector} from "react-redux";
import Home from "./views/Home";

const App = () => {
  const history = useHistory();
  let location = useLocation();
  const {isPrivate} = useSelector((state) => state.adminUser)
  const dispatch = useDispatch();
  useEffect(() => {
    document.body.classList.add("is-loaded");
  }, [location]);

  useEffect(() => {
    const auth = checkConnectedWalletAddress();
    if (auth.auth) {
      history.push("/home");
    } else {
      history.push("/login");
    }
  }, []);

  useEffect(async () => {
      // await userCheck().then(result => {
      //       dispatch(setIsPrivate(!result.admin));
      // })
  })
  return (
      <Switch>
        {/* route to contributors */}
          <AppRoute
              exact
              path="/home"
              component={Home}
              layout={LayoutDefault}
          />
        {/* route for login */}
        <AppRoute
            exact
            path="/login"
            component={LogIn}
            layout={LayoutLogIn}
        />

        {/* private Routes */}

          {/*<AppRouteAdmin*/}
          {/*    exact*/}
          {/*    path="/contributoradmin"*/}
          {/*    isPrivate={isPrivate}*/}
          {/*    component={Home}*/}
          {/*    layout={LayoutDefault}*/}
          {/*/>*/}


          <AppRoute
              exact
              path="/FAQ"
              component={FAQ}
              layout={LayoutDefault}
          />
      </Switch>
  );
};

export default App;

