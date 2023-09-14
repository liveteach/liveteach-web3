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
import AppRouteAdmin from "./utils/AppRouteAdmin";
import ClassroomAdmin from "./components/sections/ClassroomAdmin";
import LandOperator from "./components/sections/LandOperator";
import Student from "./components/sections/Student";
import Teacher from "./components/sections/Teacher";
import {Test} from "./components/sections/Test";

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
      history.push("/student");
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
        {/* route to home */}
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

        {/*common routes*/}

        <AppRoute
            exact
            path="/student"
            component={Student}
            layout={LayoutDefault}
        />

        <AppRoute
            exact
            path="/teacher"
            component={Test}
            layout={LayoutDefault}
        />

        {/* private Routes */}

          <AppRouteAdmin
              exact
              path="/classadmin"
              isPrivate={isPrivate}
              component={ClassroomAdmin}
              layout={LayoutDefault}
          />
          <AppRouteAdmin
              exact
              path="/operator"
              isPrivate={isPrivate}
              component={LandOperator}
              layout={LayoutDefault}
          />


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

